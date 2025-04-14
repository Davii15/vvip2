import { Flame } from "lucide-react"

export default function HotDealBadge() {
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-bl-lg font-semibold text-xs flex items-center">
      <Flame className="h-3 w-3 mr-1" />
      HOT DEAL
    </div>
  )
}

