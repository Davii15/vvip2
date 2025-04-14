"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type React from "react" // Added import for React

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-green-500 p-4 sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-white italic">
            OneShopDiscount
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/categories">Categories</NavLink>
            <NavLink href="/about">About Us</NavLink>
          </div>
          <button className="md:hidden text-white focus:outline-none" onClick={toggleMenu}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <MobileNavLink href="/" onClick={toggleMenu}>
                Home
              </MobileNavLink>
              <MobileNavLink href="/categories" onClick={toggleMenu}>
                Categories
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={toggleMenu}>
                About Us
              </MobileNavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-white hover:text-blue-200 transition duration-150 ease-in-out">
      {children}
    </Link>
  )
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-white hover:bg-blue-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
      onClick={onClick}
    >
      {children}
    </Link>
  )
}

