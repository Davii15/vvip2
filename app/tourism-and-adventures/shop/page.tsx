"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Compass,
  Mountain,
  TelescopeIcon as Binoculars,
  Globe,
  Heart,
  Camera,
  Search,
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  X,
  Sparkles,
  Flame,
  Users,
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

interface AdventureVendor {
  id: string
  name: string
  logo: string
  category: "safari" | "hiking" | "cultural" | "wildlife" | "water"
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
  adventures: Adventure[]
  amenities: string[]
  images: string[]
}

interface Adventure {
  id: string
  name: string
  description: string
  price: Price
  image: string
  isPopular?: boolean
  isNew?: boolean
  category: string
  tags: string[]
  duration: string
  groupSize: string
  startingPoint: string
  difficulty?: "Easy" | "Moderate" | "Challenging" | "Extreme"
}

// Helper function to format price
const formatPrice = (price: Price): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency,
    maximumFractionDigits: 0,
  }).format(price.amount)
}

// Mock data for adventure vendors
const adventureVendors: AdventureVendor[] = [
  // Safari Vendors
  {
    id: "safari-explorers",
    name: "Safari Explorers",
    logo: "/placeholder.svg?height=80&width=80",
    category: "safari",
    description:
      "Premier safari operator offering unforgettable wildlife experiences across East Africa's most stunning national parks and reserves.",
    rating: 4.9,
    reviewCount: 324,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 712 345 678",
      email: "info@safariexplorers.co.ke",
      website: "www.safariexplorers.co.ke",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM, Sun: 10:00 AM - 4:00 PM",
    amenities: [
      "Experienced Guides",
      "Luxury Accommodations",
      "Custom Itineraries",
      "Photography Support",
      "Conservation Focus",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "masai-mara-safari",
        name: "Masai Mara Wildlife Safari",
        description:
          "Experience the incredible wildlife of the Masai Mara, including the Big Five and the Great Migration, with expert guides and luxury accommodations.",
        price: { amount: 2500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Wildlife Safari",
        tags: ["Big Five", "Great Migration", "Luxury"],
        duration: "5 days",
        groupSize: "6-12 people",
        startingPoint: "Nairobi",
      },
      {
        id: "serengeti-adventure",
        name: "Serengeti Migration Safari",
        description:
          "Witness the spectacular wildebeest migration across the Serengeti plains with premium camping and expert wildlife photography guidance.",
        price: { amount: 3200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wildlife Safari",
        tags: ["Migration", "Photography", "Camping"],
        duration: "7 days",
        groupSize: "4-8 people",
        startingPoint: "Arusha",
      },
      {
        id: "amboseli-safari",
        name: "Amboseli Elephant Experience",
        description:
          "Get up close with Africa's largest elephant herds against the backdrop of Mount Kilimanjaro in this specialized safari experience.",
        price: { amount: 1800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Wildlife Safari",
        tags: ["Elephants", "Kilimanjaro Views", "Conservation"],
        duration: "4 days",
        groupSize: "4-10 people",
        startingPoint: "Nairobi",
      },
      {
        id: "private-safari",
        name: "Private Family Safari Adventure",
        description:
          "Customized safari experience perfect for families, with child-friendly activities, educational components, and flexible scheduling.",
        price: { amount: 4500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Private Safari",
        tags: ["Family", "Private", "Educational"],
        duration: "6 days",
        groupSize: "2-8 people",
        startingPoint: "Nairobi or Mombasa",
      },
    ],
  },
  {
    id: "wilderness-safaris",
    name: "Wilderness Safaris",
    logo: "/placeholder.svg?height=80&width=80",
    category: "safari",
    description:
      "Conservation-focused safari operator specializing in authentic wildlife experiences with minimal environmental impact and community benefits.",
    rating: 4.8,
    reviewCount: 256,
    location: "Arusha, Tanzania",
    contact: {
      phone: "+255 763 456 789",
      email: "bookings@wildernesssafaris.com",
      website: "www.wildernesssafaris.com",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: [
      "Eco-friendly Camps",
      "Small Group Sizes",
      "Conservation Projects",
      "Local Community Engagement",
      "Expert Naturalists",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "ngorongoro-safari",
        name: "Ngorongoro Crater Expedition",
        description:
          "Explore the incredible biodiversity of the Ngorongoro Crater, a UNESCO World Heritage site with one of the highest concentrations of wildlife in Africa.",
        price: { amount: 2800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Wildlife Safari",
        tags: ["UNESCO Site", "Biodiversity", "Conservation"],
        duration: "4 days",
        groupSize: "4-8 people",
        startingPoint: "Arusha",
      },
      {
        id: "tarangire-safari",
        name: "Tarangire Wilderness Experience",
        description:
          "Discover the less-visited Tarangire National Park, famous for its elephant migrations, ancient baobab trees, and diverse birdlife.",
        price: { amount: 2200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Wildlife Safari",
        tags: ["Elephants", "Baobabs", "Off-the-beaten-path"],
        duration: "3 days",
        groupSize: "4-10 people",
        startingPoint: "Arusha",
      },
      {
        id: "conservation-safari",
        name: "Conservation Safari Experience",
        description:
          "Participate in wildlife conservation efforts while enjoying traditional safari activities, with a portion of proceeds supporting local conservation projects.",
        price: { amount: 3500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Conservation Safari",
        tags: ["Conservation", "Hands-on", "Educational"],
        duration: "8 days",
        groupSize: "4-8 people",
        startingPoint: "Arusha",
      },
      {
        id: "photography-safari",
        name: "Wildlife Photography Safari",
        description:
          "Specialized safari designed for photography enthusiasts with expert photography guides, optimal positioning, and extended time at sightings.",
        price: { amount: 3800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Specialty Safari",
        tags: ["Photography", "Expert Guides", "Small Groups"],
        duration: "7 days",
        groupSize: "4-6 people",
        startingPoint: "Arusha",
      },
    ],
  },

  // Hiking Vendors
  {
    id: "peak-adventures",
    name: "Peak Adventures",
    logo: "/placeholder.svg?height=80&width=80",
    category: "hiking",
    description:
      "Specialized trekking company offering guided hiking experiences on Africa's most iconic mountains and trails with expert guides and safety focus.",
    rating: 4.9,
    reviewCount: 189,
    location: "Moshi, Tanzania",
    contact: {
      phone: "+255 734 567 890",
      email: "climb@peakadventures.com",
      website: "www.peakadventures.com",
    },
    openingHours: "Mon-Sat: 8:00 AM - 6:00 PM",
    amenities: [
      "Certified Mountain Guides",
      "Quality Equipment",
      "Altitude Sickness Prevention",
      "Porter Support",
      "Emergency Evacuation",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "kilimanjaro-machame",
        name: "Kilimanjaro Climb - Machame Route",
        description:
          "Conquer Africa's highest peak via the scenic Machame Route with experienced guides, quality equipment, and excellent acclimatization protocol.",
        price: { amount: 2800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Mountain Climbing",
        tags: ["Kilimanjaro", "Summit", "Scenic Route"],
        duration: "7 days",
        groupSize: "4-12 people",
        startingPoint: "Moshi",
        difficulty: "Challenging",
      },
      {
        id: "mount-meru-trek",
        name: "Mount Meru Expedition",
        description:
          "Trek Tanzania's second-highest peak, offering spectacular views of Kilimanjaro and abundant wildlife in the lower slopes.",
        price: { amount: 1500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Mountain Climbing",
        tags: ["Mount Meru", "Less Crowded", "Wildlife"],
        duration: "4 days",
        groupSize: "2-10 people",
        startingPoint: "Arusha",
        difficulty: "Moderate",
      },
      {
        id: "usambara-hiking",
        name: "Usambara Mountains Cultural Trek",
        description:
          "Explore the lush Usambara Mountains with stunning vistas, unique flora, and authentic cultural experiences in local villages.",
        price: { amount: 950, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Cultural Trekking",
        tags: ["Cultural", "Scenic", "Moderate"],
        duration: "5 days",
        groupSize: "2-8 people",
        startingPoint: "Lushoto",
        difficulty: "Moderate",
      },
      {
        id: "crater-highlands",
        name: "Crater Highlands Trek",
        description:
          "Trek through the stunning Crater Highlands, including Olmoti and Empakaai craters, with breathtaking views and Maasai cultural interactions.",
        price: { amount: 1800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Wilderness Trekking",
        tags: ["Craters", "Maasai", "Off-the-beaten-path"],
        duration: "4 days",
        groupSize: "2-8 people",
        startingPoint: "Arusha",
        difficulty: "Moderate",
      },
    ],
  },
  {
    id: "trail-blazers",
    name: "Trail Blazers Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "hiking",
    description:
      "Adventure company specializing in hiking and trekking experiences across Kenya's diverse landscapes, from mountains to forests and valleys.",
    rating: 4.7,
    reviewCount: 145,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 767 890 123",
      email: "info@trailblazerskenya.com",
      website: "www.trailblazerskenya.com",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM, Sat: 9:00 AM - 2:00 PM",
    amenities: [
      "Local Expert Guides",
      "Camping Equipment",
      "Customized Itineraries",
      "Safety Protocols",
      "Transport Included",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "mount-kenya-climb",
        name: "Mount Kenya Climbing Adventure",
        description:
          "Summit Kenya's highest peak through the scenic Sirimon-Chogoria route, experiencing diverse ecosystems and stunning alpine scenery.",
        price: { amount: 1900, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Mountain Climbing",
        tags: ["Mount Kenya", "Alpine", "Summit"],
        duration: "6 days",
        groupSize: "2-10 people",
        startingPoint: "Nairobi",
        difficulty: "Challenging",
      },
      {
        id: "aberdare-trek",
        name: "Aberdare Ranges Trek",
        description:
          "Explore the mystical Aberdare mountain range with its moorlands, bamboo forests, waterfalls, and diverse wildlife.",
        price: { amount: 1200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Forest Trekking",
        tags: ["Forests", "Waterfalls", "Wildlife"],
        duration: "4 days",
        groupSize: "2-12 people",
        startingPoint: "Nairobi",
        difficulty: "Moderate",
      },
      {
        id: "hells-gate-hike",
        name: "Hell's Gate Gorge Adventure",
        description:
          "Hike through the dramatic landscapes of Hell's Gate National Park, featuring towering cliffs, geothermal features, and wildlife.",
        price: { amount: 120, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Day Hikes",
        tags: ["Gorges", "Geothermal", "Rock Climbing"],
        duration: "1 day",
        groupSize: "2-15 people",
        startingPoint: "Naivasha",
        difficulty: "Easy",
      },
      {
        id: "ngong-hills",
        name: "Ngong Hills Hiking Trail",
        description:
          "Enjoy panoramic views of Nairobi and the Great Rift Valley on this accessible hiking trail just outside Kenya's capital city.",
        price: { amount: 80, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Day Hikes",
        tags: ["Scenic Views", "Accessible", "Nairobi"],
        duration: "1 day",
        groupSize: "2-20 people",
        startingPoint: "Nairobi",
        difficulty: "Easy",
      },
    ],
  },

  // Cultural Vendors
  {
    id: "cultural-immersions",
    name: "Cultural Immersions Africa",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cultural",
    description:
      "Authentic cultural experiences connecting travelers with local communities across East Africa for meaningful and respectful cultural exchanges.",
    rating: 4.8,
    reviewCount: 178,
    location: "Arusha, Tanzania",
    contact: {
      phone: "+255 756 789 012",
      email: "connect@culturalimmersions.com",
      website: "www.culturalimmersions.com",
    },
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM",
    amenities: [
      "Local Community Guides",
      "Authentic Experiences",
      "Ethical Tourism",
      "Small Groups",
      "Cultural Workshops",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "maasai-cultural-stay",
        name: "Maasai Village Immersion",
        description:
          "Live with a Maasai family in their traditional village, learning about their customs, participating in daily activities, and experiencing their way of life.",
        price: { amount: 950, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Cultural Immersion",
        tags: ["Maasai", "Homestay", "Traditional"],
        duration: "3 days",
        groupSize: "2-6 people",
        startingPoint: "Arusha",
      },
      {
        id: "zanzibar-cultural-tour",
        name: "Zanzibar Cultural Heritage Tour",
        description:
          "Explore the rich cultural heritage of Stone Town and spice plantations while learning about Zanzibar's complex history and diverse influences.",
        price: { amount: 580, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Cultural Tour",
        tags: ["Stone Town", "Spice Tour", "History"],
        duration: "2 days",
        groupSize: "2-12 people",
        startingPoint: "Zanzibar",
      },
      {
        id: "samburu-experience",
        name: "Samburu Cultural Experience",
        description:
          "Connect with the Samburu people of northern Kenya, learning about their unique traditions, colorful attire, and semi-nomadic lifestyle.",
        price: { amount: 1200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Cultural Immersion",
        tags: ["Samburu", "Northern Kenya", "Traditional"],
        duration: "4 days",
        groupSize: "2-8 people",
        startingPoint: "Nairobi",
      },
      {
        id: "swahili-coast-culture",
        name: "Swahili Coast Cultural Journey",
        description:
          "Discover the rich Swahili culture along Kenya's coast, visiting ancient ruins, traditional villages, and experiencing local cuisine and music.",
        price: { amount: 850, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Cultural Tour",
        tags: ["Swahili", "Coastal", "Historical"],
        duration: "5 days",
        groupSize: "4-10 people",
        startingPoint: "Mombasa",
      },
    ],
  },
  {
    id: "heritage-tours",
    name: "African Heritage Tours",
    logo: "/placeholder.svg?height=80&width=80",
    category: "cultural",
    description:
      "Specialized tour operator focusing on Africa's rich historical and cultural heritage, from ancient civilizations to contemporary expressions.",
    rating: 4.7,
    reviewCount: 156,
    location: "Addis Ababa, Ethiopia",
    contact: {
      phone: "+251 911 234 567",
      email: "info@africanheritage.com",
      website: "www.africanheritage.com",
    },
    openingHours: "Mon-Fri: 8:30 AM - 5:30 PM",
    amenities: [
      "Expert Cultural Historians",
      "Museum Partnerships",
      "Festival Access",
      "Artisan Workshops",
      "Language Support",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "ethiopian-historical",
        name: "Ethiopian Historical Circuit",
        description:
          "Journey through Ethiopia's remarkable historical sites, including Lalibela's rock-hewn churches, Gondar's castles, and Axum's ancient stelae.",
        price: { amount: 2200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Historical Tour",
        tags: ["Lalibela", "Ancient History", "UNESCO Sites"],
        duration: "10 days",
        groupSize: "4-12 people",
        startingPoint: "Addis Ababa",
      },
      {
        id: "tribal-omo-valley",
        name: "Omo Valley Tribal Expedition",
        description:
          "Visit the diverse tribal communities of Ethiopia's Omo Valley, known for their unique cultural practices, body adornments, and traditional lifestyles.",
        price: { amount: 1800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Tribal Cultures",
        tags: ["Tribal", "Remote", "Photography"],
        duration: "7 days",
        groupSize: "4-8 people",
        startingPoint: "Addis Ababa",
      },
      {
        id: "lamu-festival",
        name: "Lamu Cultural Festival Experience",
        description:
          "Participate in the vibrant Lamu Cultural Festival on Kenya's coast, celebrating Swahili culture through dhow races, traditional dances, and crafts.",
        price: { amount: 1500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Festival Tour",
        tags: ["Festival", "Swahili", "Island"],
        duration: "5 days",
        groupSize: "4-12 people",
        startingPoint: "Nairobi",
      },
      {
        id: "african-art-tour",
        name: "Contemporary African Art Tour",
        description:
          "Explore Africa's dynamic contemporary art scene through gallery visits, artist studio tours, and workshops in major cultural centers.",
        price: { amount: 1900, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Art & Culture",
        tags: ["Contemporary Art", "Galleries", "Workshops"],
        duration: "8 days",
        groupSize: "4-10 people",
        startingPoint: "Nairobi",
      },
    ],
  },

  // Wildlife Vendors
  {
    id: "wildlife-encounters",
    name: "Wildlife Encounters",
    logo: "/placeholder.svg?height=80&width=80",
    category: "wildlife",
    description:
      "Specialized wildlife experiences focusing on specific animal species and conservation efforts across East Africa's diverse ecosystems.",
    rating: 4.9,
    reviewCount: 312,
    location: "Nairobi, Kenya",
    contact: {
      phone: "+254 778 901 234",
      email: "bookings@wildlifeencounters.co.ke",
      website: "www.wildlifeencounters.co.ke",
    },
    openingHours: "Mon-Fri: 8:00 AM - 6:00 PM, Sat: 9:00 AM - 3:00 PM",
    amenities: [
      "Wildlife Specialists",
      "Conservation Contributions",
      "Small Groups",
      "Photography Hides",
      "Research Access",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "gorilla-trekking",
        name: "Mountain Gorilla Trekking",
        description:
          "Trek through the misty forests of Rwanda's Volcanoes National Park for an unforgettable encounter with endangered mountain gorillas in their natural habitat.",
        price: { amount: 1800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Primate Tracking",
        tags: ["Gorillas", "Conservation", "Rainforest"],
        duration: "4 days",
        groupSize: "2-8 people",
        startingPoint: "Kigali",
      },
      {
        id: "chimpanzee-habituation",
        name: "Chimpanzee Habituation Experience",
        description:
          "Participate in the habituation of wild chimpanzees in Uganda's Kibale Forest, spending full days with researchers observing these fascinating primates.",
        price: { amount: 1500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Primate Research",
        tags: ["Chimpanzees", "Research", "Immersive"],
        duration: "3 days",
        groupSize: "2-4 people",
        startingPoint: "Entebbe",
      },
      {
        id: "rhino-tracking",
        name: "Black Rhino Tracking Safari",
        description:
          "Track endangered black rhinos on foot with armed rangers and expert guides in Kenya's Ol Pejeta Conservancy, a premier rhino sanctuary.",
        price: { amount: 1200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Wildlife Tracking",
        tags: ["Rhinos", "Conservation", "Walking Safari"],
        duration: "3 days",
        groupSize: "2-6 people",
        startingPoint: "Nairobi",
      },
      {
        id: "big-cats-photography",
        name: "Big Cats Photography Safari",
        description:
          "Specialized safari focused on photographing lions, leopards, and cheetahs with expert photography guides and specially designed vehicles.",
        price: { amount: 3500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Photography Safari",
        tags: ["Big Cats", "Photography", "Specialized"],
        duration: "7 days",
        groupSize: "4-6 people",
        startingPoint: "Nairobi",
      },
    ],
  },
  {
    id: "conservation-journeys",
    name: "Conservation Journeys",
    logo: "/placeholder.svg?height=80&width=80",
    category: "wildlife",
    description:
      "Conservation-focused travel experiences that combine wildlife viewing with hands-on participation in research and conservation projects.",
    rating: 4.8,
    reviewCount: 267,
    location: "Arusha, Tanzania",
    contact: {
      phone: "+255 789 012 345",
      email: "info@conservationjourneys.org",
      website: "www.conservationjourneys.org",
    },
    openingHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    amenities: [
      "Research Participation",
      "Conservation Experts",
      "Educational Materials",
      "Impact Reporting",
      "Sustainable Practices",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "elephant-research",
        name: "Elephant Conservation Experience",
        description:
          "Work alongside researchers studying elephant behavior and conservation in Kenya's Amboseli National Park, home to some of Africa's largest elephant populations.",
        price: { amount: 2200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Conservation Experience",
        tags: ["Elephants", "Research", "Hands-on"],
        duration: "7 days",
        groupSize: "4-8 people",
        startingPoint: "Nairobi",
      },
      {
        id: "predator-conservation",
        name: "Predator Conservation Project",
        description:
          "Contribute to lion and cheetah conservation efforts in the Maasai Mara ecosystem, assisting researchers with monitoring and community outreach.",
        price: { amount: 2500, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Conservation Experience",
        tags: ["Big Cats", "Research", "Community"],
        duration: "8 days",
        groupSize: "4-6 people",
        startingPoint: "Nairobi",
      },
      {
        id: "sea-turtle-conservation",
        name: "Sea Turtle Conservation Program",
        description:
          "Participate in sea turtle conservation on Kenya's coast, monitoring nesting beaches, protecting hatchlings, and engaging with local communities.",
        price: { amount: 1400, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Marine Conservation",
        tags: ["Sea Turtles", "Marine", "Beach Patrols"],
        duration: "6 days",
        groupSize: "4-10 people",
        startingPoint: "Mombasa",
      },
      {
        id: "wildlife-monitoring",
        name: "Wildlife Monitoring Expedition",
        description:
          "Join researchers in setting up camera traps, conducting wildlife surveys, and analyzing data to support conservation efforts in protected areas.",
        price: { amount: 1800, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Research Expedition",
        tags: ["Monitoring", "Data Collection", "Multiple Species"],
        duration: "9 days",
        groupSize: "4-8 people",
        startingPoint: "Arusha",
      },
    ],
  },

  // Water Adventure Vendors
  {
    id: "blue-horizons",
    name: "Blue Horizons Adventures",
    logo: "/placeholder.svg?height=80&width=80",
    category: "water",
    description:
      "Specialized water adventure company offering exciting experiences on East Africa's oceans, lakes, and rivers with expert guides and quality equipment.",
    rating: 4.8,
    reviewCount: 198,
    location: "Zanzibar, Tanzania",
    contact: {
      phone: "+255 790 123 456",
      email: "info@bluehorizons.co.tz",
      website: "www.bluehorizons.co.tz",
    },
    openingHours: "Mon-Sun: 7:00 AM - 6:00 PM",
    amenities: [
      "Professional Equipment",
      "Certified Instructors",
      "Safety Boats",
      "Underwater Cameras",
      "Refreshments Included",
    ],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "zanzibar-diving",
        name: "Zanzibar Diving Adventure",
        description:
          "Explore the vibrant coral reefs and marine life around Zanzibar with PADI-certified instructors and quality diving equipment.",
        price: { amount: 950, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Scuba Diving",
        tags: ["Coral Reefs", "Marine Life", "PADI"],
        duration: "5 days",
        groupSize: "4-10 people",
        startingPoint: "Zanzibar",
      },
      {
        id: "white-water-rafting",
        name: "Nile White Water Rafting",
        description:
          "Experience the thrill of white water rafting on the mighty Nile River in Uganda, tackling world-class rapids with expert guides.",
        price: { amount: 180, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Rafting",
        tags: ["Rapids", "Adrenaline", "Nile"],
        duration: "1 day",
        groupSize: "4-8 people per raft",
        startingPoint: "Jinja",
      },
      {
        id: "dhow-sailing",
        name: "Traditional Dhow Sailing Safari",
        description:
          "Sail the turquoise waters of the Indian Ocean on a traditional wooden dhow, exploring remote islands and pristine beaches.",
        price: { amount: 750, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Sailing",
        tags: ["Traditional", "Islands", "Beaches"],
        duration: "3 days",
        groupSize: "2-12 people",
        startingPoint: "Zanzibar",
      },
      {
        id: "lake-victoria-kayaking",
        name: "Lake Victoria Kayaking Expedition",
        description:
          "Paddle through Africa's largest lake, exploring islands, fishing villages, and spotting unique bird species along the shoreline.",
        price: { amount: 650, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Kayaking",
        tags: ["Freshwater", "Islands", "Birdwatching"],
        duration: "4 days",
        groupSize: "4-8 people",
        startingPoint: "Entebbe",
      },
    ],
  },
  {
    id: "ocean-explorers",
    name: "Ocean Explorers Kenya",
    logo: "/placeholder.svg?height=80&width=80",
    category: "water",
    description:
      "Premier marine adventure company on Kenya's coast offering diving, snorkeling, fishing, and sailing experiences in the Indian Ocean.",
    rating: 4.7,
    reviewCount: 156,
    location: "Diani Beach, Kenya",
    contact: {
      phone: "+254 701 234 567",
      email: "adventures@oceanexplorers.co.ke",
      website: "www.oceanexplorers.co.ke",
    },
    openingHours: "Mon-Sun: 7:00 AM - 7:00 PM",
    amenities: ["Boat Fleet", "Dive Center", "Beach Facilities", "Equipment Rental", "Marine Biologists"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    adventures: [
      {
        id: "whale-shark-snorkeling",
        name: "Whale Shark Snorkeling Safari",
        description:
          "Snorkel with magnificent whale sharks in their natural habitat off Kenya's coast with marine biologists and experienced guides.",
        price: { amount: 220, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isPopular: true,
        category: "Snorkeling",
        tags: ["Whale Sharks", "Marine Life", "Guided"],
        duration: "1 day",
        groupSize: "4-10 people",
        startingPoint: "Diani Beach",
      },
      {
        id: "deep-sea-fishing",
        name: "Deep Sea Fishing Expedition",
        description:
          "Experience world-class deep sea fishing for marlin, sailfish, and tuna in Kenya's rich fishing grounds with professional equipment and crew.",
        price: { amount: 450, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Fishing",
        tags: ["Big Game", "Sport Fishing", "Boat"],
        duration: "1 day",
        groupSize: "2-6 people",
        startingPoint: "Mombasa",
      },
      {
        id: "marine-conservation",
        name: "Marine Conservation Experience",
        description:
          "Combine diving with marine conservation activities, including coral reef monitoring, beach cleanups, and community education programs.",
        price: { amount: 1200, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        isNew: true,
        category: "Conservation",
        tags: ["Coral Reefs", "Conservation", "Education"],
        duration: "5 days",
        groupSize: "4-8 people",
        startingPoint: "Diani Beach",
      },
      {
        id: "island-hopping",
        name: "Lamu Archipelago Island Hopping",
        description:
          "Explore the beautiful Lamu Archipelago by boat, visiting historic Lamu Town, pristine beaches, and traditional fishing villages.",
        price: { amount: 980, currency: "USD" },
        image: "/placeholder.svg?height=300&width=300",
        category: "Island Tour",
        tags: ["Islands", "Cultural", "Beaches"],
        duration: "4 days",
        groupSize: "4-12 people",
        startingPoint: "Lamu",
      },
    ],
  },
]

export default function TourismAdventuresShopPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVendor, setSelectedVendor] = useState<AdventureVendor | null>(null)
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Filter vendors based on active category and search query
  const filteredVendors = adventureVendors.filter((vendor) => {
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
        vendor.adventures.some(
          (adventure) =>
            adventure.name.toLowerCase().includes(query) || adventure.description.toLowerCase().includes(query),
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
  const handleVendorClick = (vendor: AdventureVendor) => {
    setSelectedVendor(vendor)
  }

  // Handle adventure click
  const handleAdventureClick = (adventure: Adventure) => {
    setSelectedAdventure(adventure)
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "safari":
        return <Binoculars className="h-6 w-6" />
      case "hiking":
        return <Mountain className="h-6 w-6" />
      case "cultural":
        return <Globe className="h-6 w-6" />
      case "wildlife":
        return <Heart className="h-6 w-6" />
      case "water":
        return <Compass className="h-6 w-6" />
      default:
        return <Sparkles className="h-6 w-6" />
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "safari":
        return "from-amber-500 to-amber-700"
      case "hiking":
        return "from-emerald-500 to-emerald-700"
      case "cultural":
        return "from-purple-500 to-purple-700"
      case "wildlife":
        return "from-red-500 to-red-700"
      case "water":
        return "from-blue-500 to-blue-700"
      default:
        return "from-amber-500 to-amber-700"
    }
  }

  // Get category background color
  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case "safari":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "hiking":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "cultural":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "wildlife":
        return "bg-red-100 text-red-800 border-red-200"
      case "water":
        return "bg-blue-100 text-blue-800 border-blue-200"
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
          { id: "all", name: "All Adventures", icon: <Sparkles className="h-5 w-5" /> },
          { id: "safari", name: "Safari Adventures", icon: <Binoculars className="h-5 w-5" /> },
          { id: "hiking", name: "Hiking & Trekking", icon: <Mountain className="h-5 w-5" /> },
          { id: "cultural", name: "Cultural Experiences", icon: <Globe className="h-5 w-5" /> },
          { id: "wildlife", name: "Wildlife Conservation", icon: <Heart className="h-5 w-5" /> },
          { id: "water", name: "Water Adventures", icon: <Compass className="h-5 w-5" /> },
        ].map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all ${
              activeCategory === category.id
                ? `bg-gradient-to-r ${
                    category.id === "all"
                      ? "from-amber-500 to-amber-700"
                      : category.id === "safari"
                        ? "from-amber-500 to-amber-700"
                        : category.id === "hiking"
                          ? "from-emerald-500 to-emerald-700"
                          : category.id === "cultural"
                            ? "from-purple-500 to-purple-700"
                            : category.id === "wildlife"
                              ? "from-red-500 to-red-700"
                              : "from-blue-500 to-blue-700"
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-amber-600 to-emerald-700 py-12">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-300 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-300 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/tourism-and-adventures" className="flex items-center text-white mb-4 hover:underline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Tourism & Adventures
              </Link>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">Adventure Experiences</h1>
              <p className="text-amber-100 max-w-2xl">
                Discover extraordinary adventures across Africa's most breathtaking landscapes, from thrilling safaris
                to cultural immersions and conservation experiences.
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
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p className="font-medium">Unforgettable Experiences</p>
                  <p className="text-sm">Create Lasting Memories</p>
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
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full opacity-70 blur group-hover:opacity-100 transition duration-200"></div>
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Search for safaris, hikes, cultural experiences..."
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

      {/* Category Tabs */}
      <div className="container mx-auto px-4 py-6 relative z-10">{renderCategoryTabs()}</div>

      {/* Category Content */}
      <div className="container mx-auto px-4 py-6 relative z-10">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
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
                      {vendor.category === "safari"
                        ? "Safari Adventures"
                        : vendor.category === "hiking"
                          ? "Hiking & Trekking"
                          : vendor.category === "cultural"
                            ? "Cultural Experiences"
                            : vendor.category === "wildlife"
                              ? "Wildlife Conservation"
                              : "Water Adventures"}
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
                      View Adventures
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {!isLoading && filteredVendors.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-amber-100 dark:bg-amber-900/30 p-8 rounded-lg inline-block mb-4">
              <Search className="h-12 w-12 text-amber-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-200 mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any adventure providers matching your criteria. Try adjusting your search or browse a
              different category.
            </p>
            <Button
              className="mt-4 bg-gradient-to-r from-amber-500 to-emerald-600 text-white"
              onClick={() => {
                setSearchQuery("")
                setActiveCategory("all")
              }}
            >
              View All Adventures
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
                        <Phone className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mail className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.contact.email}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Globe className="h-4 w-4 mr-2 text-amber-500" />
                        <a
                          href={`https://${selectedVendor.contact.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-500 hover:underline"
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
                        <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                        {selectedVendor.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Clock className="h-4 w-4 mr-2 text-amber-500" />
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
                          className="bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 text-xl">Featured Adventures</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedVendor.adventures.map((adventure) => (
                      <Card
                        key={adventure.id}
                        className="overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleAdventureClick(adventure)}
                      >
                        <div className="relative h-40 bg-gray-100 dark:bg-gray-800">
                          <Image
                            src={adventure.image || "/placeholder.svg"}
                            alt={adventure.name}
                            layout="fill"
                            objectFit="cover"
                          />
                          <div className="absolute top-2 right-2 flex flex-col gap-1">
                            {adventure.isNew && <Badge className="bg-amber-500 text-white">New</Badge>}
                            {adventure.isPopular && (
                              <Badge className="bg-emerald-500 text-white flex items-center gap-1">
                                <Flame className="h-3 w-3" />
                                <span>Popular</span>
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-3">
                          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{adventure.name}</h4>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {adventure.description}
                          </p>
                          <div className="flex justify-between items-center">
                            <Badge
                              variant="outline"
                              className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                            >
                              {adventure.category}
                            </Badge>
                            <span className="font-bold text-amber-600 dark:text-amber-400">
                              {formatPrice(adventure.price)}
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

      {/* Adventure Detail Modal */}
      <Dialog open={!!selectedAdventure} onOpenChange={(open) => !open && setSelectedAdventure(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAdventure && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedAdventure.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative h-60 md:h-full bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <Image
                    src={selectedAdventure.image || "/placeholder.svg"}
                    alt={selectedAdventure.name}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1">
                    {selectedAdventure.isNew && <Badge className="bg-amber-500 text-white">New</Badge>}
                    {selectedAdventure.isPopular && (
                      <Badge className="bg-emerald-500 text-white flex items-center gap-1">
                        <Flame className="h-3 w-3" />
                        <span>Popular</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">{selectedAdventure.description}</p>

                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className="bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                    >
                      {selectedAdventure.category}
                    </Badge>
                    <span className="font-bold text-2xl text-amber-600 dark:text-amber-400">
                      {formatPrice(selectedAdventure.price)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Duration: {selectedAdventure.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Group Size: {selectedAdventure.groupSize}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-300">
                      <MapPin className="h-4 w-4 mr-2 text-amber-500" />
                      <span>Starting Point: {selectedAdventure.startingPoint}</span>
                    </div>
                    {selectedAdventure.difficulty && (
                      <div className="flex items-center text-gray-600 dark:text-gray-300">
                        <Mountain className="h-4 w-4 mr-2 text-amber-500" />
                        <span>Difficulty: {selectedAdventure.difficulty}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Adventure Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAdventure.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button className="flex-1 bg-gradient-to-r from-amber-500 to-emerald-600 hover:opacity-90 text-white">
                      Book Now
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
