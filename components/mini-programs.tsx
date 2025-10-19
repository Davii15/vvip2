"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  MapPin,
  Phone,
  Globe,
  Mail,
  Star,
  Clock,
  Users,
  Utensils,
  Heart,
  Sparkles,
  Building2,
  GraduationCap,
  Search,
  ChevronRight,
  MessageCircle,
} from "lucide-react"
import Image from "next/image"

// Mini Program Categories
const miniPrograms = [
  {
    id: "entertainment",
    name: "Dunda/Burudani",
    nameEn: "Entertainment Places",
    icon: <Users className="h-8 w-8" />,
    color: "from-purple-500 to-pink-500",
    description: "Mahali pa burudani na michezo",
  },
  {
    id: "food",
    name: "Foods Kafe",
    nameEn: "Food & Restaurants",
    icon: <Utensils className="h-8 w-8" />,
    color: "from-orange-500 to-red-500",
    description: "Vyakula na mikahawa bora",
  },
  {
    id: "health",
    name: "Huduma za Afya",
    nameEn: "Health Services",
    icon: <Heart className="h-8 w-8" />,
    color: "from-green-500 to-teal-500",
    description: "Huduma za afya karibu nawe",
  },
  {
    id: "spa",
    name: "Spa na Massage",
    nameEn: "Spa & Massage",
    icon: <Sparkles className="h-8 w-8" />,
    color: "from-pink-500 to-rose-500",
    description: "Utulivu na uponyaji wa mwili",
  },
  {
    id: "banks",
    name: "Benki Karibu",
    nameEn: "Banks Around You",
    icon: <Building2 className="h-8 w-8" />,
    color: "from-blue-500 to-indigo-500",
    description: "Huduma za kifedha karibu nawe",
  },
  {
    id: "education",
    name: "Vyuo na Chuo Kikuu",
    nameEn: "Colleges & Universities",
    icon: <GraduationCap className="h-8 w-8" />,
    color: "from-indigo-500 to-purple-500",
    description: "Elimu ya juu na mafunzo",
  },
]

