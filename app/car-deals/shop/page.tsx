"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Car,
  CarFront,
  Cog,
  Wrench,
  Fuel,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Heart,
  X,
  Sparkles,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Types
interface Price {
  amount: number
  currency: string
}

interface CarVendor {
  id: string
  name: string
  logo: string
  category: "new" | "used" | "parts" | "services" | "rentals"
  description: string
  rating: number
  reviewCount: number
  location: string
  contact: {
    phone: string
    email: string
    website: string
  }
  openingHours: string
  products: CarProduct[]
  amenities: string[]
  images: string[]
}

interface CarProduct {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for car vendors
const carVendors: CarVendor[] = [
  // New Cars Vendors
  {
    id: "premium-motors",
    name: "Premium Motors",
    logo: "/placeholder.svg?height=80&width=80",
    category: "new",
    description:
      "Authorized dealer for luxury and premium vehicles with state-of-the-art showroom and exceptional customer service.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@premiummotors.co.ke",
      website: "www.premiummotors.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
    amenities: ["Test Drives", "Financing Options", "Vehicle Customization", "Delivery Service", "VIP Lounge"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "luxury-sedan",
        name: "2025 Luxury Executive Sedan",
        description:
          "Experience unparalleled luxury with this executive sedan featuring premium leather interior, advanced driver assistance systems, and cutting-edge infotainment.",
        price: { amount: 4500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Sedans",
        tags: ["Luxury", "Executive", "New Model"],
      },
      {
        id: "electric-suv",
        name: "2025 Electric Performance SUV",
        description: "Zero-emission luxury SUV with dual motors, extended range, and premium interior appointments.",
        price: { amount: 5200000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "SUVs",
        tags: ["Electric", "Performance", "Eco-friendly"],
      },
      {
        id: "hybrid-crossover",
        name: "2025 Hybrid Crossover Premium",
        description:
          "Efficient hybrid crossover combining fuel economy with luxury features and spacious interior for families.",
        price: { amount: 3800000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Crossovers",
        tags: ["Hybrid", "Family", "Efficient"],
      },
      {
        id: "sports-coupe",
        name: "2025 Performance Sports Coupe",
        description: "Exhilarating sports coupe with turbocharged engine, precision handling, and head-turning design.",
        price: { amount: 6500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Sports Cars",
        tags: ["Performance", "Luxury", "Coupe"],
      },
    ],
  },
  {
    id: "eco-motors",
    name: "Eco Motors Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "new",
    description:
      "Specialized dealership focusing on electric, hybrid, and fuel-efficient vehicles with expert knowledge on sustainable mobility.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "sales@ecomotors.co.ke",
      website: "www.ecomotors.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: [
      "EV Charging Station",
      "Sustainability Consultations",
      "Test Drives",
      "Financing",
      "Home Charging Setup",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "compact-ev",
        name: "2025 Compact Electric Hatchback",
        description:
          "Urban-friendly electric hatchback with impressive range, fast charging capabilities, and smart connectivity features.",
        price: { amount: 2800000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Hatchbacks",
        tags: ["Electric", "Compact", "Urban"],
      },
      {
        id: "hybrid-sedan",
        name: "2025 Hybrid Executive Sedan",
        description:
          "Refined hybrid sedan offering exceptional fuel economy without compromising on luxury and comfort.",
        price: { amount: 3500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Sedans",
        tags: ["Hybrid", "Executive", "Eco-friendly"],
      },
      {
        id: "electric-suv-mid",
        name: "2025 Electric Family SUV",
        description:
          "Spacious electric SUV designed for families with extended range, ample cargo space, and advanced safety features.",
        price: { amount: 4200000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "SUVs",
        tags: ["Electric", "Family", "Spacious"],
      },
      {
        id: "plugin-hybrid",
        name: "2025 Plug-in Hybrid Crossover",
        description:
          "Versatile plug-in hybrid offering electric-only commuting and extended range for longer journeys.",
        price: { amount: 3900000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Crossovers",
        tags: ["Plug-in Hybrid", "Versatile", "Efficient"],
      },
    ],
  },

  // Used Cars Vendors
  {
    id: "trusted-autos",
    name: "Trusted Autos Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "used",
    description:
      "Premier dealership for certified pre-owned vehicles with comprehensive inspection, warranty, and transparent history.",
    rating: 4.9,
    reviewCount: 189,
    location: "Mombasa, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@trustedautos.co.ke",
      website: "www.trustedautos.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    amenities: [
      "Vehicle History Reports",
      "Financing Options",
      "Extended Warranties",
      "Trade-In Service",
      "Inspection Reports",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "certified-luxury-sedan",
        name: "2022 Certified Luxury Sedan",
        description:
          "Low-mileage certified pre-owned luxury sedan with remaining factory warranty and complete service history.",
        price: { amount: 3200000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Certified Pre-Owned",
        tags: ["Luxury", "Low Mileage", "Certified"],
      },
      {
        id: "used-suv-premium",
        name: "2021 Premium SUV - Low Mileage",
        description: "Well-maintained premium SUV with low mileage, one owner, and full dealer service history.",
        price: { amount: 2800000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "SUVs",
        tags: ["Premium", "Low Mileage", "One Owner"],
      },
      {
        id: "used-hybrid-sedan",
        name: "2020 Hybrid Executive Sedan",
        description:
          "Fuel-efficient hybrid sedan in excellent condition with comprehensive maintenance records and premium features.",
        price: { amount: 2200000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Sedans",
        tags: ["Hybrid", "Executive", "Fuel-efficient"],
      },
      {
        id: "used-family-van",
        name: "2021 Family Minivan - 7 Seater",
        description:
          "Spacious family minivan with seating for seven, entertainment system, and excellent safety rating.",
        price: { amount: 2500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Minivans",
        tags: ["Family", "7 Seater", "Spacious"],
      },
    ],
  },
  {
    id: "value-motors",
    name: "Value Motors",
    logo: "/placeholder.svg?height=80&width=80",
    category: "used",
    description:
      "Quality used vehicles at competitive prices with flexible financing options and thorough pre-sale inspections.",
    rating: 4.6,
    reviewCount: 215,
    location: "Nakuru, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "sales@valuemotors.co.ke",
      website: "www.valuemotors.co.ke",
    },
    openingHours: "Mon-Sat: 8:30 AM - 5:30 PM",
    amenities: [
      "Affordable Financing",
      "Trade-In Options",
      "Vehicle Inspection",
      "Warranty Packages",
      "After-Sales Support",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "budget-hatchback",
        name: "2019 Economy Hatchback",
        description: "Fuel-efficient and reliable hatchback perfect for city driving and first-time car owners.",
        price: { amount: 950000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Hatchbacks",
        tags: ["Economy", "Fuel-efficient", "City Car"],
      },
      {
        id: "compact-sedan",
        name: "2020 Compact Sedan",
        description: "Well-maintained compact sedan with low fuel consumption and reliable performance.",
        price: { amount: 1200000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Sedans",
        tags: ["Compact", "Economical", "Reliable"],
      },
      {
        id: "budget-suv",
        name: "2018 Compact SUV",
        description: "Practical compact SUV with higher ground clearance, spacious interior, and good fuel economy.",
        price: { amount: 1500000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "SUVs",
        tags: ["Compact", "Practical", "Affordable"],
      },
      {
        id: "work-pickup",
        name: "2019 Work Pickup Truck",
        description: "Durable pickup truck ideal for work and leisure with strong towing capacity and reliable engine.",
        price: { amount: 1800000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Trucks",
        tags: ["Pickup", "Work Vehicle", "Durable"],
      },
    ],
  },

  // Car Parts Vendors
  {
    id: "auto-parts-plus",
    name: "Auto Parts Plus",
    logo: "/placeholder.svg?height=80&width=80",
    category: "parts",
    description:
      "Comprehensive range of genuine and aftermarket parts for all vehicle makes and models with expert advice and fast delivery.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@autopartsplus.co.ke",
      website: "www.autopartsplus.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 9:00 AM - 1:00 PM",
    amenities: ["Genuine Parts", "Aftermarket Options", "Expert Advice", "Fast Delivery", "Installation Service"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-brake-kit",
        name: "Premium Brake Kit",
        description:
          "Complete brake replacement kit including high-performance pads, rotors, and hardware for improved stopping power.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Brake Systems",
        tags: ["Performance", "Safety", "Complete Kit"],
      },
      {
        id: "engine-oil-kit",
        name: "Synthetic Oil Change Kit",
        description: "Full synthetic oil change kit with premium filter and gasket for extended engine protection.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Engine Maintenance",
        tags: ["Synthetic", "Maintenance", "Engine Protection"],
      },
      {
        id: "performance-exhaust",
        name: "Performance Exhaust System",
        description:
          "Stainless steel performance exhaust system for improved flow, enhanced sound, and slight power increase.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Performance Parts",
        tags: ["Performance", "Exhaust", "Stainless Steel"],
      },
      {
        id: "suspension-kit",
        name: "Sport Suspension Lowering Kit",
        description:
          "Complete suspension lowering kit for improved handling, reduced body roll, and sportier appearance.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Suspension",
        tags: ["Sport", "Handling", "Performance"],
      },
    ],
  },
  {
    id: "car-accessories-hub",
    name: "Car Accessories Hub",
    logo: "/placeholder.svg?height=80&width=80",
    category: "parts",
    description:
      "One-stop shop for interior, exterior, and electronic accessories to enhance your vehicle's functionality and appearance.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "sales@caraccessorieshub.co.ke",
      website: "www.caraccessorieshub.co.ke",
    },
    openingHours: "Mon-Sat: 9:00 AM - 7:00 PM",
    amenities: [
      "Professional Installation",
      "Custom Orders",
      "Interior Styling",
      "Audio Upgrades",
      "Mobile Fitting Service",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-seat-covers",
        name: "Premium Leather Seat Covers",
        description: "Custom-fit leather seat covers with excellent durability, comfort, and elegant appearance.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Interior Accessories",
        tags: ["Leather", "Comfort", "Custom-fit"],
      },
      {
        id: "advanced-dash-cam",
        name: "Advanced Dash Camera System",
        description:
          "Dual-camera dash cam system with front and rear recording, parking mode, and smartphone connectivity.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Electronics",
        tags: ["Safety", "Security", "Recording"],
      },
      {
        id: "alloy-wheels-set",
        name: "Premium Alloy Wheels Set",
        description:
          "Set of four lightweight alloy wheels with contemporary design for improved performance and appearance.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Exterior Accessories",
        tags: ["Wheels", "Styling", "Performance"],
      },
      {
        id: "car-audio-system",
        name: "Premium Car Audio Upgrade Kit",
        description:
          "Complete audio upgrade package including head unit, speakers, amplifier, and subwoofer for superior sound.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Audio Systems",
        tags: ["Entertainment", "Sound Quality", "Complete System"],
      },
    ],
  },

  // Car Services Vendors
  {
    id: "precision-auto-care",
    name: "Precision Auto Care",
    logo: "/placeholder.svg?height=80&width=80",
    category: "services",
    description:
      "Professional automotive service center with certified technicians, state-of-the-art equipment, and comprehensive maintenance packages.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "service@precisionautocare.co.ke",
      website: "www.precisionautocare.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 8:00 AM - 2:00 PM",
    amenities: [
      "Certified Technicians",
      "Diagnostic Equipment",
      "Courtesy Vehicles",
      "Online Booking",
      "Service Warranty",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-service-package",
        name: "Premium Service Package",
        description:
          "Comprehensive service including oil change, filters, fluid checks, brake inspection, and multi-point vehicle check.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Maintenance Services",
        tags: ["Comprehensive", "Preventive", "Multi-point"],
      },
      {
        id: "brake-service",
        name: "Complete Brake Service",
        description:
          "Full brake system service including pad replacement, rotor inspection/resurfacing, and system bleeding.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Brake Services",
        tags: ["Safety", "Maintenance", "Performance"],
      },
      {
        id: "ac-service",
        name: "Air Conditioning Service",
        description:
          "Complete A/C system service including refrigerant recharge, leak detection, and system performance check.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Climate Control",
        tags: ["Comfort", "Cooling", "System Check"],
      },
      {
        id: "wheel-alignment",
        name: "Four-Wheel Alignment Service",
        description:
          "Precision four-wheel alignment to improve handling, reduce tire wear, and enhance fuel efficiency.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wheel Services",
        tags: ["Handling", "Tire Life", "Efficiency"],
      },
    ],
  },
  {
    id: "express-auto-detailing",
    name: "Express Auto Detailing",
    logo: "/placeholder.svg?height=80&width=80",
    category: "services",
    description:
      "Professional auto detailing services using premium products and techniques to restore and protect your vehicle's appearance.",
    rating: 4.8,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "bookings@expressautodetailing.co.ke",
      website: "www.expressautodetailing.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    amenities: ["Premium Products", "Interior Detailing", "Paint Protection", "Mobile Service", "Ceramic Coating"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-detail-package",
        name: "Premium Detailing Package",
        description:
          "Comprehensive interior and exterior detailing including paint correction, protection, and interior deep cleaning.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Full Detailing",
        tags: ["Premium", "Interior", "Exterior"],
      },
      {
        id: "ceramic-coating",
        name: "Ceramic Coating Application",
        description:
          "Professional ceramic coating application providing long-lasting paint protection and enhanced gloss.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Paint Protection",
        tags: ["Ceramic", "Protection", "Gloss"],
      },
      {
        id: "interior-detail",
        name: "Interior Detailing Service",
        description:
          "Deep cleaning of all interior surfaces, fabric/leather treatment, and protection against UV damage and stains.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Interior Services",
        tags: ["Deep Clean", "Protection", "Restoration"],
      },
      {
        id: "headlight-restoration",
        name: "Headlight Restoration Service",
        description:
          "Professional restoration of cloudy or yellowed headlights to improve appearance and light output.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Exterior Services",
        tags: ["Restoration", "Visibility", "Safety"],
      },
    ],
  },

  // Car Rental Vendors
  {
    id: "executive-car-rentals",
    name: "Executive Car Rentals",
    logo: "/placeholder.svg?height=80&width=80",
    category: "rentals",
    description:
      "Premium car rental service offering luxury and executive vehicles for business, special occasions, and leisure travel.",
    rating: 4.8,
    reviewCount: 198,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 790 123 456",
      email: "reservations@executivecarrentals.co.ke",
      website: "www.executivecarrentals.co.ke",
    },
    openingHours: "Mon-Sun: 7:00 AM - 9:00 PM",
    amenities: ["Airport Pickup", "Chauffeur Service", "Flexible Rental Terms", "Insurance Included", "24/7 Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "luxury-sedan-rental",
        name: "Luxury Sedan Rental",
        description:
          "Premium luxury sedan rental with leather interior, advanced features, and smooth ride for business or leisure.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Daily Rentals",
        tags: ["Luxury", "Business", "Comfort"],
      },
      {
        id: "suv-rental",
        name: "Premium SUV Rental",
        description: "Spacious premium SUV rental ideal for family trips, safari adventures, or executive transport.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Daily Rentals",
        tags: ["SUV", "Spacious", "Adventure"],
      },
      {
        id: "wedding-car-package",
        name: "Wedding Car Package",
        description:
          "Elegant luxury vehicle rental for weddings including decorated car, professional chauffeur, and red carpet service.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Special Occasions",
        tags: ["Wedding", "Chauffeur", "Luxury"],
      },
      {
        id: "airport-transfer",
        name: "Executive Airport Transfer",
        description:
          "Premium airport transfer service with professional driver, flight monitoring, and meet & greet service.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Transfer Services",
        tags: ["Airport", "Executive", "Professional"],
      },
    ],
  },
  {
    id: "adventure-wheels",
    name: "Adventure Wheels",
    logo: "/placeholder.svg?height=80&width=80",
    category: "rentals",
    description:
      "Specialized rental service offering 4x4 vehicles, camping equipment, and adventure-ready cars for exploring Kenya's diverse landscapes.",
    rating: 4.7,
    reviewCount: 156,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 701 234 567",
      email: "bookings@adventurewheels.co.ke",
      website: "www.adventurewheels.co.ke",
    },
    openingHours: "Mon-Sun: 8:00 AM - 8:00 PM",
    amenities: ["4x4 Specialists", "Camping Equipment", "Route Planning", "Safari Packages", "Roadside Assistance"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "4x4-rental",
        name: "4x4 Safari Vehicle Rental",
        description:
          "Rugged 4x4 vehicle rental fully equipped for safari adventures with roof tent option and off-road capability.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Adventure Vehicles",
        tags: ["4x4", "Safari", "Off-road"],
      },
      {
        id: "camping-package",
        name: "4x4 Camping Package",
        description:
          "Complete camping package including 4x4 vehicle, roof tent, cooking equipment, and camping essentials for wilderness adventures.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Adventure Packages",
        tags: ["Camping", "All-inclusive", "Adventure"],
      },
      {
        id: "group-safari-van",
        name: "Safari Minivan Rental",
        description:
          "Spacious safari minivan with pop-up roof, perfect for group game drives and wildlife photography.",
        price: { amount: 15000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Group Vehicles",
        tags: ["Safari", "Group", "Wildlife Viewing"],
      },
      {
        id: "weekend-escape",
        name: "Weekend Escape Package",
        description: "All-inclusive weekend package with 4x4 vehicle, pre-planned route, and accommodation bookings.",
        price: { amount: 25000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Package Deals",
        tags: ["Weekend", "All-inclusive", "Planned Route"],
      },
    ],
  },
]

export default function CarDealsShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<CarVendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<CarProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter vendors based on active category and search query
  const filteredVendors = carVendors.filter((vendor) => {
    // Filter by category
    if (activeCategory !== "all" && vendor.category !== activeCategory) {
      return false
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        vendor.name.toLowerCase().includes(query) ||
        vendor.description.toLowerCase().includes(query) ||
        vendor.products.some(
          (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
        )
      )
    }

    return true
  })

  // Handle category click
  const handleCategoryClick = (category: string) => {
    setIsLoading(true)
    setActiveCategory(category)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  // Handle vendor click
  const handleVendorClick = (vendor: CarVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle product click
  const handleProductClick = (product: CarProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "new":
        return <Car className="h-6 w-6" />
      case "used":
        return <CarFront className="h-6 w-6" />
      case "parts":
        return <Cog className="h-6 w-6" />
      case "services":
        return <Wrench className="h-6 w-6" />
      case "rentals":
        return <Fuel className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "new":
        return "from-blue-500 to-indigo-600"
      case "used":
        return "from-purple-500 to-violet-600"
      case "parts":
        return "from-orange-500 to-amber-600"
      case "services":
        return "from-green-500 to-emerald-600"
      case "rentals":
        return "from-red-500 to-rose-600"
      default:
        return "from-blue-500 to-indigo-600"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "used":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "parts":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "services":
        return "bg-green-100 text-green-800 border-green-200"
      case "rentals":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Star rating component
  const StarRating = ({ rating }: { rating: number }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-300">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Categories", icon: <Sparkles className="h-5 w-5" /> },
          { id: "new", name: "New Cars", icon: <Car className="h-5 w-5" /> },
          { id: "used", name: "Used Cars", icon: <CarFront className="h-5 w-5" /> },
          { id: "parts", name: "Car Parts", icon: <Cog className="h-5 w-5" /> },
          { id: "services", name: "Car Services", icon: <Wrench className="h-5 w-5" /> },
          { id: "rentals", name: "Car Rentals", icon: <Fuel className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-blue-500 to-indigo-600"
                      : category.id === "new"
                        ? "from-blue-500 to-indigo-600"
                        : category.id === "used"
                          ? "from-purple-500 to-violet-600"
                          : category.id === "parts"
                            ? "from-orange-500 to-amber-600"
                            : category.id === "services"
                              ? "from-green-500 to-emerald-600"
                              : "from-red-500 to-rose-600"
                  } text-white`
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            <span className="mr-2">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/car-deals" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Car Deals
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Car Deals Shop</h1>
              <p className="text-blue-100 max-w-2xl">
                Discover premium automotive deals including new and used vehicles, parts, accessories, and professional
                services.
              </p>
            </div>
            <div className="hidden md:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/20 backdrop-blur-md p-4 rounded-lg shadow-lg"
              >
                <div className="text-white text-center">
                  <Car className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Premium Deals</p>
                  <p className="text-sm">Quality Vehicles & Services</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        <div className="relative max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for cars, parts, services, or rentals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-blue-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500">
                <Search className="h-5 w-5" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6 relative z-10">{renderCategoryTabs()}</div>

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVendors.map((vendor) => (
              <motion.div
                key={vendor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleVendorClick(vendor)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(vendor.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(vendor.category)}</div>
                      <h3 className="text-xl font-semibold">{vendor.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {vendor.category === "new"
                        ? "New Cars"
                        : vendor.category === "used"
                          ? "Used Cars"
                          : vendor.category === "parts"
                            ? "Car Parts"
                            : vendor.category === "services"
                              ? "Car Services"
                              : "Car Rentals"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={vendor.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(vendor.category)}>
                        {vendor.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{vendor.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {vendor.openingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(vendor.category)} hover:opacity-90 text-white`}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-blue-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any automotive vendors matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Categories
            </Button>
          </div>
        )}
      </div>

      {/* Vendor Detail Modal */}
      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedVendor && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedVendor.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedVendor.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedVendor.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedVendor.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-blue-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {selectedVendor.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                        {selectedVendor.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Features & Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Products & Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedVendor.products.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {product.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-amber-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{product.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {product.category}
                            </Badge>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {formatPrice(product.price)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedProduct.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedProduct.isNew && <Badge className="bg-blue-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-amber-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedProduct.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedProduct.category}
                    </Badge>
                    <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white">
                      Contact Dealer
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      <span>Save</span>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
