"use client";

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import clsx from "clsx"

type Props = {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient?: string;
  variant?: "solid" | "outline" | "glass";
  size?: "sm" | "md" | "lg";
  iconPosition?: "left" | "top";
  loading?: boolean;
  disabled?: boolean;
};

export default function QuickAccessButton({
  href,
  icon,
  title,
  description,
  gradient = "from-purple-600 to-indigo-600",
  variant = "solid",
  size = "md",
  iconPosition = "left",
  loading = false,
  disabled = false,
}: Props) {
  const baseStyles =
    "group block rounded-xl text-white shadow-md transition-transform duration-300";

  const variantStyles = {
    solid: `bg-gradient-to-r ${gradient}`,
    outline: "border border-purple-500 text-purple-100 hover:bg-purple-700/10",
    glass: "backdrop-blur-lg bg-white/10 border border-white/10",
  };

  const sizeStyles = {
    sm: "p-4 text-sm",
    md: "p-6 text-base",
    lg: "p-8 text-lg",
  };

  const content = (
    <motion.div
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={clsx(baseStyles, variantStyles[variant], sizeStyles[size], {
        "opacity-50 pointer-events-none": disabled || loading,
      })}
    >
      <div
        className={clsx("flex gap-4 items-start", {
          "flex-col items-center text-center": iconPosition === "top",
          "flex-row": iconPosition === "left",
        })}
      >
        <div className="text-white">{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>
      {loading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-white" />
        </div>
      )}
    </motion.div>
  );

  return disabled ? (
    <div>{content}</div>
  ) : (
    <Link href={href}>{content}</Link>
  );
}
