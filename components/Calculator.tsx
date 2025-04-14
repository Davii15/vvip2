"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState("0")
  const [currentValue, setCurrentValue] = useState("")
  const [previousValue, setPreviousValue] = useState("")
  const [operator, setOperator] = useState("")
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const updateHistory = (operation: string) => {
    setHistory((prevHistory) => [...prevHistory, operation])
  }

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num)
      setCurrentValue(num)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
      setCurrentValue(currentValue === "0" ? num : currentValue + num)
    }
  }

  const handleOperatorClick = (op: string) => {
    if (operator && currentValue && !waitingForOperand) {
      const result = calculate()
      const operation = `${previousValue} ${operator} ${currentValue} = ${result}`
      setDisplay(`${result} ${op}`)
      updateHistory(operation)
      setPreviousValue(result.toString())
      setCurrentValue("")
    } else if (currentValue) {
      setDisplay(`${currentValue} ${op}`)
      setPreviousValue(currentValue)
      setCurrentValue("")
    } else if (previousValue) {
      setDisplay(`${previousValue} ${op}`)
    }
    setOperator(op)
    setWaitingForOperand(true)
  }

  const handleEqualsClick = () => {
    if (operator && previousValue && currentValue) {
      const result = calculate()
      const operation = `${previousValue} ${operator} ${currentValue} = ${result}`
      setDisplay(result.toString())
      updateHistory(operation)
      setCurrentValue(result.toString())
      setPreviousValue("")
      setOperator("")
      setWaitingForOperand(true)
    }
  }

  const calculate = (): number => {
    const prev = Number.parseFloat(previousValue)
    const current = Number.parseFloat(currentValue)
    switch (operator) {
      case "+":
        return prev + current
      case "-":
        return prev - current
      case "*":
        return prev * current
      case "/":
        return prev / current
      default:
        return current
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setCurrentValue("")
    setPreviousValue("")
    setOperator("")
    setWaitingForOperand(false)
    setHistory([])
  }

  const handleClearHistory = () => {
    setHistory([])
  }

  const handleDecimal = () => {
    if (!currentValue.includes(".")) {
      const newValue = currentValue + "."
      setDisplay(display.includes(" ") ? display + "." : newValue)
      setCurrentValue(newValue)
    }
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <div className="bg-white p-2 mb-4 rounded text-right text-xl h-40 flex flex-col items-end justify-end overflow-y-auto">
        <div className="text-gray-600 text-sm mb-2 w-full">
          {history.map((op, index) => (
            <div key={index} className="text-left">
              {op}
            </div>
          ))}
        </div>
        <div className="text-2xl w-full">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {["7", "8", "9", "/"].map((btn) => (
          <Button
            key={btn}
            onClick={() => (btn === "/" ? handleOperatorClick(btn) : handleNumberClick(btn))}
            variant={btn === "/" ? "secondary" : "default"}
          >
            {btn}
          </Button>
        ))}
        {["4", "5", "6", "*"].map((btn) => (
          <Button
            key={btn}
            onClick={() => (btn === "*" ? handleOperatorClick(btn) : handleNumberClick(btn))}
            variant={btn === "*" ? "secondary" : "default"}
          >
            {btn}
          </Button>
        ))}
        {["1", "2", "3", "-"].map((btn) => (
          <Button
            key={btn}
            onClick={() => (btn === "-" ? handleOperatorClick(btn) : handleNumberClick(btn))}
            variant={btn === "-" ? "secondary" : "default"}
          >
            {btn}
          </Button>
        ))}
        <Button onClick={() => handleNumberClick("0")}>0</Button>
        <Button onClick={handleDecimal}>.</Button>
        <Button onClick={handleEqualsClick} variant="secondary">
          =
        </Button>
        <Button onClick={() => handleOperatorClick("+")} variant="secondary">
          +
        </Button>
        <Button onClick={handleClearHistory} variant="secondary" className="col-span-2">
          Clear History
        </Button>
        <Button onClick={handleClear} variant="destructive" className="col-span-2">
          Clear All
        </Button>
      </div>
    </div>
  )
}

export default Calculator

