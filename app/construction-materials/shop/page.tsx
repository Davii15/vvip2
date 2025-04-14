"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  X,
  Flame,
  ChevronRight,
  Hammer,
  Truck,
  BrickWallIcon as Brick,
  Construction,
  Paintbrush,
  Zap,
  WrenchIcon as Screwdriver,
  ShieldCheck,
  Package,
  Scale,
  Maximize2,
  Palette,
  Landmark,
  Award,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"

// Types
interface Price {
  amount: number
  currency: string
}

interface ConstructionMaterial {
  id: string
  name: string
  logo: string
  category: "building" | "tools" | "electrical" | "finishing" | "hardware"
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
  products: ConstructionProduct[]
  amenities: string[]
  images: string[]
}

interface ConstructionProduct {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
  specifications?: Record<string, string>
  weight?: {
    value: number
    unit: string
  }
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  material?: string
  color?: string
  brand?: string
  warranty?: string
  madeIn?: string
  stock?: number
  minOrderQuantity?: number
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for construction materials providers
const constructionMaterials: ConstructionMaterial[] = [
  // Building Materials
  {
    id: "premier-construction",
    name: "Premier Construction Supplies",
    logo: "/placeholder.svg?height=80&width=80",
    category: "building",
    description:
      "Leading supplier of high-quality construction materials for residential and commercial projects with nationwide delivery.",
    rating: 4.8,
    reviewCount: 356,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@premierconstructionsupplies.co.ke",
      website: "www.premierconstructionsupplies.co.ke",
    },
    openingHours: "Mon-Fri: 7:00 AM - 6:00 PM, Sat: 8:00 AM - 4:00 PM",
    amenities: ["Delivery Service", "Technical Support", "Bulk Discounts", "Project Consultation", "Material Testing"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "portland-cement",
        name: "Premium Portland Cement (50kg)",
        description:
          "High-quality Portland cement suitable for all general construction purposes including concrete, mortar, and plastering.",
        price: { amount: 750, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Cement",
        tags: ["High Strength", "Quick Setting", "Water Resistant"],
        specifications: {
          Type: "Portland Cement",
          "Strength Class": "42.5N",
          "Setting Time": "Initial: 60 min, Final: 600 min",
          Packaging: "50kg bag",
        },
        weight: { value: 50, unit: "kg" },
        brand: "SimbaMax",
        warranty: "Guaranteed quality for 6 months when stored properly",
        madeIn: "Kenya",
        stock: 500,
        minOrderQuantity: 10,
      },
      {
        id: "steel-bars",
        name: "Reinforced Steel Bars (12mm x 12m)",
        description:
          "High-tensile reinforcement steel bars for concrete structures. Provides excellent strength and durability for foundations, columns, beams, and slabs.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Steel",
        tags: ["High Tensile", "Corrosion Resistant", "Ribbed Surface"],
        specifications: {
          Diameter: "12mm",
          Length: "12m",
          Grade: "D500",
          "Yield Strength": "≥ 500 N/mm²",
        },
        weight: { value: 10.6, unit: "kg" },
        dimensions: { length: 12, width: 0.012, height: 0.012, unit: "m" },
        brand: "SteelMasters",
        madeIn: "Kenya",
        stock: 350,
        minOrderQuantity: 5,
      },
      {
        id: "concrete-blocks",
        name: "Solid Concrete Blocks (6 inch)",
        description:
          "Durable solid concrete blocks for construction of walls, foundations, and other structural elements. Uniform size and high compressive strength.",
        price: { amount: 85, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Blocks & Bricks",
        tags: ["Solid", "High Strength", "Uniform Size"],
        specifications: {
          Dimensions: "450mm x 225mm x 150mm",
          "Compressive Strength": ">7 N/mm²",
          Weight: "~22kg per block",
        },
        weight: { value: 22, unit: "kg" },
        dimensions: { length: 0.45, width: 0.225, height: 0.15, unit: "m" },
        brand: "BlockMaster",
        madeIn: "Kenya",
        stock: 2000,
        minOrderQuantity: 50,
      },
      {
        id: "aggregates-mix",
        name: "Construction Aggregates Mix (1 ton)",
        description:
          "Quality mix of sand, gravel, and crushed stone for concrete production and general construction applications.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Aggregates",
        tags: ["Mixed Sizes", "Washed", "Quality Tested"],
        specifications: {
          Content: "Sand, Gravel, Crushed Stone",
          "Size Range": "0-20mm",
          Quantity: "1 ton",
        },
        weight: { value: 1000, unit: "kg" },
        brand: "AggregatesPro",
        madeIn: "Kenya",
        stock: 100,
        minOrderQuantity: 1,
      },
    ],
  },
  {
    id: "mabati-masters",
    name: "Mabati Masters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "building",
    description:
      "Specialized supplier of quality roofing materials and accessories for all construction needs with expert installation services.",
    rating: 4.7,
    reviewCount: 245,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "info@mabatimasters.co.ke",
      website: "www.mabatimasters.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 5:30 PM, Sun: Closed",
    amenities: ["Free Delivery", "Installation Services", "Custom Cutting", "Technical Advice", "Warranty Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "corrugated-sheets",
        name: "Galvanized Corrugated Roofing Sheets (28 Gauge)",
        description:
          "Durable galvanized corrugated roofing sheets with excellent corrosion resistance. Ideal for residential, commercial, and agricultural buildings.",
        price: { amount: 850, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Roofing",
        tags: ["Corrosion Resistant", "Lightweight", "Easy Installation"],
        specifications: {
          Material: "Galvanized Steel",
          Gauge: "28",
          Length: "3m",
          Width: "0.9m",
          Coating: "Zinc",
        },
        weight: { value: 5.2, unit: "kg" },
        dimensions: { length: 3, width: 0.9, height: 0.017, unit: "m" },
        brand: "RoofTech",
        warranty: "10-year warranty against perforation",
        madeIn: "Kenya",
        stock: 200,
        minOrderQuantity: 5,
      },
      {
        id: "stone-coated-tiles",
        name: "Stone Coated Roofing Tiles (Classic Profile)",
        description:
          "Premium stone-coated steel roofing tiles with classic profile. Combines the strength of steel with the aesthetic appeal of traditional tiles.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Roofing",
        tags: ["Elegant Appearance", "Weather Resistant", "Sound Insulation"],
        specifications: {
          Material: "Stone-coated Steel",
          Profile: "Classic Tile",
          Size: "1.35m x 0.42m",
          Coverage: "0.5 m² per tile",
          Weight: "2.8 kg per tile",
        },
        weight: { value: 2.8, unit: "kg" },
        dimensions: { length: 1.35, width: 0.42, height: 0.02, unit: "m" },
        color: "Terracotta Red",
        material: "Stone-coated Steel",
        brand: "DuraRoof",
        warranty: "25-year warranty",
        madeIn: "Kenya",
        stock: 150,
        minOrderQuantity: 50,
      },
      {
        id: "roof-trusses",
        name: "Pre-fabricated Roof Trusses (6m span)",
        description:
          "Factory-made wooden roof trusses designed for quick and easy installation. Engineered for optimal strength and stability.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Roofing",
        tags: ["Pre-fabricated", "Engineered", "Quick Installation"],
        specifications: {
          Material: "Treated Pine",
          Span: "6m",
          Spacing: "600mm centers",
          Treatment: "CCA Pressure Treated",
        },
        weight: { value: 85, unit: "kg" },
        dimensions: { length: 6, width: 0.6, height: 1.2, unit: "m" },
        material: "Treated Pine",
        brand: "TrussKing",
        warranty: "15-year structural warranty",
        madeIn: "Kenya",
        stock: 25,
        minOrderQuantity: 1,
      },
      {
        id: "gutter-system",
        name: "Complete PVC Gutter System (10m)",
        description:
          "Complete PVC gutter system including gutters, downpipes, connectors, and brackets. UV-resistant and easy to install.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Roofing",
        tags: ["UV Resistant", "Complete System", "Easy Installation"],
        specifications: {
          Material: "PVC",
          "Gutter Profile": "Half-round",
          "Gutter Size": "100mm",
          "Downpipe Size": "75mm",
          Length: "10m system",
        },
        color: "White",
        material: "PVC",
        brand: "RainFlow",
        warranty: "10-year warranty",
        madeIn: "South Africa",
        stock: 30,
        minOrderQuantity: 1,
      },
    ],
  },

  // Tools & Equipment
  {
    id: "toolmart-kenya",
    name: "ToolMart Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tools",
    description:
      "One-stop shop for professional-grade tools and construction equipment for contractors and DIY enthusiasts with rental options available.",
    rating: 4.9,
    reviewCount: 412,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@toolmart.co.ke",
      website: "www.toolmart.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 7:00 PM, Sun: 9:00 AM - 4:00 PM",
    amenities: ["Tool Rental", "Repair Services", "Training Workshops", "Trade-In Program", "Extended Warranties"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "cordless-drill",
        name: "Professional Cordless Drill Set (18V)",
        description:
          "Professional-grade 18V cordless drill set with brushless motor for maximum efficiency and runtime. Includes two lithium-ion batteries, charger, and carrying case.",
        price: { amount: 12500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Power Tools",
        tags: ["Brushless Motor", "18V Power", "2-Speed Gearbox"],
        specifications: {
          Voltage: "18V",
          "Chuck Size": "13mm",
          "Max Torque": "65Nm",
          Speed: "0-500/0-1800 RPM",
          Battery: "2x 4.0Ah Li-Ion",
        },
        weight: { value: 3.2, unit: "kg" },
        dimensions: { length: 0.35, width: 0.25, height: 0.1, unit: "m" },
        color: "Blue/Black",
        brand: "PowerPro",
        warranty: "3-year manufacturer warranty",
        madeIn: "Germany",
        stock: 25,
        minOrderQuantity: 1,
      },
      {
        id: "concrete-mixer",
        name: "Heavy-Duty Concrete Mixer (350L)",
        description:
          "Heavy-duty 350L diesel-powered concrete mixer for construction sites. Features durable steel drum, powerful engine, and easy maneuverability.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Heavy Machinery",
        tags: ["350L Capacity", "Diesel Engine", "Durable Steel Drum"],
        specifications: {
          "Drum Capacity": "350L",
          Engine: "7HP Diesel",
          "Drum Speed": "26 RPM",
          "Fuel Tank": "5L",
          "Mixing Capacity": "210L concrete output",
        },
        weight: { value: 320, unit: "kg" },
        dimensions: { length: 1.8, width: 0.9, height: 1.4, unit: "m" },
        color: "Yellow/Black",
        brand: "ConstructMax",
        warranty: "2-year warranty on engine, 1-year on parts",
        madeIn: "China",
        stock: 8,
        minOrderQuantity: 1,
      },
      {
        id: "angle-grinder",
        name: "Heavy-Duty Angle Grinder (230mm)",
        description:
          "Powerful 2400W angle grinder for cutting, grinding, and polishing metal, concrete, and stone. Features soft start, anti-vibration handle, and overload protection.",
        price: { amount: 9500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Power Tools",
        tags: ["2400W Motor", "Soft Start", "Anti-Vibration"],
        specifications: {
          Power: "2400W",
          "Disc Size": '230mm (9")',
          "No-Load Speed": "6500 RPM",
          "Spindle Thread": "M14",
          "Cable Length": "4m",
        },
        weight: { value: 5.8, unit: "kg" },
        dimensions: { length: 0.5, width: 0.2, height: 0.15, unit: "m" },
        color: "Red/Black",
        brand: "GrindMaster",
        warranty: "2-year warranty",
        madeIn: "Germany",
        stock: 15,
        minOrderQuantity: 1,
      },
      {
        id: "laser-level",
        name: "Self-Leveling Laser Level Kit",
        description:
          "Professional self-leveling laser level with horizontal and vertical lines. Includes tripod, target card, and carrying case. Ideal for precise alignment in construction.",
        price: { amount: 18500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Measuring Tools",
        tags: ["Self-Leveling", "Horizontal & Vertical Lines", "Complete Kit"],
        specifications: {
          Range: "30m (100ft)",
          Accuracy: "±3mm at 10m",
          Leveling: "Automatic",
          "Laser Class": "Class 2",
          "Battery Life": "Up to 12 hours",
        },
        weight: { value: 1.5, unit: "kg" },
        dimensions: { length: 0.3, width: 0.25, height: 0.1, unit: "m" },
        color: "Green/Black",
        brand: "LevelPro",
        warranty: "2-year warranty",
        madeIn: "Japan",
        stock: 10,
        minOrderQuantity: 1,
      },
    ],
  },
  {
    id: "safety-first",
    name: "SafetyFirst Equipment",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tools",
    description:
      "Specialized provider of high-quality safety equipment and gear for construction professionals with certification training.",
    rating: 4.7,
    reviewCount: 328,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "info@safetyfirst.co.ke",
      website: "www.safetyfirst.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: [
      "Safety Training",
      "Site Assessments",
      "Custom Equipment",
      "Certification Services",
      "Emergency Supplies",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "safety-helmets",
        name: "Construction Safety Helmet Set (10 Pack)",
        description:
          "Set of 10 high-quality construction safety helmets with adjustable harness and ventilation. Provides excellent impact protection and comfort for all-day wear.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Safety Equipment",
        tags: ["Impact Resistant", "Adjustable Harness", "Ventilation System"],
        specifications: {
          Material: "High-Density Polyethylene",
          Standard: "EN 397",
          Weight: "380g per helmet",
          Size: "Adjustable (54-62cm)",
          Colors: "Assorted (Yellow, White, Blue, Red, Green)",
        },
        weight: { value: 3.8, unit: "kg" },
        brand: "SafeGuard",
        warranty: "1-year warranty",
        madeIn: "Taiwan",
        stock: 30,
        minOrderQuantity: 1,
      },
      {
        id: "safety-harness",
        name: "Full Body Safety Harness with Lanyard",
        description:
          "Professional full-body safety harness with shock-absorbing lanyard for fall protection. Features adjustable straps, quick-connect buckles, and comfortable padding.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Safety Equipment",
        tags: ["Full Body Protection", "Shock-Absorbing Lanyard", "Adjustable Straps"],
        specifications: {
          Material: "Polyester Webbing",
          Standard: "EN 361, EN 355",
          "Weight Capacity": "140kg",
          "Lanyard Length": "1.8m",
          "D-Rings": "Dorsal and Chest",
        },
        weight: { value: 1.8, unit: "kg" },
        color: "Orange/Black",
        brand: "HeightSafe",
        warranty: "1-year warranty",
        madeIn: "UK",
        stock: 25,
        minOrderQuantity: 1,
      },
      {
        id: "safety-boots",
        name: "Steel Toe Safety Boots (Pair)",
        description:
          "Durable steel toe safety boots with slip-resistant soles and puncture-resistant midsole. Comfortable for all-day wear with water-resistant leather upper.",
        price: { amount: 3800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Safety Equipment",
        tags: ["Steel Toe", "Slip Resistant", "Water Resistant"],
        specifications: {
          Material: "Full-grain leather",
          Standard: "EN ISO 20345:2011 S3 SRC",
          "Toe Cap": "Steel",
          Midsole: "Steel puncture resistant",
          Sizes: "40-46 EU",
        },
        weight: { value: 1.2, unit: "kg" },
        color: "Brown",
        brand: "SafeStep",
        warranty: "6-month warranty",
        madeIn: "South Africa",
        stock: 40,
        minOrderQuantity: 1,
      },
      {
        id: "safety-glasses",
        name: "Anti-Fog Safety Glasses (10 Pack)",
        description:
          "Clear anti-fog safety glasses with impact-resistant polycarbonate lenses. Provides 99% UV protection and comfortable fit with adjustable temples.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Safety Equipment",
        tags: ["Anti-Fog", "Impact Resistant", "UV Protection"],
        specifications: {
          Material: "Polycarbonate",
          Standard: "EN166 F",
          "UV Protection": "99%",
          Quantity: "10 pairs",
          Weight: "25g per pair",
        },
        weight: { value: 0.25, unit: "kg" },
        color: "Clear/Black",
        brand: "ClearView",
        warranty: "30-day warranty",
        madeIn: "China",
        stock: 50,
        minOrderQuantity: 1,
      },
    ],
  },

  // Electrical & Plumbing
  {
    id: "electro-plumb",
    name: "ElectroPlumb Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "electrical",
    description:
      "Complete range of electrical and plumbing supplies for residential and commercial construction projects with professional installation services.",
    rating: 4.8,
    reviewCount: 376,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@electroplumb.co.ke",
      website: "www.electroplumb.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: [
      "Installation Services",
      "System Design",
      "Emergency Repairs",
      "Maintenance Contracts",
      "Technical Support",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "electrical-wiring",
        name: "Electrical Wiring Bundle (2.5mm² - 100m)",
        description:
          "High-quality 2.5mm² electrical wiring bundle (100m) for residential and commercial installations. Flame-retardant PVC insulation ensures safety and durability.",
        price: { amount: 7500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Wiring",
        tags: ["Flame Retardant", "Flexible Copper Core", "Durable PVC Insulation"],
        specifications: {
          "Wire Size": "2.5mm²",
          Length: "100m",
          Material: "Copper",
          Insulation: "PVC",
          "Voltage Rating": "450/750V",
        },
        weight: { value: 9.5, unit: "kg" },
        color: "Red",
        brand: "ElectroPro",
        warranty: "10-year warranty",
        madeIn: "Kenya",
        stock: 50,
        minOrderQuantity: 1,
      },
      {
        id: "pvc-pipes",
        name: "PVC Pressure Pipes Bundle (1 inch - 6m x 5pcs)",
        description:
          "Bundle of 5 high-quality PVC pressure pipes (1 inch diameter, 6m length) for water supply systems. Durable, corrosion-resistant, and easy to install.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Pipes & Fittings",
        tags: ["Corrosion Resistant", "UV Stabilized", "High Pressure Rating"],
        specifications: {
          Diameter: "1 inch (25mm)",
          Length: "6m per pipe",
          Quantity: "5 pipes",
          Material: "uPVC",
          "Pressure Rating": "PN16 (16 bar)",
        },
        weight: { value: 15, unit: "kg" },
        dimensions: { length: 6, width: 0.025, height: 0.025, unit: "m" },
        color: "Blue",
        brand: "FlowMaster",
        warranty: "15-year warranty",
        madeIn: "Kenya",
        stock: 30,
        minOrderQuantity: 1,
      },
      {
        id: "distribution-board",
        name: "Residential Distribution Board (12-way)",
        description:
          "Complete 12-way distribution board with RCD protection for residential electrical installations. Includes circuit breakers and all necessary components.",
        price: { amount: 12500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Electrical",
        tags: ["RCD Protection", "12-way", "Complete Set"],
        specifications: {
          Type: "Surface Mount",
          Ways: "12",
          Protection: "100A Main Switch with 30mA RCD",
          MCBs: "Included (various ratings)",
          "IP Rating": "IP40",
        },
        dimensions: { length: 0.4, width: 0.3, height: 0.1, unit: "m" },
        color: "White",
        brand: "PowerSafe",
        warranty: "5-year warranty",
        madeIn: "UK",
        stock: 15,
        minOrderQuantity: 1,
      },
      {
        id: "water-tank",
        name: "Plastic Water Storage Tank (2000L)",
        description:
          "Durable 2000L plastic water storage tank for residential and commercial use. UV-stabilized material ensures long life and water safety.",
        price: { amount: 18500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Water Systems",
        tags: ["UV Stabilized", "Food Grade", "Durable"],
        specifications: {
          Capacity: "2000L",
          Material: "High-density polyethylene (HDPE)",
          "UV Protection": "Yes",
          "Inlet/Outlet": '1" BSP fittings',
          Dimensions: "Diameter: 1.5m, Height: 1.2m",
        },
        dimensions: { length: 1.5, width: 1.5, height: 1.2, unit: "m" },
        color: "Black",
        brand: "AquaTank",
        warranty: "10-year warranty",
        madeIn: "Kenya",
        stock: 10,
        minOrderQuantity: 1,
      },
    ],
  },
  {
    id: "power-flow",
    name: "PowerFlow Systems",
    logo: "/placeholder.svg?height=80&width=80",
    category: "electrical",
    description:
      "Specialized supplier of electrical and water systems for residential and commercial construction with energy-efficient solutions.",
    rating: 4.6,
    reviewCount: 289,
    location: "Mombasa, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "info@powerflow.co.ke",
      website: "www.powerflow.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: ["System Design", "Energy Audits", "Solar Solutions", "Maintenance Services", "Warranty Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "solar-water-heater",
        name: "Solar Water Heating System (200L)",
        description:
          "Complete 200L solar water heating system for residential use. Includes solar collector panels, insulated tank, mounting hardware, and all necessary fittings.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Water Systems",
        tags: ["Energy Efficient", "200L Capacity", "Pressurized System"],
        specifications: {
          "Tank Capacity": "200L",
          "Collector Type": "Evacuated Tube (20 tubes)",
          "Working Pressure": "6 bar",
          Insulation: "50mm Polyurethane Foam",
          "Backup Heating": "Electric Element (1.5kW)",
        },
        weight: { value: 120, unit: "kg" },
        dimensions: { length: 2, width: 1, height: 2, unit: "m" },
        brand: "SolarTech",
        warranty: "5-year system warranty, 10-year collector warranty",
        madeIn: "China",
        stock: 10,
        minOrderQuantity: 1,
      },
      {
        id: "house-electrical-kit",
        name: "Complete House Electrical Kit",
        description:
          "Comprehensive electrical kit for a 3-bedroom house. Includes distribution board, circuit breakers, wiring, switches, sockets, light fixtures, and all necessary accessories.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Electrical",
        tags: ["Complete Solution", "Quality Components", "Pre-measured Wiring"],
        specifications: {
          "Distribution Board": "12-way with RCD protection",
          Wiring: "1.5mm² and 2.5mm² (200m total)",
          Switches: "20 pcs (1-way and 2-way)",
          Sockets: "15 pcs (double)",
          "Light Fixtures": "10 pcs (LED)",
        },
        weight: { value: 45, unit: "kg" },
        brand: "ElectroPro",
        warranty: "2-year warranty",
        madeIn: "Various",
        stock: 5,
        minOrderQuantity: 1,
      },
      {
        id: "water-pump",
        name: "Submersible Water Pump (1HP)",
        description:
          "High-quality 1HP submersible water pump for wells and boreholes. Features stainless steel construction, thermal overload protection, and high efficiency motor.",
        price: { amount: 15500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Water Systems",
        tags: ["Stainless Steel", "Thermal Protection", "High Efficiency"],
        specifications: {
          Power: "1HP (0.75kW)",
          "Max Flow": "5.5m³/h",
          "Max Head": "55m",
          "Outlet Size": '1.25"',
          "Cable Length": "15m",
        },
        weight: { value: 12, unit: "kg" },
        dimensions: { length: 0.15, width: 0.15, height: 0.5, unit: "m" },
        brand: "AquaPower",
        warranty: "2-year warranty",
        madeIn: "Italy",
        stock: 12,
        minOrderQuantity: 1,
      },
      {
        id: "solar-panel-kit",
        name: "Grid-Tied Solar Panel Kit (3kW)",
        description:
          "Complete 3kW grid-tied solar panel system for residential use. Includes panels, inverter, mounting hardware, and all necessary wiring and connectors.",
        price: { amount: 250000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Electrical",
        tags: ["Grid-Tied", "3kW System", "Complete Kit"],
        specifications: {
          Panels: "10 x 330W Monocrystalline",
          Inverter: "3kW Grid-Tied",
          Mounting: "Roof Mount System",
          "Estimated Output": "~12kWh per day",
          Warranty: "25 years on panels, 10 years on inverter",
        },
        weight: { value: 180, unit: "kg" },
        brand: "SolarPower",
        warranty: "25 years on panels, 10 years on inverter",
        madeIn: "Germany/China",
        stock: 3,
        minOrderQuantity: 1,
      },
    ],
  },

  // Finishing Materials
  {
    id: "interior-finishes",
    name: "Interior Finishes Ltd",
    logo: "/placeholder.svg?height=80&width=80",
    category: "finishing",
    description:
      "Premium supplier of interior and exterior finishing materials for construction and renovation projects with design consultation services.",
    rating: 4.9,
    reviewCount: 215,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@interiorfinishes.co.ke",
      website: "www.interiorfinishes.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 4:00 PM",
    amenities: [
      "Design Consultation",
      "Color Matching",
      "Sample Service",
      "Installation Referrals",
      "Eco-Friendly Options",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "interior-paint",
        name: "Premium Interior Wall Paint (20L)",
        description:
          "Premium quality interior wall paint with excellent coverage and durability. Low VOC formula ensures minimal odor and environmental impact.",
        price: { amount: 7500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Paint",
        tags: ["Excellent Coverage", "Low VOC", "Washable"],
        specifications: {
          Volume: "20L",
          Coverage: "10-12 m²/L",
          Finish: "Matt",
          "Drying Time": "Touch dry: 1 hour, Recoat: 4 hours",
          Application: "Brush, Roller, or Spray",
        },
        weight: { value: 22, unit: "kg" },
        color: "Various (can be tinted)",
        brand: "ColorMaster",
        warranty: "5-year color warranty",
        madeIn: "Kenya",
        stock: 50,
        minOrderQuantity: 1,
      },
      {
        id: "ceramic-tiles",
        name: "Ceramic Floor Tiles (60x60cm - 10 m²)",
        description:
          "High-quality ceramic floor tiles (60x60cm) covering 10 m². Features a modern marble-effect design with a glossy finish. Durable, easy to clean, and suitable for high-traffic areas.",
        price: { amount: 12000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Tiles",
        tags: ["Marble Effect", "Glossy Finish", "Stain Resistant"],
        specifications: {
          Size: "60x60cm",
          Coverage: "10 m² (28 tiles)",
          Thickness: "9mm",
          Material: "Ceramic",
          Finish: "Glossy",
        },
        weight: { value: 220, unit: "kg" },
        color: "Carrara White",
        material: "Ceramic",
        brand: "TileMaster",
        warranty: "10-year warranty",
        madeIn: "Italy",
        stock: 25,
        minOrderQuantity: 10,
      },
      {
        id: "laminate-flooring",
        name: "Premium Laminate Flooring (8mm - 20 m²)",
        description:
          "High-quality 8mm laminate flooring with realistic wood grain finish. Easy click-lock installation system and durable wear layer for long-lasting performance.",
        price: { amount: 18500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Flooring",
        tags: ["Wood Grain", "Click-Lock System", "Water Resistant"],
        specifications: {
          Thickness: "8mm",
          "Plank Size": "1200 x 190mm",
          Coverage: "20 m² (87 planks)",
          "Wear Layer": "AC4 (Commercial)",
          Edge: "Beveled 4-sides",
        },
        weight: { value: 160, unit: "kg" },
        color: "Oak Natural",
        material: "HDF with Melamine Wear Layer",
        brand: "FloorPro",
        warranty: "15-year residential warranty",
        madeIn: "Germany",
        stock: 15,
        minOrderQuantity: 5,
      },
      {
        id: "ceiling-panels",
        name: "Acoustic Ceiling Panels (60x60cm - 20 pcs)",
        description:
          "High-performance acoustic ceiling panels for noise reduction and improved sound quality. Easy to install in standard suspended ceiling grids.",
        price: { amount: 9500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Ceiling Materials",
        tags: ["Acoustic", "Noise Reduction", "Fire Resistant"],
        specifications: {
          Size: "60x60cm",
          Thickness: "15mm",
          Material: "Mineral Fiber",
          "NRC Rating": "0.7",
          "Fire Rating": "Class A",
        },
        weight: { value: 18, unit: "kg" },
        color: "White",
        brand: "AcousticPro",
        warranty: "10-year warranty",
        madeIn: "UK",
        stock: 30,
        minOrderQuantity: 5,
      },
    ],
  },
  {
    id: "modern-doors",
    name: "Modern Doors & Windows",
    logo: "/placeholder.svg?height=80&width=80",
    category: "finishing",
    description:
      "Specialized manufacturer and supplier of high-quality doors, windows, and related finishing products with custom design options.",
    rating: 4.7,
    reviewCount: 183,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "info@moderndoors.co.ke",
      website: "www.moderndoors.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: ["Custom Designs", "Installation Services", "Measurement Service", "Showroom", "After-Sales Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "mahogany-door",
        name: "Solid Mahogany Wooden Door (Complete Set)",
        description:
          "Premium solid mahogany wooden door complete with frame, architraves, hinges, and high-quality lock set. Features elegant carved design and natural wood finish.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Doors & Windows",
        tags: ["Solid Mahogany", "Carved Design", "Complete Set"],
        specifications: {
          "Door Size": "900 x 2100mm",
          Thickness: "45mm",
          Material: "Solid Mahogany",
          Frame: "Included (Hardwood)",
          Hardware: "Stainless Steel Hinges and Lock Set",
        },
        weight: { value: 80, unit: "kg" },
        dimensions: { length: 2.1, width: 0.9, height: 0.045, unit: "m" },
        color: "Natural Mahogany",
        material: "Solid Mahogany",
        brand: "WoodMaster",
        warranty: "10-year warranty",
        madeIn: "Kenya",
        stock: 15,
        minOrderQuantity: 1,
      },
      {
        id: "aluminum-window",
        name: "Aluminum Sliding Window (1.5m x 1.2m)",
        description:
          "Modern aluminum sliding window with tinted glass and smooth sliding mechanism. Features durable powder-coated aluminum frame, security locks, and weather sealing.",
        price: { amount: 18000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Doors & Windows",
        tags: ["Powder-Coated Aluminum", "Tinted Glass", "Smooth Sliding"],
        specifications: {
          Size: "1.5m x 1.2m",
          Frame: "Aluminum (2mm thickness)",
          Glass: "6mm Tinted Tempered Glass",
          Tracks: "Double Track System",
          Finish: "Powder Coated",
        },
        weight: { value: 25, unit: "kg" },
        dimensions: { length: 1.5, width: 1.2, height: 0.1, unit: "m" },
        color: "Silver",
        material: "Aluminum and Glass",
        brand: "GlassMax",
        warranty: "5-year warranty",
        madeIn: "Kenya",
        stock: 20,
        minOrderQuantity: 1,
      },
      {
        id: "security-door",
        name: "Steel Security Door with Multi-point Locking",
        description:
          "Heavy-duty steel security door with multi-point locking system and reinforced frame. Provides excellent security while maintaining an attractive appearance.",
        price: { amount: 45000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Doors & Windows",
        tags: ["Multi-point Locking", "Reinforced Frame", "Fire Resistant"],
        specifications: {
          Size: "900 x 2100mm",
          Material: "Galvanized Steel (1.5mm)",
          Core: "Honeycomb with Insulation",
          Lock: "5-point Security Lock",
          Finish: "Powder Coated",
        },
        weight: { value: 95, unit: "kg" },
        dimensions: { length: 2.1, width: 0.9, height: 0.06, unit: "m" },
        color: "Various Options",
        material: "Galvanized Steel",
        brand: "SecureDoor",
        warranty: "10-year warranty",
        madeIn: "South Africa",
        stock: 8,
        minOrderQuantity: 1,
      },
      {
        id: "upvc-windows",
        name: "UPVC Casement Windows (1.2m x 1.2m)",
        description:
          "Energy-efficient UPVC casement windows with double glazing. Features multi-point locking, smooth operation, and excellent thermal and acoustic insulation.",
        price: { amount: 22000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Doors & Windows",
        tags: ["Energy Efficient", "Double Glazed", "Multi-point Locking"],
        specifications: {
          Size: "1.2m x 1.2m",
          Frame: "UPVC (70mm profile)",
          Glass: "24mm Double Glazed (4-16-4)",
          Hardware: "Multi-point Locking System",
          "U-Value": "1.4 W/m²K",
        },
        weight: { value: 35, unit: "kg" },
        dimensions: { length: 1.2, width: 1.2, height: 0.07, unit: "m" },
        color: "White",
        material: "UPVC and Glass",
        brand: "ThermalPro",
        warranty: "10-year warranty",
        madeIn: "Germany",
        stock: 15,
        minOrderQuantity: 1,
      },
    ],
  },

  // Hardware & Fasteners
  {
    id: "hardware-hub",
    name: "Hardware Hub",
    logo: "/placeholder.svg?height=80&width=80",
    category: "hardware",
    description:
      "Comprehensive supplier of hardware, fasteners, and accessories for construction and DIY projects with expert advice and custom solutions.",
    rating: 4.6,
    reviewCount: 156,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 790 123 456",
      email: "info@hardwarehub.co.ke",
      website: "www.hardwarehub.co.ke",
    },
    openingHours: "Mon-Sat: 7:30 AM - 6:30 PM, Sun: 9:00 AM - 1:00 PM",
    amenities: ["Cutting Services", "Threading Services", "Custom Orders", "Bulk Discounts", "Technical Advice"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "nail-assortment",
        name: "Construction Nail Assortment (10kg)",
        description:
          "Comprehensive 10kg assortment of construction nails in various sizes and types. Includes common nails, finishing nails, roofing nails, and masonry nails.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Nails",
        tags: ["Various Sizes", "Multiple Types", "Galvanized Finish"],
        specifications: {
          Weight: "10kg total",
          Material: "Hardened Steel",
          Finish: "Galvanized",
          Sizes: "1-6 inches",
          Types: "Common, Finishing, Roofing, Masonry",
        },
        weight: { value: 10, unit: "kg" },
        brand: "ConstructPro",
        warranty: "Quality guaranteed",
        madeIn: "Kenya",
        stock: 50,
        minOrderQuantity: 1,
      },
      {
        id: "door-hardware",
        name: "Heavy-Duty Door & Window Hardware Set",
        description:
          "Complete hardware set for doors and windows including hinges, handles, locks, and all necessary fasteners. Made from high-quality stainless steel for durability and corrosion resistance.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Hinges",
        tags: ["Stainless Steel", "Corrosion Resistant", "Complete Set"],
        specifications: {
          Contents: "10 Hinges, 5 Handles, 5 Locks, Fasteners",
          Material: "304 Stainless Steel",
          Finish: "Brushed Nickel",
          "Hinge Size": "4 inch",
          "Lock Type": "Mortise with Cylinder",
        },
        weight: { value: 8, unit: "kg" },
        color: "Brushed Nickel",
        material: "Stainless Steel",
        brand: "DuraHardware",
        warranty: "5-year warranty",
        madeIn: "Taiwan",
        stock: 15,
        minOrderQuantity: 1,
      },
      {
        id: "power-tools-accessories",
        name: "Power Tool Accessory Kit (100pcs)",
        description:
          "Comprehensive set of 100 power tool accessories including drill bits, screwdriver bits, hole saws, and grinding wheels. Compatible with most major power tool brands.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Tools",
        tags: ["Universal Compatibility", "High-quality Materials", "Organized Case"],
        specifications: {
          Contents: "Drill Bits, Screwdriver Bits, Hole Saws, Grinding Wheels",
          Quantity: "100 pieces",
          Material: "HSS, Tungsten Carbide, Diamond Coated",
          Compatibility: "Universal",
          Case: "Blow-molded case with organizers",
        },
        weight: { value: 3.5, unit: "kg" },
        brand: "ToolPro",
        warranty: "1-year warranty",
        madeIn: "Germany",
        stock: 20,
        minOrderQuantity: 1,
      },
      {
        id: "adhesives-set",
        name: "Construction Adhesives & Sealants Set",
        description:
          "Complete set of construction adhesives and sealants for various applications. Includes epoxy, polyurethane, silicone, and acrylic products for different materials and conditions.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Adhesives",
        tags: ["Multiple Types", "Strong Bond", "Weather Resistant"],
        specifications: {
          Contents: "Epoxy, Polyurethane, Silicone, Acrylic",
          Quantity: "10 tubes/bottles",
          Applications: "Wood, Metal, Concrete, Glass, Plastic",
          "Temperature Range": "-40°C to +120°C",
          "Curing Time": "Varies by product",
        },
        weight: { value: 5, unit: "kg" },
        brand: "BondMaster",
        warranty: "Quality guaranteed",
        madeIn: "USA",
        stock: 25,
        minOrderQuantity: 1,
      },
    ],
  },
  {
    id: "precision-fasteners",
    name: "Precision Fasteners Ltd",
    logo: "/placeholder.svg?height=80&width=80",
    category: "hardware",
    description:
      "Specialized supplier of high-quality fasteners and fixings for construction and industrial applications with custom manufacturing capabilities.",
    rating: 4.5,
    reviewCount: 142,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 701 234 567",
      email: "info@precisionfasteners.co.ke",
      website: "www.precisionfasteners.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 8:30 AM - 12:30 PM",
    amenities: ["Custom Manufacturing", "Material Testing", "Technical Support", "Bulk Orders", "Express Delivery"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "anchor-bolts",
        name: "Heavy-Duty Concrete Anchor Bolts (M12 x 100mm - 50pcs)",
        description:
          "Pack of 50 heavy-duty M12 concrete anchor bolts (100mm length) for securing heavy fixtures to concrete. Features expansion mechanism for strong hold and corrosion-resistant zinc plating.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Bolts",
        tags: ["High Tensile Strength", "Expansion Mechanism", "Zinc Plated"],
        specifications: {
          Size: "M12 x 100mm",
          Quantity: "50 pieces",
          Material: "Carbon Steel",
          Finish: "Zinc Plated",
          "Head Type": "Hex",
        },
        weight: { value: 12, unit: "kg" },
        brand: "AnchorTech",
        warranty: "Quality guaranteed",
        madeIn: "Germany",
        stock: 30,
        minOrderQuantity: 1,
      },
      {
        id: "screw-assortment",
        name: "Stainless Steel Screw Assortment Kit (1000pcs)",
        description:
          "Comprehensive kit of 1000 stainless steel screws in various sizes and types. Includes wood screws, self-tapping screws, machine screws, and sheet metal screws.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Screws",
        tags: ["Stainless Steel", "Various Sizes", "Multiple Types"],
        specifications: {
          Quantity: "1000 pieces total",
          Material: "304 Stainless Steel",
          Types: "Wood, Self-tapping, Machine, Sheet Metal",
          Sizes: "Various (3mm to 8mm)",
          "Head Types": "Flat, Pan, Countersunk",
        },
        weight: { value: 5, unit: "kg" },
        brand: "ScrewMaster",
        warranty: "Quality guaranteed",
        madeIn: "Taiwan",
        stock: 20,
        minOrderQuantity: 1,
      },
      {
        id: "threaded-rods",
        name: "Galvanized Threaded Rods (M10 x 1m - 20pcs)",
        description:
          "Pack of 20 galvanized M10 threaded rods (1m length) for various construction applications. High tensile strength and corrosion resistance for long-lasting performance.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Rods",
        tags: ["Galvanized", "High Tensile", "Corrosion Resistant"],
        specifications: {
          Size: "M10 x 1m",
          Quantity: "20 pieces",
          Material: "Carbon Steel",
          Finish: "Hot-dip Galvanized",
          Thread: "Metric Coarse",
        },
        weight: { value: 25, unit: "kg" },
        brand: "ThreadPro",
        warranty: "Quality guaranteed",
        madeIn: "China",
        stock: 15,
        minOrderQuantity: 5,
      },
      {
        id: "chemical-anchors",
        name: "Chemical Anchor System Kit",
        description:
          "Professional chemical anchor system for high-strength fixing in concrete, brick, and stone. Includes resin cartridges, mixing nozzles, threaded rods, and installation tools.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Anchors",
        tags: ["High Strength", "Chemical Bonding", "Professional Kit"],
        specifications: {
          Contents: "10 Resin Cartridges, Mixing Nozzles, Threaded Rods, Tools",
          "Resin Type": "Epoxy Acrylate",
          "Rod Size": "M10 and M12",
          "Curing Time": "Full cure in 24 hours",
          "Temperature Range": "-40°C to +80°C",
        },
        weight: { value: 7, unit: "kg" },
        brand: "ChemBond",
        warranty: "Quality guaranteed",
        madeIn: "Germany",
        stock: 10,
        minOrderQuantity: 1,
      },
    ],
  },
]

// Get category icon
const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case "building":
      return <Brick className="h-6 w-6" />
    case "tools":
      return <Hammer className="h-6 w-6" />
    case "electrical":
      return <Zap className="h-6 w-6" />
    case "finishing":
      return <Paintbrush className="h-6 w-6" />
    case "hardware":
      return <Screwdriver className="h-6 w-6" />
    default:
      return <Construction className="h-6 w-6" />
  }
}

// Get category color
const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "building":
      return "from-amber-500 to-yellow-500"
    case "tools":
      return "from-red-500 to-orange-500"
    case "electrical":
      return "from-blue-500 to-cyan-500"
    case "finishing":
      return "from-green-500 to-emerald-500"
    case "hardware":
      return "from-purple-500 to-indigo-500"
    default:
      return "from-amber-500 to-yellow-500"
  }
}