// Mock data for each category
const mockBusinessData = {
  entertainment: [
    {
      id: 1,
      name: "Carnivore Restaurant",
      nameSwahili: "Mkahawa wa Carnivore",
      category: "Restaurant & Entertainment",
      location: "Langata, Nairobi",
      rating: 4.8,
      price: "KES 3,500 - 8,000",
      image: "/carnivore-restaurant-nairobi.png",
      description: "Famous for its all-you-can-eat meat experience with live entertainment",
      descriptionSwahili: "Maarufu kwa chakula cha nyama na burudani",
      services: ["Live Music", "Traditional Dance", "Game Meat", "Cocktails"],
      contact: {
        phone: "+254 20 605933",
        whatsapp: "+254712345678",
        email: "info@carnivore.co.ke",
        website: "https://carnivore.co.ke",
      },
      hours: "12:00 PM - 2:00 AM",
      features: ["Parking Available", "Family Friendly", "Live Entertainment"],
    },
    {
      id: 2,
      name: "Uhuru Gardens",
      nameSwahili: "Bustani za Uhuru",
      category: "Recreation Park",
      location: "Langata, Nairobi",
      rating: 4.5,
      price: "KES 100 - 500",
      image: "/uhuru-gardens-nairobi.png",
      description: "National monument and recreational park for families",
      descriptionSwahili: "Bustani ya kitaifa na mahali pa burudani kwa familia",
      services: ["Picnic Areas", "Walking Trails", "Monument Tours", "Events Space"],
      contact: {
        phone: "+254 20 2711261",
        whatsapp: "+254723456789",
        email: "info@uhurugardens.go.ke",
        website: "https://uhurugardens.go.ke",
      },
      hours: "6:00 AM - 6:00 PM",
      features: ["Free Parking", "Family Friendly", "Historical Site"],
    },
  ],
  food: [
    {
      id: 1,
      name: "Java House",
      nameSwahili: "Nyumba ya Java",
      category: "Coffee Shop & Restaurant",
      location: "Multiple Locations",
      rating: 4.6,
      price: "KES 800 - 2,500",
      image: "/placeholder-9bzr5.png",
      description: "Premium coffee and international cuisine",
      descriptionSwahili: "Kahawa bora na vyakula vya kimataifa",
      services: ["Coffee", "Breakfast", "Lunch", "Dinner", "Pastries"],
      contact: {
        phone: "+254 709 935000",
        whatsapp: "+254734567890",
        email: "info@javahouse.co.ke",
        website: "https://javahouse.co.ke",
      },
      hours: "6:30 AM - 10:00 PM",
      features: ["WiFi", "Delivery", "Takeaway", "Outdoor Seating"],
    },
    {
      id: 2,
      name: "Nyama Mama",
      nameSwahili: "Nyama Mama",
      category: "African Cuisine",
      location: "Westlands, Nairobi",
      rating: 4.7,
      price: "KES 1,200 - 3,000",
      image: "/nyama-mama-restaurant.png",
      description: "Contemporary African cuisine with a modern twist",
      descriptionSwahili: "Vyakula vya kiafrika vya kisasa",
      services: ["Traditional Dishes", "Cocktails", "Live Music", "Private Dining"],
      contact: {
        phone: "+254 711 045000",
        whatsapp: "+254745678901",
        email: "info@nyamamama.co.ke",
        website: "https://nyamamama.co.ke",
      },
      hours: "12:00 PM - 11:00 PM",
      features: ["Valet Parking", "Live Entertainment", "Private Events"],
    },
  ],
  health: [
    {
      id: 1,
      name: "Nairobi Hospital",
      nameSwahili: "Hospitali ya Nairobi",
      category: "Private Hospital",
      location: "Upper Hill, Nairobi",
      rating: 4.4,
      price: "KES 2,000 - 15,000",
      image: "/nairobi-hospital-healthcare.png",
      description: "Leading private healthcare facility in Kenya",
      descriptionSwahili: "Hospitali kuu ya kibinafsi nchini Kenya",
      services: ["Emergency Care", "Surgery", "Maternity", "Diagnostics", "Pharmacy"],
      contact: {
        phone: "+254 20 2845000",
        whatsapp: "+254756789012",
        email: "info@nairobihospital.org",
        website: "https://nairobihospital.org",
      },
      hours: "24/7 Emergency Services",
      features: ["Insurance Accepted", "Ambulance Service", "Specialist Doctors"],
    },
    {
      id: 2,
      name: "Aga Khan Hospital",
      nameSwahili: "Hospitali ya Aga Khan",
      category: "Private Hospital",
      location: "Parklands, Nairobi",
      rating: 4.6,
      price: "KES 1,500 - 12,000",
      image: "/aga-khan-hospital-nairobi.png",
      description: "Quality healthcare with international standards",
      descriptionSwahili: "Huduma za afya za kiwango cha kimataifa",
      services: ["General Medicine", "Pediatrics", "Cardiology", "Oncology", "Dental"],
      contact: {
        phone: "+254 20 3740000",
        whatsapp: "+254767890123",
        email: "info@agakhanhospitals.org",
        website: "https://agakhanhospitals.org",
      },
      hours: "24/7 Services Available",
      features: ["International Standards", "Medical Tourism", "Research Center"],
    },
  ],
  spa: [
    {
      id: 1,
      name: "Tribe Hotel Spa",
      nameSwahili: "Spa ya Hoteli ya Tribe",
      category: "Luxury Spa",
      location: "Gigiri, Nairobi",
      rating: 4.8,
      price: "KES 8,000 - 25,000",
      image: "/tribe-hotel-spa-nairobi-luxury.png",
      description: "Luxury spa treatments in serene environment",
      descriptionSwahili: "Matibabu ya kifahari katika mazingira ya utulivu",
      services: ["Full Body Massage", "Facial Treatments", "Aromatherapy", "Couples Spa"],
      contact: {
        phone: "+254 20 720 0000",
        whatsapp: "+254778901234",
        email: "spa@tribehotel.com",
        website: "https://tribehotel.com/spa",
      },
      hours: "9:00 AM - 9:00 PM",
      features: ["Luxury Amenities", "Professional Therapists", "Organic Products"],
    },
    {
      id: 2,
      name: "Serenity Spa",
      nameSwahili: "Spa ya Utulivu",
      category: "Wellness Center",
      location: "Karen, Nairobi",
      rating: 4.5,
      price: "KES 3,500 - 12,000",
      image: "/serenity-spa-nairobi.png",
      description: "Holistic wellness and relaxation treatments",
      descriptionSwahili: "Matibabu ya utulivu na afya ya jumla",
      services: ["Swedish Massage", "Hot Stone Therapy", "Reflexology", "Yoga Classes"],
      contact: {
        phone: "+254 20 388 0000",
        whatsapp: "+254789012345",
        email: "info@serenityspa.co.ke",
        website: "https://serenityspa.co.ke",
      },
      hours: "8:00 AM - 8:00 PM",
      features: ["Natural Products", "Certified Therapists", "Peaceful Environment"],
    },
  ],
  banks: [
    {
      id: 1,
      name: "Equity Bank",
      nameSwahili: "Benki ya Equity",
      category: "Commercial Bank",
      location: "Multiple Branches",
      rating: 4.3,
      price: "Free - KES 500 (Service Charges)",
      image: "/equity-bank-kenya.png",
      description: "Leading bank in Kenya with extensive branch network",
      descriptionSwahili: "Benki kuu nchini Kenya na matawi mengi",
      services: ["Savings Accounts", "Loans", "Mobile Banking", "Insurance", "Investment"],
      contact: {
        phone: "+254 763 063000",
        whatsapp: "+254790123456",
        email: "info@equitybank.co.ke",
        website: "https://equitybank.co.ke",
      },
      hours: "8:30 AM - 5:00 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)",
      features: ["ATM Network", "Mobile Banking", "Agent Banking"],
    },
    {
      id: 2,
      name: "KCB Bank",
      nameSwahili: "Benki ya KCB",
      category: "Commercial Bank",
      location: "Multiple Branches",
      rating: 4.2,
      price: "Free - KES 300 (Service Charges)",
      image: "/kcb-bank-kenya-branch.png",
      description: "Oldest and largest bank in Kenya by assets",
      descriptionSwahili: "Benki ya zamani na kubwa zaidi nchini Kenya",
      services: ["Current Accounts", "Fixed Deposits", "Mortgages", "Business Banking"],
      contact: {
        phone: "+254 711 087000",
        whatsapp: "+254701234567",
        email: "customercare@kcbgroup.com",
        website: "https://kcbgroup.com",
      },
      hours: "8:30 AM - 5:00 PM (Mon-Fri), 9:00 AM - 1:00 PM (Sat)",
      features: ["Corporate Banking", "International Services", "Digital Banking"],
    },
  ],
  education: [
    {
      id: 1,
      name: "University of Nairobi",
      nameSwahili: "Chuo Kikuu cha Nairobi",
      category: "Public University",
      location: "Nairobi, Kenya",
      rating: 4.4,
      price: "KES 150,000 - 500,000 (Per Year)",
      image: "/university-of-nairobi-campus.png",
      description: "Premier public university in Kenya",
      descriptionSwahili: "Chuo kikuu kuu cha umma nchini Kenya",
      services: ["Undergraduate Programs", "Postgraduate Studies", "Research", "Distance Learning"],
      contact: {
        phone: "+254 20 4913000",
        whatsapp: "+254712345678",
        email: "info@uonbi.ac.ke",
        website: "https://uonbi.ac.ke",
      },
      hours: "8:00 AM - 5:00 PM (Mon-Fri)",
      features: ["Research Excellence", "International Programs", "Scholarships Available"],
    },
    {
      id: 2,
      name: "Strathmore University",
      nameSwahili: "Chuo Kikuu cha Strathmore",
      category: "Private University",
      location: "Nairobi, Kenya",
      rating: 4.7,
      price: "KES 300,000 - 800,000 (Per Year)",
      image: "/strathmore-university-nairobi.png",
      description: "Leading private university known for business and technology",
      descriptionSwahili: "Chuo kikuu cha kibinafsi kinachojulikana kwa biashara na teknolojia",
      services: ["Business Programs", "IT Courses", "Engineering", "Executive Education"],
      contact: {
        phone: "+254 703 034000",
        whatsapp: "+254723456789",
        email: "admissions@strathmore.edu",
        website: "https://strathmore.edu",
      },
      hours: "8:00 AM - 6:00 PM (Mon-Fri)",
      features: ["Industry Partnerships", "Modern Facilities", "Career Services"],
    },
  ],
}

