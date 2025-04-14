"use client"

import { useState, useEffect } from "react"
import { jsPDF } from "jspdf"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Calculator from "@/components/Calculator"
import CurrencyConverter from "@/components/CurrencyConverter"

interface NotepadItem {
  id: string
  content: string
  type: "bullet" | "text"
  amount?: number
}

// Enhanced NotepadProps interface with all customization options
interface NotepadProps {
  notepadId?: string
  pagePath?: string
  pageTitle?: string
  logoPath?: string // Main logo
  // Different logos for each corner
  topLeftLogo?: string
  topRightLogo?: string
  bottomLeftLogo?: string
  bottomRightLogo?: string
  // PDF styling options
  pdfTextColor?: string
  pdfBackgroundColor?: string
  pdfFontSize?: number
  pdfFontFamily?: string
  // Header/Footer customization
  pdfHeaderText?: string
  pdfFooterText?: string
}

export default function Notepad({
  notepadId = "notepad-notes",
  pagePath = "",
  pageTitle = "General",
  logoPath = "/images/logo.png", // Default main logo
  // Default corner logos
  topLeftLogo = "/images/logo.png",
  topRightLogo = "/images/logo.png",
  bottomLeftLogo = "/images/logo.png",
  bottomRightLogo = "/images/logo.png",
  // Default PDF styling
  pdfTextColor = "#333333",
  pdfBackgroundColor = "#ffffff",
  pdfFontSize = 12,
  pdfFontFamily = "helvetica",
  // Default header/footer text
  pdfHeaderText = "",
  pdfFooterText = "© OneShopDiscount.com",
}: NotepadProps) {
  const [notes, setNotes] = useState<NotepadItem[]>([])
  const [currentNote, setCurrentNote] = useState("")
  const [currentAmount, setCurrentAmount] = useState<string>("")
  const [noteType, setNoteType] = useState<"bullet" | "text">("text")
  const [showTools, setShowTools] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showConverter, setShowConverter] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(notepadId)
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes))
      } catch (error) {
        console.error(`Error parsing saved notes for ${notepadId}:`, error)
        setNotes([])
      }
    }
  }, [notepadId]) // Add notepadId as a dependency

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(notepadId, JSON.stringify(notes))
  }, [notes, notepadId]) // Add notepadId as a dependency

  const addNote = () => {
    if (currentNote.trim()) {
      const newNote: NotepadItem = {
        id: Date.now().toString(),
        content: currentNote,
        type: noteType,
        amount: currentAmount ? Number.parseFloat(currentAmount) : undefined,
      }
      setNotes([...notes, newNote])
      setCurrentNote("")
      setCurrentAmount("")
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const clearAllNotes = () => {
    setNotes([])
  }

  const calculateTotal = () => {
    return notes.reduce((sum, note) => sum + (note.amount || 0), 0)
  }

  const getCurrentDateTime = () => {
    return new Date().toLocaleString()
  }

  // Helper function to convert hex color to RGB
  const hexToRgb = (hex: string) => {
    try {
      // Remove # if present
      hex = hex.replace(/^#/, "")

      // Parse hex values
      const bigint = Number.parseInt(hex, 16)
      const r = (bigint >> 16) & 255
      const g = (bigint >> 8) & 255
      const b = bigint & 255

      return { r, g, b }
    } catch (error) {
      console.error("Error parsing hex color:", error)
      return { r: 0, g: 0, b: 0 } // Default to black if there's an error
    }
  }

  // Function to get page-specific watermark text
  const getWatermarkText = () => {
    switch (pagePath) {
      case "/electronics":
       return "/OneShopDiscount electronics"
      case "/construction-materials":
      return "/OneShopDiscount construction-materials"
      case "/drinks":
      return "/OneShopDiscount drinks"
      case "/agriculture-deals":
      return "OneShopDiscount agriculture-deals"
      case "/beauty-and-massage":
        return "OneShopDiscount beauty-and-massage"
      case "/finance":
        return "OneShopDiscount Finance"
      case "/real-estate":
        return "OneShopDiscount Real Estate"
      case "/car-deals":
        return "OneShopDiscount Car Deals"
      case "/health-services":
        return "OneShopDiscount Health"
      case "/hospitality":
        return "OneShopDiscount Hospitality"
      case "/insurance":
        return "OneShopDiscount Insurance"
      case "/entertainment":
        return "OneShopDiscount Entertainment"
      case "/other-business-ventures":
        return "OneShopDiscount Business"
      case "/retail-and-supermarket":
        return "OneShopDiscount Retail"
      case "/tourism-and-adventures":
        return "OneShopDiscount Tourism"
      case "/travelling":
        return "OneShopDiscount Travel"
      default:
        return "OneShopDiscount"
    }
  }

  // Enhanced exportToPDF function with better organization and layout
  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()

      // Set font family and text color
      doc.setFont(pdfFontFamily)
      const textColor = hexToRgb(pdfTextColor)
      doc.setTextColor(textColor.r, textColor.g, textColor.b)

      // Add background color if not white
      if (pdfBackgroundColor !== "#ffffff") {
        const bgColor = hexToRgb(pdfBackgroundColor)
        doc.setFillColor(bgColor.r, bgColor.g, bgColor.b)
        doc.rect(0, 0, pageWidth, pageHeight, "F")
      }

      // Add header with better spacing and alignment
      doc.setFontSize(18)
      doc.setFont(pdfFontFamily, "bold")
      const headerText = pdfHeaderText || `${pageTitle} Notes`
      doc.text(headerText, pageWidth / 2, 20, { align: "center" })

      // Add date and time below the title with proper formatting
      doc.setFontSize(11)
      doc.setFont(pdfFontFamily, "normal")
      doc.text(`Generated: ${getCurrentDateTime()}`, pageWidth / 2, 30, { align: "center" })

      // Add underline for the title with proper spacing
      const titleWidth = doc.getTextWidth(headerText)
      doc.line(pageWidth / 2 - titleWidth / 2, 23, pageWidth / 2 + titleWidth / 2, 23)

      // Add watermark
      doc.setFontSize(60)
      doc.setTextColor(240, 240, 240) // Very light gray for watermark
      doc.text(getWatermarkText(), pageWidth / 2, 150, {
        align: "center",
        angle: 45,
      })

      // Reset for content with improved text color
      doc.setTextColor(textColor.r, textColor.g, textColor.b)
      doc.setFontSize(pdfFontSize)
      doc.setFont(pdfFontFamily, "normal")

      // Improved table layout with more spacing
      let yPosition = 50
      const columnWidths = [15, 110, 30, 35]
      const rowHeight = 10
      const cellPadding = 2

      if (notes.length > 0) {
        // Table headers with better styling
        const headers = ["No.", "Content", "Type", "Amount"]

        // Draw header row with better background
        doc.setFillColor(220, 220, 220)
        doc.rect(10, yPosition - 5, pageWidth - 20, rowHeight, "F")

        // Draw header text with bold font
        doc.setFont(pdfFontFamily, "bold")
        let xPosition = 15
        headers.forEach((header, index) => {
          doc.text(header, xPosition, yPosition)
          xPosition += columnWidths[index]
        })
        yPosition += rowHeight + 2 // Add extra spacing after header

        // Reset to normal font for content
        doc.setFont(pdfFontFamily, "normal")

        // Draw content rows with alternating background for better readability
        notes.forEach((note, index) => {
          // Content with word wrap and proper alignment
          const contentLines = doc.splitTextToSize(note.content, columnWidths[1] - 5)

          // Add new page if needed with proper header/footer
          if (yPosition > pageHeight - 30) {
            doc.addPage()
            yPosition = 20

            // Add watermark to new page
            doc.setFontSize(60)
            doc.setTextColor(240, 240, 240) // Very light gray for watermark
            doc.text(getWatermarkText(), pageWidth / 2, 150, {
              align: "center",
              angle: 45,
            })

            // Reset text properties
            doc.setTextColor(textColor.r, textColor.g, textColor.b)
            doc.setFontSize(pdfFontSize)
            doc.setFont(pdfFontFamily, "normal")
          }

          // Add alternating row background
          if (index % 2 === 1) {
            doc.setFillColor(245, 245, 245)
            doc.rect(10, yPosition - 5, pageWidth - 20, Math.max(rowHeight, contentLines.length * 7), "F")
          }

          let xPosition = 15

          // Row number
          doc.text((index + 1).toString(), xPosition, yPosition)
          xPosition += columnWidths[0]

          // Content
          doc.text(contentLines, xPosition, yPosition)
          xPosition += columnWidths[1]

          // Type with capitalization
          doc.text(note.type.charAt(0).toUpperCase() + note.type.slice(1), xPosition, yPosition)
          xPosition += columnWidths[2]

          // Amount with proper formatting
          if (note.amount !== undefined) {
            doc.text(note.amount.toFixed(2), xPosition, yPosition)
          } else {
            doc.text("-", xPosition, yPosition)
          }

          yPosition += Math.max(rowHeight, contentLines.length * 7) + cellPadding
        })

        // Add total amount with better styling
        yPosition += 5
        doc.setFillColor(220, 220, 220)
        doc.rect(10, yPosition - 5, pageWidth - 20, rowHeight, "F")

        doc.setFont(pdfFontFamily, "bold")
        doc.text(`Total Amount: ${calculateTotal().toFixed(2)}`, 15, yPosition)
      } else {
        doc.text("No items in the list", 15, yPosition)
      }

      // Footer
      doc.setFont(pdfFontFamily, "italic")
      doc.text(
        pdfFooterText || "Powered by Ctech solutions. 2025 ALL RIGHTS RESERVED",
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" },
      )

      // Save with custom filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19)
      const filename = `OneShopDiscount-${pageTitle.toLowerCase().replace(/\s+/g, "-")}-${timestamp}.pdf`
      doc.save(filename)

      console.log("PDF exported successfully")
    } catch (error) {
      console.error("PDF Generation Error:", error)
      alert("There was an error generating the PDF. Please try again.")
    }
  }

  return (
    <div className={`w-full max-w-2xl mx-auto ${showTools ? "bg-blue-900" : "bg-blue-700"} rounded-3xl shadow-lg p-6`}>
      <Button
        onClick={() => setShowTools(!showTools)}
        className="mb-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-2xl"
      >
        {showTools ? "Hide Notepad" : "Show Notepad"}
      </Button>
      {showTools && (
        <>
          <div className="mb-6">
            {/* Removed image and logo section as requested */}
            <h2 className="text-2xl font-bold mb-4 text-white">{pageTitle} Notes</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <Select value={noteType} onValueChange={(value: "bullet" | "text") => setNoteType(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select note type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Plain Text</SelectItem>
                  <SelectItem value="bullet">Bullet Points</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setShowCalculator(!showCalculator)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-2xl"
              >
                {showCalculator ? "Hide Calculator" : "Show Calculator"}
              </Button>
              <Button
                onClick={() => setShowConverter(!showConverter)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-2xl"
              >
                {showConverter ? "Hide Converter" : "Show Converter"}
              </Button>
            </div>

            {showCalculator && (
              <div className="mb-4">
                <Calculator />
              </div>
            )}

            {showConverter && (
              <div className="mb-4">
                <CurrencyConverter />
              </div>
            )}

            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Type your notes here..."
                  className="min-h-[100px] text-base text-gray-900 bg-white border border-gray-300"
                />
                <Input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="Enter amount (optional)"
                  className="mt-2 text-gray-900 bg-white border border-gray-300"
                />
              </div>
              <Button
                onClick={addNote}
                className="self-start bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-2xl"
              >
                Add Note
              </Button>
            </div>
          </div>

          <Tabs defaultValue="notes" className="w-full">
            <TabsList className="mb-4 flex">
              <TabsTrigger
                value="notes"
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-l-2xl"
              >
                Notes View
              </TabsTrigger>
              <TabsTrigger
                value="table"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-2xl"
              >
                Table View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notes" className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                  <div className="flex-1 text-gray-900">
                    {note.type === "bullet" ? (
                      <div className="flex">
                        <span className="mr-2">•</span>
                        <span>{note.content}</span>
                      </div>
                    ) : (
                      <p>{note.content}</p>
                    )}
                    {note.amount !== undefined && (
                      <p className="text-sm text-gray-600 mt-1">Amount: {note.amount.toFixed(2)}</p>
                    )}
                  </div>
                  <Button
                    onClick={() => deleteNote(note.id)}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl"
                  >
                    Delete
                  </Button>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="text-center p-4 bg-gray-50 rounded">
                  <p className="text-gray-500">No notes yet. Add some notes to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="table">
              {/* Fixed table view with better visibility for all columns */}
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full min-w-full table-fixed">
                  <thead className="bg-gray-100 text-gray-900">
                    <tr>
                      <th className="px-4 py-2 text-left w-[10%]">No.</th>
                      <th className="px-4 py-2 text-left w-[45%]">Content</th>
                      <th className="px-4 py-2 text-left w-[15%]">Type</th>
                      <th className="px-4 py-2 text-left w-[15%]">Amount</th>
                      <th className="px-4 py-2 text-left w-[15%]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-900">
                    {notes.map((note, index) => (
                      <tr key={note.id} className="border-t bg-white text-gray-900">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 break-words">{note.content}</td>
                        <td className="px-4 py-2 capitalize">{note.type}</td>
                        <td className="px-4 py-2">{note.amount !== undefined ? note.amount.toFixed(2) : "-"}</td>
                        <td className="px-4 py-2">
                          <Button
                            onClick={() => deleteNote(note.id)}
                            variant="destructive"
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl w-full"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {notes.length === 0 && (
                      <tr className="border-t bg-white text-gray-900">
                        <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                          No notes yet. Add some notes to get started.
                        </td>
                      </tr>
                    )}
                    {notes.length > 0 && (
                      <tr className="border-t bg-gray-50 font-bold">
                        <td colSpan={3} className="px-4 py-2 text-right">
                          Total:
                        </td>
                        <td className="px-4 py-2">{calculateTotal().toFixed(2)}</td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-4 mt-6">
            <Button
              onClick={clearAllNotes}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-2xl"
            >
              Clear All Notes
            </Button>
            <Button
              onClick={exportToPDF}
              variant="outline"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-2xl"
            >
              Export to PDF
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

