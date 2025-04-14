"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Tractor,
  Leaf,
  Wheat,
  Droplets,
  FlaskRoundIcon as Flask,
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

interface AgricultureVendor {
  id: string
  name: string
  logo: string
  category: "machinery" | "seeds" | "fertilizers" | "pesticides" | "tools"
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
  products: AgricultureProduct[]
  amenities: string[]
  images: string[]
}

interface AgricultureProduct {
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

// Mock data for agriculture vendors
const agricultureVendors: AgricultureVendor[] = [
  // Machinery Vendors
  {
    id: "farm-tech-solutions",
    name: "Farm Tech Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "machinery",
    description:
      "Leading provider of advanced agricultural machinery and equipment with cutting-edge technology for modern farming.",
    rating: 4.8,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@farmtechsolutions.co.ke",
      website: "www.farmtechsolutions.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: ["Equipment Demos", "Repair Services", "Financing Options", "Delivery Services", "Technical Support"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "compact-tractor",
        name: "Compact Tractor X200",
        description:
          "Versatile compact tractor with 25HP diesel engine, perfect for small to medium farms with excellent fuel efficiency.",
        price: { amount: 450000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Tractors",
        tags: ["Compact", "Diesel", "Versatile"],
      },
      {
        id: "irrigation-system",
        name: "Smart Irrigation System",
        description:
          "Automated irrigation system with soil moisture sensors and mobile app control for optimal water usage.",
        price: { amount: 85000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Irrigation",
        tags: ["Smart", "Water-saving", "Automated"],
      },
      {
        id: "drone-sprayer",
        name: "Agricultural Drone Sprayer",
        description:
          "Precision drone for efficient pesticide and fertilizer application with automated flight patterns.",
        price: { amount: 180000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Drones",
        tags: ["Precision", "Automated", "Efficient"],
      },
      {
        id: "harvester",
        name: "Mini Combine Harvester",
        description: "Compact combine harvester suitable for small to medium farms with multiple crop compatibility.",
        price: { amount: 650000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Harvesters",
        tags: ["Efficient", "Multi-crop", "Compact"],
      },
    ],
  },
  {
    id: "agri-machinery-hub",
    name: "Agri Machinery Hub",
    logo: "/placeholder.svg?height=80&width=80",
    category: "machinery",
    description:
      "One-stop shop for quality agricultural machinery with comprehensive after-sales service and spare parts availability.",
    rating: 4.7,
    reviewCount: 256,
    location: "Nakuru, Kenya",
    contact: {
      phone: "+254 723 456 789",
      email: "sales@agrimachineryhub.com",
      website: "www.agrimachineryhub.com",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    amenities: ["Equipment Testing", "Operator Training", "Spare Parts", "Maintenance Plans", "Trade-in Options"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "rotavator",
        name: "Heavy-Duty Rotavator",
        description:
          "Robust rotavator for soil preparation with adjustable tilling depth and width for various soil conditions.",
        price: { amount: 120000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Tillage Equipment",
        tags: ["Heavy-duty", "Adjustable", "Efficient"],
      },
      {
        id: "planter",
        name: "Precision Seed Planter",
        description:
          "Multi-row seed planter with precise seed placement and spacing control for optimal germination rates.",
        price: { amount: 95000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Planting Equipment",
        tags: ["Precision", "Multi-row", "Efficient"],
      },
      {
        id: "water-pump",
        name: "Solar-Powered Water Pump",
        description: "Eco-friendly solar water pump system with high flow rate and minimal maintenance requirements.",
        price: { amount: 75000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Irrigation",
        tags: ["Solar", "Eco-friendly", "Low-maintenance"],
      },
      {
        id: "grain-dryer",
        name: "Mobile Grain Dryer",
        description: "Portable grain drying system with temperature control for preserving harvest quality.",
        price: { amount: 180000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Post-harvest",
        tags: ["Mobile", "Temperature-control", "Quality"],
      },
    ],
  },

  // Seeds Vendors
  {
    id: "green-harvest-seeds",
    name: "Green Harvest Seeds",
    logo: "/placeholder.svg?height=80&width=80",
    category: "seeds",
    description:
      "Premium supplier of high-quality seeds with excellent germination rates and disease resistance for optimal yields.",
    rating: 4.9,
    reviewCount: 189,
    location: "Eldoret, Kenya",
    contact: {
      phone: "+254 734 567 890",
      email: "info@greenharvestseeds.co.ke",
      website: "www.greenharvestseeds.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 8:00 AM - 1:00 PM",
    amenities: ["Seed Testing", "Farming Advice", "Bulk Discounts", "Seasonal Varieties", "Organic Options"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "hybrid-maize",
        name: "Hybrid Maize Seeds (10kg)",
        description: "Drought-resistant hybrid maize seeds with high germination rate and excellent yield potential.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Cereal Seeds",
        tags: ["Drought-resistant", "High-yield", "Hybrid"],
      },
      {
        id: "tomato-seedlings",
        name: "Tomato Seedlings (Pack of 50)",
        description: "Disease-resistant tomato seedlings grown using organic methods for healthy, productive plants.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Vegetable Seedlings",
        tags: ["Disease-resistant", "Organic", "High-yield"],
      },
      {
        id: "bean-seeds",
        name: "Premium Bean Seeds (5kg)",
        description: "High-quality bean seeds with quick maturation and excellent market value.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Legume Seeds",
        tags: ["Quick-maturing", "High-protein", "Drought-tolerant"],
      },
      {
        id: "fodder-seeds",
        name: "Nutritious Fodder Seeds (25kg)",
        description: "High-protein fodder seed mix for livestock with rapid growth and multiple harvests.",
        price: { amount: 6500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Fodder Seeds",
        tags: ["High-protein", "Fast-growing", "Multiple-harvest"],
      },
    ],
  },
  {
    id: "seed-masters",
    name: "Seed Masters Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "seeds",
    description:
      "Specialized seed company offering both traditional and innovative crop varieties adapted to local growing conditions.",
    rating: 4.6,
    reviewCount: 215,
    location: "Thika, Kenya",
    contact: {
      phone: "+254 745 678 901",
      email: "contact@seedmasters.co.ke",
      website: "www.seedmasters.co.ke",
    },
    openingHours: "Mon-Sat: 8:30 AM - 5:30 PM",
    amenities: ["Germination Guarantee", "Farming Workshops", "Seasonal Guides", "Custom Seed Mixes", "Delivery"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "vegetable-pack",
        name: "Mixed Vegetable Seed Pack",
        description: "Comprehensive pack of 10 essential vegetable seeds for home gardens and small farms.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Vegetable Seeds",
        tags: ["Variety", "Home Garden", "Essential"],
      },
      {
        id: "wheat-seeds",
        name: "Premium Wheat Seeds (20kg)",
        description: "High-yielding wheat variety with excellent disease resistance and drought tolerance.",
        price: { amount: 5500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Cereal Seeds",
        tags: ["Disease-resistant", "Drought-tolerant", "High-yield"],
      },
      {
        id: "fruit-seedlings",
        name: "Grafted Fruit Tree Seedlings",
        description: "Selection of grafted fruit tree seedlings including mango, avocado, and citrus varieties.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Fruit Trees",
        tags: ["Grafted", "Early-bearing", "High-quality"],
      },
      {
        id: "herb-seeds",
        name: "Culinary Herb Seed Collection",
        description: "Complete collection of essential culinary herbs for kitchen gardens and commercial production.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Herb Seeds",
        tags: ["Culinary", "Aromatic", "Easy-growing"],
      },
    ],
  },

  // Fertilizers Vendors
  {
    id: "nutrient-plus",
    name: "Nutrient Plus Fertilizers",
    logo: "/placeholder.svg?height=80&width=80",
    category: "fertilizers",
    description:
      "Manufacturer of balanced fertilizer blends tailored to specific crop needs and soil conditions for maximum yields.",
    rating: 4.8,
    reviewCount: 178,
    location: "Nakuru, Kenya",
    contact: {
      phone: "+254 756 789 012",
      email: "info@nutrientplus.co.ke",
      website: "www.nutrientplus.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: ["Soil Testing", "Custom Blends", "Bulk Discounts", "Technical Support", "Delivery Services"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "npk-fertilizer",
        name: "Premium NPK Fertilizer (50kg)",
        description: "Balanced NPK 17-17-17 fertilizer for general crop nutrition and healthy plant development.",
        price: { amount: 3800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Chemical Fertilizers",
        tags: ["Balanced", "All-purpose", "High-quality"],
      },
      {
        id: "organic-compost",
        name: "Organic Compost (100kg)",
        description: "Nutrient-rich organic compost made from plant materials and animal manure for soil health.",
        price: { amount: 2200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Organic Fertilizers",
        tags: ["Organic", "Soil-health", "Sustainable"],
      },
      {
        id: "micronutrient-mix",
        name: "Micronutrient Fertilizer Blend (25kg)",
        description: "Specialized blend of essential micronutrients to prevent deficiencies and boost crop health.",
        price: { amount: 4800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Specialty Fertilizers",
        tags: ["Micronutrients", "Deficiency-prevention", "Yield-boosting"],
      },
      {
        id: "foliar-feed",
        name: "High-Potency Foliar Feed (5L)",
        description: "Fast-acting liquid fertilizer for foliar application with rapid nutrient absorption.",
        price: { amount: 1500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Liquid Fertilizers",
        tags: ["Fast-acting", "Foliar", "High-potency"],
      },
    ],
  },
  {
    id: "organic-solutions",
    name: "Organic Farming Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "fertilizers",
    description:
      "Specializing in certified organic fertilizers and soil amendments for sustainable and eco-friendly farming practices.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "hello@organicfarmingsolutions.co.ke",
      website: "www.organicfarmingsolutions.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: [
      "Organic Certification",
      "Composting Workshops",
      "Soil Health Analysis",
      "Sustainable Practices",
      "Consultation",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "vermicompost",
        name: "Premium Vermicompost (40kg)",
        description: "High-quality worm castings rich in beneficial microbes and plant nutrients for organic growing.",
        price: { amount: 2800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Organic Fertilizers",
        tags: ["Worm-castings", "Microbe-rich", "Organic"],
      },
      {
        id: "bone-meal",
        name: "Organic Bone Meal (20kg)",
        description: "Phosphorus-rich organic fertilizer ideal for flowering and fruiting plants.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Organic Fertilizers",
        tags: ["Phosphorus", "Slow-release", "Organic"],
      },
      {
        id: "seaweed-extract",
        name: "Seaweed Extract (2L)",
        description: "Natural growth stimulant and micronutrient source derived from seaweed for plant vigor.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Biostimulants",
        tags: ["Growth-stimulant", "Micronutrients", "Natural"],
      },
      {
        id: "compost-tea",
        name: "Compost Tea Brewing Kit",
        description: "Complete kit for brewing nutrient-rich compost tea for organic plant nutrition.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Organic Solutions",
        tags: ["Brewing-kit", "Microbe-rich", "DIY"],
      },
    ],
  },

  // Pesticides Vendors
  {
    id: "crop-protectors",
    name: "Crop Protectors Ltd",
    logo: "/placeholder.svg?height=80&width=80",
    category: "pesticides",
    description:
      "Comprehensive range of crop protection products including fungicides, insecticides, and herbicides for effective pest management.",
    rating: 4.9,
    reviewCount: 312,
    location: "Kisumu, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "info@cropprotectors.co.ke",
      website: "www.cropprotectors.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:00 PM, Sat: 9:00 AM - 1:00 PM",
    amenities: [
      "Pest Identification",
      "Application Training",
      "Safety Equipment",
      "Integrated Pest Management",
      "Technical Support",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "broad-fungicide",
        name: "Broad-Spectrum Fungicide (2L)",
        description: "Effective against a wide range of fungal diseases in crops with preventive and curative action.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Fungicides",
        tags: ["Broad-spectrum", "Preventive", "Curative"],
      },
      {
        id: "insect-control",
        name: "Advanced Insect Control (1L)",
        description: "Powerful insecticide for controlling a wide range of crop pests with long-lasting protection.",
        price: { amount: 2500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Insecticides",
        tags: ["Powerful", "Long-lasting", "Broad-spectrum"],
      },
      {
        id: "weed-killer",
        name: "Selective Weed Killer (5L)",
        description: "Targets specific weeds while leaving crops unharmed for clean fields and maximum yields.",
        price: { amount: 3800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Herbicides",
        tags: ["Selective", "Effective", "Crop-safe"],
      },
      {
        id: "rodent-control",
        name: "Agricultural Rodent Control Kit",
        description: "Complete solution for managing rodent problems in farms and storage facilities.",
        price: { amount: 4200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Pest Control",
        tags: ["Rodent", "Storage-protection", "Complete-kit"],
      },
    ],
  },
  {
    id: "eco-pest-solutions",
    name: "Eco Pest Solutions",
    logo: "/placeholder.svg?height=80&width=80",
    category: "pesticides",
    description:
      "Specializing in environmentally friendly and organic pest control solutions that are safe for beneficial insects and ecosystems.",
    rating: 4.8,
    reviewCount: 267,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 789 012 345",
      email: "contact@ecopestsolutions.co.ke",
      website: "www.ecopestsolutions.co.ke",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: [
      "Organic Certification",
      "Biological Controls",
      "Eco-friendly Options",
      "Pest Monitoring",
      "Consultation",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "neem-oil",
        name: "Organic Neem Oil (1L)",
        description: "Natural insecticide and fungicide derived from neem seeds for organic pest management.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Organic Pesticides",
        tags: ["Organic", "Multi-purpose", "Natural"],
      },
      {
        id: "beneficial-insects",
        name: "Beneficial Insects Pack",
        description: "Live beneficial insects for biological pest control in greenhouses and fields.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Biological Control",
        tags: ["Biological", "Predatory", "Sustainable"],
      },
      {
        id: "sticky-traps",
        name: "Insect Monitoring Traps (Pack of 50)",
        description: "Colored sticky traps for monitoring and reducing flying pest populations in crops.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Monitoring Tools",
        tags: ["Monitoring", "Chemical-free", "Reusable"],
      },
      {
        id: "botanical-spray",
        name: "Botanical Insect Repellent (2L)",
        description: "Plant-based spray that repels pests without harmful chemicals or residues.",
        price: { amount: 1600, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Organic Pesticides",
        tags: ["Botanical", "Residue-free", "Safe"],
      },
    ],
  },

  // Tools Vendors
  {
    id: "farm-tools-direct",
    name: "Farm Tools Direct",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tools",
    description:
      "Quality hand tools and equipment for all farming operations from land preparation to harvesting and storage.",
    rating: 4.8,
    reviewCount: 198,
    location: "Mombasa, Kenya",
    contact: {
      phone: "+254 790 123 456",
      email: "sales@farmtoolsdirect.co.ke",
      website: "www.farmtoolsdirect.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    amenities: ["Tool Sharpening", "Repair Services", "Custom Orders", "Bulk Discounts", "Quality Guarantee"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "premium-hoe",
        name: "Premium Farming Hoe",
        description: "Durable steel hoe with ergonomic hardwood handle for comfortable and efficient digging.",
        price: { amount: 1200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Hand Tools",
        tags: ["Durable", "Ergonomic", "Essential"],
      },
      {
        id: "pruning-set",
        name: "Professional Pruning Set",
        description: "Complete set of high-quality pruning tools for orchard maintenance and plant care.",
        price: { amount: 3500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Gardening Tools",
        tags: ["Professional", "Complete-set", "High-quality"],
      },
      {
        id: "harvest-baskets",
        name: "Durable Harvest Baskets (Set of 3)",
        description: "Sturdy baskets in various sizes for harvesting and transporting produce from field to storage.",
        price: { amount: 1800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Harvesting Tools",
        tags: ["Durable", "Various-sizes", "Practical"],
      },
      {
        id: "soil-testing",
        name: "Digital Soil Testing Kit",
        description:
          "Comprehensive soil testing kit for analyzing pH, nutrients, and moisture for informed farming decisions.",
        price: { amount: 8500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Testing Equipment",
        tags: ["Digital", "Comprehensive", "Accurate"],
      },
    ],
  },
  {
    id: "agri-tool-specialists",
    name: "Agri-Tool Specialists",
    logo: "/placeholder.svg?height=80&width=80",
    category: "tools",
    description:
      "Specialized agricultural tools designed for efficiency and durability in challenging farming environments.",
    rating: 4.7,
    reviewCount: 156,
    location: "Nakuru, Kenya",
    contact: {
      phone: "+254 701 234 567",
      email: "info@agritoolspecialists.co.ke",
      website: "www.agritoolspecialists.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 5:30 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: ["Tool Demonstrations", "Custom Tool Design", "Maintenance Training", "Warranty Service", "Trade-ins"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    products: [
      {
        id: "irrigation-kit",
        name: "Drip Irrigation Starter Kit",
        description: "Complete kit for setting up water-efficient drip irrigation for small to medium garden plots.",
        price: { amount: 4500, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Irrigation Tools",
        tags: ["Water-efficient", "Complete-kit", "Easy-setup"],
      },
      {
        id: "grafting-tools",
        name: "Professional Grafting Tool Set",
        description: "Precision tools for successful plant grafting with instructional guide for various techniques.",
        price: { amount: 3200, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialty Tools",
        tags: ["Precision", "Professional", "Instructional"],
      },
      {
        id: "sprayer-backpack",
        name: "Heavy-Duty Backpack Sprayer (16L)",
        description: "Comfortable and durable backpack sprayer with adjustable nozzles for various applications.",
        price: { amount: 5800, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Spraying Equipment",
        tags: ["Heavy-duty", "Comfortable", "Versatile"],
      },
      {
        id: "greenhouse-kit",
        name: "Small Farm Greenhouse Kit",
        description: "Complete kit for constructing a durable small greenhouse with optimal growing conditions.",
        price: { amount: 35000, currency: "KSH" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Structures",
        tags: ["Complete-kit", "Durable", "Climate-control"],
      },
    ],
  },
]

export default function AgricultureShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<AgricultureVendor | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<AgricultureProduct | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter vendors based on active category and search query
  const filteredVendors = agricultureVendors.filter((vendor) => {
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
  const handleVendorClick = (vendor: AgricultureVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle product click
  const handleProductClick = (product: AgricultureProduct) => {
    setSelectedProduct(product)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "machinery":
        return <Tractor className="h-6 w-6" />
      case "seeds":
        return <Leaf className="h-6 w-6" />
      case "fertilizers":
        return <Droplets className="h-6 w-6" />
      case "pesticides":
        return <Flask className="h-6 w-6" />
      case "tools":
        return <Wheat className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "machinery":
        return "from-blue-500 to-indigo-600"
      case "seeds":
        return "from-green-500 to-emerald-600"
      case "fertilizers":
        return "from-amber-500 to-yellow-600"
      case "pesticides":
        return "from-red-500 to-rose-600"
      case "tools":
        return "from-purple-500 to-violet-600"
      default:
        return "from-green-500 to-emerald-600"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "machinery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "seeds":
        return "bg-green-100 text-green-800 border-green-200"
      case "fertilizers":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "pesticides":
        return "bg-red-100 text-red-800 border-red-200"
      case "tools":
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

  // Render category tabs
  const renderCategoryTabs = () => {
    return (
      <div className="flex overflow-x-auto pb-2 space-x-2 no-scrollbar">
        {[
          { id: "all", name: "All Products", icon: <Sparkles className="h-5 w-5" /> },
          { id: "machinery", name: "Machinery", icon: <Tractor className="h-5 w-5" /> },
          { id: "seeds", name: "Seeds", icon: <Leaf className="h-5 w-5" /> },
          { id: "fertilizers", name: "Fertilizers", icon: <Droplets className="h-5 w-5" /> },
          { id: "pesticides", name: "Pesticides", icon: <Flask className="h-5 w-5" /> },
          { id: "tools", name: "Tools", icon: <Wheat className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-green-500 to-emerald-600"
                      : category.id === "machinery"
                        ? "from-blue-500 to-indigo-600"
                        : category.id === "seeds"
                          ? "from-green-500 to-emerald-600"
                          : category.id === "fertilizers"
                            ? "from-amber-500 to-yellow-600"
                            : category.id === "pesticides"
                              ? "from-red-500 to-rose-600"
                              : "from-purple-500 to-violet-600"
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/agriculture-deals" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Agriculture
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Agriculture Shop</h1>
              <p className="text-green-100 max-w-2xl">
                Discover premium agricultural products including machinery, seeds, fertilizers, pesticides, and farming
                tools.
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
                  <Tractor className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Quality Products</p>
                  <p className="text-sm">For Modern Farming</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for agricultural products, machinery, seeds..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 rounded-full border-transparent bg-white dark:bg-slate-800 text-gray-800 dark:text-white placeholder:text-gray-400 focus:ring-green-500 focus:border-transparent w-full shadow-lg"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
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
                      {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
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
                      View Products
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-green-100 dark:bg-green-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-green-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any agricultural products matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Products
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
                        <Phone className="h-4 w-4 mr-2 text-green-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-green-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-green-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-500 hover:underline"
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
                        <MapPin className="h-4 w-4 mr-2 text-green-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-green-500" />
                        {selectedVendor.openingHours}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">Services & Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedVendor.amenities.map((amenity, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Products</h3>
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
                            <span className="font-bold text-green-600 dark:text-green-400">
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
                    <span className="font-bold text-2xl text-green-600 dark:text-green-400">
                      {formatPrice(selectedProduct.price)}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90 text-white">
                      Purchase Now
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
