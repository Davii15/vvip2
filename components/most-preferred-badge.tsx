import { ThumbsUp } from "lucide-react"

interface MostPreferredBadgeProps {
  colorScheme?: "blue" | "green" | "purple" | "amber" | "red"
  size?: "sm" | "md" | "lg"
}

export default function MostPreferredBadge({ colorScheme = "blue", size = "md" }: MostPreferredBadgeProps) {
  // Define gradient based on colorScheme
  const getGradient = () => {
    switch (colorScheme) {
      case "green":
        return "from-green-600 to-emerald-600"
      case "purple":
        return "from-purple-600 to-indigo-600"
      case "amber":
        return "from-amber-600 to-yellow-600"
      case "red":
        return "from-red-600 to-rose-600"
      case "blue":
      default:
        return "from-blue-600 to-cyan-600"
    }
  }

  // Define size classes
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "px-2 py-0.5 text-xs"
      case "lg":
        return "px-4 py-1.5 text-sm"
      case "md":
      default:
        return "px-3 py-1 text-xs"
    }
  }

  const gradient = getGradient()
  const sizeClasses = getSizeClasses()

  return (
    <div
      className={`bg-gradient-to-r ${gradient} text-white ${sizeClasses} rounded-full font-bold shadow-lg flex items-center z-10 animate-pulse`}
    >
      <ThumbsUp className="h-3 w-3 mr-1" />
      <span>Most Preferred</span>
    </div>
  )
}