interface Business {
  id: number
  name: string
  nameSwahili: string
  category: string
  location: string
  rating: number
  price: string
  image: string
  description: string
  descriptionSwahili: string
  services: string[]
  contact: {
    phone: string
    whatsapp: string
    email: string
    website: string
  }
  hours: string
  features: string[]
}

export default function MiniPrograms() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState<"en" | "sw">("en")

  const handleProgramClick = (programId: string) => {
    setSelectedProgram(programId)
  }

  const handleBusinessClick = (business: Business) => {
    setSelectedBusiness(business)
  }

  const handleContactClick = () => {
    setShowContactModal(true)
  }

  const getCurrentBusinesses = () => {
    if (!selectedProgram) return []
    return mockBusinessData[selectedProgram as keyof typeof mockBusinessData] || []
  }

  const filteredBusinesses = getCurrentBusinesses().filter(
    (business) =>
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.nameSwahili.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (selectedProgram && !selectedBusiness) {
    const program = miniPrograms.find((p) => p.id === selectedProgram)

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className={`bg-gradient-to-r ${program?.color} text-white py-8 px-4`}>
          <div className="container mx-auto max-w-7xl">
            <Button
              onClick={() => setSelectedProgram(null)}
              variant="outline"
              className="mb-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              ← Rudi Nyuma / Go Back
            </Button>
            <div className="flex items-center gap-4 mb-4">
              {program?.icon}
              <div>
                <h1 className="text-3xl font-bold">{language === "sw" ? program?.name : program?.nameEn}</h1>
                <p className="text-white/90">{program?.description}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              <Button
                onClick={() => setLanguage("en")}
                variant={language === "en" ? "default" : "outline"}
                size="sm"
                className={language === "en" ? "bg-white text-gray-900" : "bg-white/20 border-white/30 text-white"}
              >
                English
              </Button>
              <Button
                onClick={() => setLanguage("sw")}
                variant={language === "sw" ? "default" : "outline"}
                size="sm"
                className={language === "sw" ? "bg-white text-gray-900" : "bg-white/20 border-white/30 text-white"}
              >
                Kiswahili
              </Button>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={language === "sw" ? "Tafuta biashara..." : "Search businesses..."}
                className="pl-10 bg-white/90 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBusinesses.map((business) => (
              <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <Image src={business.image || "/placeholder.svg"} alt={business.name} fill className="object-cover" />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-white/90 text-gray-900">
                      <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                      {business.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">
                      {language === "sw" ? business.nameSwahili : business.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {business.category}
                    </Badge>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    {language === "sw" ? business.descriptionSwahili : business.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4" />
                    {business.location}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4" />
                    {business.hours}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-green-600">{business.price}</span>
                    <Button
                      onClick={() => handleBusinessClick(business)}
                      size="sm"
                      className={`bg-gradient-to-r ${program?.color} text-white`}
                    >
                      {language === "sw" ? "Angalia Zaidi" : "View Details"}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (selectedBusiness) {
    const program = miniPrograms.find((p) => p.id === selectedProgram)

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className={`bg-gradient-to-r ${program?.color} text-white py-6 px-4`}>
          <div className="container mx-auto max-w-7xl">
            <Button
              onClick={() => setSelectedBusiness(null)}
              variant="outline"
              className="mb-4 bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              ← Rudi Nyuma / Go Back
            </Button>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
                <Image
                  src={selectedBusiness.image || "/placeholder.svg"}
                  alt={selectedBusiness.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {language === "sw" ? selectedBusiness.nameSwahili : selectedBusiness.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedBusiness.rating}</span>
                    <Badge variant="outline">{selectedBusiness.category}</Badge>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                {language === "sw" ? selectedBusiness.descriptionSwahili : selectedBusiness.description}
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{selectedBusiness.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span>{selectedBusiness.hours}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-600 text-lg">{selectedBusiness.price}</span>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">{language === "sw" ? "Huduma" : "Services"}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBusiness.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-3">{language === "sw" ? "Vipengele" : "Features"}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBusiness.features.map((feature, index) => (
                    <Badge key={index} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleContactClick}
                className={`w-full bg-gradient-to-r ${program?.color} text-white`}
                size="lg"
              >
                {language === "sw" ? "Wasiliana Nasi" : "Contact Us"}
                <MessageCircle className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Modal */}
        <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{language === "sw" ? "Maelezo ya Mawasiliano" : "Contact Information"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <a
                href={`https://wa.me/${selectedBusiness.contact.whatsapp.replace("+", "")}?text=${encodeURIComponent(`Hujambo, ningependa kupata maelezo zaidi kuhusu ${selectedBusiness.name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">WhatsApp</p>
                  <p className="text-sm text-gray-600">{selectedBusiness.contact.whatsapp}</p>
                </div>
              </a>

              <a
                href={`tel:${selectedBusiness.contact.phone}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <Phone className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{language === "sw" ? "Simu" : "Phone"}</p>
                  <p className="text-sm text-gray-600">{selectedBusiness.contact.phone}</p>
                </div>
              </a>

              <a
                href={`mailto:${selectedBusiness.contact.email}?subject=${encodeURIComponent(`Inquiry about ${selectedBusiness.name}`)}&body=${encodeURIComponent(`Hello, I would like to know more about your services.`)}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">{language === "sw" ? "Barua Pepe" : "Email"}</p>
                  <p className="text-sm text-gray-600">{selectedBusiness.contact.email}</p>
                </div>
              </a>

              <a
                href={selectedBusiness.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <Globe className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="font-medium">{language === "sw" ? "Tovuti" : "Website"}</p>
                  <p className="text-sm text-gray-600">
                    {language === "sw" ? "Tembelea tovuti yetu" : "Visit our website"}
                  </p>
                </div>
              </a>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Mini Programs / Programu Ndogo</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover local businesses and services around you. Gundua biashara na huduma za karibu nawe.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {miniPrograms.map((program) => (
            <Card
              key={program.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => handleProgramClick(program.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${program.color} flex items-center justify-center text-white`}
                >
                  {program.icon}
                </div>
                <h3 className="font-semibold text-sm mb-1">{program.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{program.nameEn}</p>
                <p className="text-xs text-gray-600">{program.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">More programs coming soon... Programu zaidi zinakuja hivi karibuni...</p>
        </div>
      </div>
    </div>
  )
}