// Get category background color
const getCategoryBgColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "building":
      return "bg-amber-100 text-amber-800 border-amber-200"
    case "tools":
      return "bg-red-100 text-red-800 border-red-200"
    case "electrical":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "finishing":
      return "bg-green-100 text-green-800 border-green-200"
    case "hardware":
      return "bg-purple-100 text-purple-800 border-purple-200"
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

export default function ConstructionMaterialsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProvider, setSelectedProvider] = useState<ConstructionMaterial | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ConstructionProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [sortOrder, setSortOrder] = useState("default")

  // Filter providers based on active category and search query
  const filteredProviders = constructionMaterials
    .filter((provider) => {
      // Filter by category
      if (activeCategory !== "all" && provider.category !== activeCategory) {
        return false
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          provider.name.toLowerCase().includes(query) ||
          provider.description.toLowerCase().includes(query) ||
          provider.products.some(
            (product) =>
              product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
          )
        )
      }

      return true
    })
    .filter((provider) => {
      // Filter by price range
      return provider.products.some(
        (product) => product.price.amount >= priceRange[0] && product.price.amount <= priceRange[1],
      )
    })

  // Sort providers based on sort order
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortOrder === "price-asc") {
      const aMinPrice = Math.min(...a.products.map((product) => product.price.amount))
      const bMinPrice = Math.min(...b.products.map((product) => product.price.amount))
      return aMinPrice - bMinPrice
    } else if (sortOrder === "price-desc") {
      const aMaxPrice = Math.max(...a.products.map((product) => product.price.amount))
      const bMaxPrice = Math.max(...b.products.map((product) => product.price.amount))
      return bMaxPrice - aMaxPrice
    } else if (sortOrder === "rating") {
      return b.rating - a.rating
    }
    return 0
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

  // Handle provider click
  const handleProviderClick = (provider: ConstructionMaterial) => {
    setSelectedProvider(provider)
  }

  // Handle product click
  const handleProductClick = (product: ConstructionProduct) => {
    setSelectedProduct(product)
  }

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Materials", icon: <Construction className="h-5 w-5" /> },
          { id: "building", name: "Building Materials", icon: <Brick className="h-5 w-5" /> },
          { id: "tools", name: "Tools & Equipment", icon: <Hammer className="h-5 w-5" /> },
          { id: "electrical", name: "Electrical & Plumbing", icon: <Zap className="h-5 w-5" /> },
          { id: "finishing", name: "Finishing Materials", icon: <Paintbrush className="h-5 w-5" /> },
          { id: "hardware", name: "Hardware & Fasteners", icon: <Screwdriver className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-amber-500 to-yellow-500"
                      : category.id === "building"
                        ? "from-amber-500 to-yellow-500"
                        : category.id === "tools"
                          ? "from-red-500 to-orange-500"
                          : category.id === "electrical"
                            ? "from-blue-500 to-cyan-500"
                            : category.id === "finishing"
                              ? "from-green-500 to-emerald-500"
                              : "from-purple-500 to-indigo-500"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-500 to-yellow-600 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-yellow-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/construction" className="flex items-center text-white mb-4 hover:underline">
                <ChevronRight className="h-4 w-4 mr-1" />
                Back to Construction
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Construction Materials</h1>
              <p className="text-amber-100 max-w-2xl">
                Discover high-quality construction materials, tools, and equipment for your building projects from
                trusted suppliers.
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
                  <Hammer className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Quality Materials</p>
                  <p className="text-sm">Build Better</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for construction materials, tools, or suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-amber-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-500">
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

      {/* Filters Section */}
      <div className="container mx-auto px-4 py-4 relative z-10">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="w-full md:w-2/3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price Range</h3>
              <div className="px-2 py-4">
                <Slider
                  defaultValue={[0, 100000]}
                  max={100000}
                  step={1000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatPrice({ amount: priceRange[0], currency: "KSH" })}</span>
                  <span>{formatPrice({ amount: priceRange[1], currency: "KSH" })}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</h3>
              <div className="flex items-center gap-2">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full p-2 border rounded-md text-sm bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-200"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                <ArrowUpDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-amber-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {sortedProviders.reduce((count, provider) => count + provider.products.length, 0)} products found
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-2 relative z-10">{renderCategoryTabs()}</div>

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProviders.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="h-full"
              >
                <Card
                  className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => handleProviderClick(provider)}
                >
                  <div className={`p-4 bg-gradient-to-r ${getCategoryColor(provider.category)} text-white`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(provider.category)}</div>
                      <h3 className="text-xl font-semibold">{provider.name}</h3>
                    </div>
                    <Badge className="bg-white/30 text-white border-0">
                      {provider.category.charAt(0).toUpperCase() + provider.category.slice(1)}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-center mb-3">
                      <StarRating rating={provider.rating} />
                      <Badge variant="outline" className={getCategoryBgColor(provider.category)}>
                        {provider.reviewCount} reviews
                      </Badge>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">{provider.description}</p>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      {provider.location}
                    </div>
                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {provider.openingHours}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      className={`w-full bg-gradient-to-r ${getCategoryColor(provider.category)} hover:opacity-90 text-white`}
                    >
                      View Materials
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && sortedProviders.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-amber-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any construction materials matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
                setPriceRange([0, 100000])
              }}
            >
              View All Materials
            </Button>
          </div>
        )}
      </div>

      {/* Provider Detail Modal */}
      <Dialog open={!!selectedProvider} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <div
                  className={`p-4 -mt-6 -mx-6 mb-4 bg-gradient-to-r ${getCategoryColor(selectedProvider.category)} text-white`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-white/20 p-2 rounded-full">{getCategoryIcon(selectedProvider.category)}</div>
                    <DialogTitle className="text-2xl font-bold">{selectedProvider.name}</DialogTitle>
                  </div>
                  <DialogDescription className="text-white/90 mt-1">{selectedProvider.description}</DialogDescription>
                </div>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Contact Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Phone className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedProvider.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedProvider.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-amber-500" />
                        <a
                          href={`https://${selectedProvider.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:underline"
                        >
                          {selectedProvider.contact.website}
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Location & Hours</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedProvider.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedProvider.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Services</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">
                    Construction Materials
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedProvider.products.map((product) => (
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
                            {product.isNew && <Badge className="bg-amber-500 text-white">New</Badge>}
                            {product.isPopular && (
                              <Badge className="bg-red-500 text-white flex items-center gap-1">
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
                            <span className="font-bold text-amber-600 dark:text-amber-400">
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
                    {selectedProduct.isNew && <Badge className="bg-amber-500 text-white">New</Badge>}
                    {selectedProduct.isPopular && (
                      <Badge className="bg-red-500 text-white flex items-center gap-1">
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
                    <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  {selectedProduct.specifications && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Specifications</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="text-gray-800 dark:text-gray-200 font-medium">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedProduct.dimensions && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Maximize2 className="h-4 w-4 text-amber-500" />
                      <span>
                        Dimensions: {selectedProduct.dimensions.length} x {selectedProduct.dimensions.width} x{" "}
                        {selectedProduct.dimensions.height} {selectedProduct.dimensions.unit}
                      </span>
                    </div>
                  )}

                  {selectedProduct.weight && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Scale className="h-4 w-4 text-amber-500" />
                      <span>
                        Weight: {selectedProduct.weight.value} {selectedProduct.weight.unit}
                      </span>
                    </div>
                  )}

                  {selectedProduct.material && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span>Material: {selectedProduct.material}</span>
                    </div>
                  )}

                  {selectedProduct.color && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Palette className="h-4 w-4 text-amber-500" />
                      <span>Color: {selectedProduct.color}</span>
                    </div>
                  )}

                  {selectedProduct.brand && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4 text-amber-500" />
                      <span>Brand: {selectedProduct.brand}</span>
                    </div>
                  )}

                  {selectedProduct.madeIn && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Landmark className="h-4 w-4 text-amber-500" />
                      <span>Made in: {selectedProduct.madeIn}</span>
                    </div>
                  )}

                  {selectedProduct.warranty && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      <span>Warranty: {selectedProduct.warranty}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedProduct.stock !== undefined && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4 text-amber-500" />
                      <span>In Stock: {selectedProduct.stock} units</span>
                      {selectedProduct.minOrderQuantity && (
                        <span className="ml-2 text-amber-600 dark:text-amber-400">
                          (Min. Order: {selectedProduct.minOrderQuantity})
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-90 text-white">
                      Add to Cart
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Check Delivery</span>
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

