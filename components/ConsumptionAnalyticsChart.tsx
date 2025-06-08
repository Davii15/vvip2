"use client"

import { useState, useMemo } from "react"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { BarChart3, LineChartIcon, AreaChartIcon, PieChartIcon, TrendingUp, Calendar, Filter } from "lucide-react"

// Define consumption categories with colors
const categories = [
  { key: "agriculture", label: "Agriculture Products & Services", color: "#10B981", icon: "🌾" },
  { key: "hospitality", label: "Hospitality", color: "#F59E0B", icon: "🏨" },
  { key: "tourism", label: "Tourism & Adventures", color: "#3B82F6", icon: "✈️" },
  { key: "insurance", label: "Insurance", color: "#8B5CF6", icon: "🛡️" },
  { key: "drinks", label: "Drinks", color: "#EF4444", icon: "🥤" },
  { key: "retail", label: "Retail Products", color: "#06B6D4", icon: "🛍️" },
  { key: "construction", label: "Construction & Materials", color: "#84CC16", icon: "🏗️" },
  { key: "financial", label: "Financial Products", color: "#F97316", icon: "💰" },
  { key: "entertainment", label: "Entertainment", color: "#EC4899", icon: "🎬" },
  { key: "beauty", label: "Beauty Products & Services", color: "#A855F7", icon: "💄" },
  { key: "furniture", label: "Furniture & Other Products", color: "#059669", icon: "🪑" },
]

// Generate consumption data
const generateConsumptionData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]

  // Monthly data with seasonal patterns
  const monthlyData = months.map((month, index) => {
    const seasonalMultiplier = {
      agriculture: index < 3 || index > 8 ? 1.4 : 0.7,
      hospitality: [5, 6, 7, 11].includes(index) ? 1.6 : 0.9,
      tourism: [5, 6, 7, 11].includes(index) ? 1.9 : 0.6,
      insurance: [0, 11].includes(index) ? 1.5 : 0.9,
      drinks: [5, 6, 7].includes(index) ? 1.7 : 0.9,
      retail: [10, 11].includes(index) ? 2.2 : 0.8,
      construction: [3, 4, 5, 6, 7, 8].includes(index) ? 1.5 : 0.5,
      financial: [0, 3, 6, 9].includes(index) ? 1.4 : 0.9,
      entertainment: [5, 6, 7, 11].includes(index) ? 1.5 : 0.9,
      beauty: [4, 5, 10, 11].includes(index) ? 1.4 : 0.9,
      furniture: [2, 3, 8, 9].includes(index) ? 1.3 : 0.8,
    }

    const baseData = { month }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 60) + 40
      baseData[category.key] = Math.floor(
        baseValue * seasonalMultiplier[category.key as keyof typeof seasonalMultiplier],
      )

      // Weekday/weekend split
      const weekendRatio = ["drinks", "entertainment", "tourism", "beauty"].includes(category.key) ? 0.45 : 0.25
      baseData[`${category.key}_weekday`] = Math.floor(baseData[category.key] * (1 - weekendRatio))
      baseData[`${category.key}_weekend`] = Math.floor(baseData[category.key] * weekendRatio)
    })

    return baseData
  })

  // Weekly data
  const weeklyData = weeks.map((week) => {
    const baseData = { week }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 25) + 15
      baseData[category.key] = baseValue
      baseData[`${category.key}_weekday`] = Math.floor(baseValue * 0.7)
      baseData[`${category.key}_weekend`] = Math.floor(baseValue * 0.3)
    })
    return baseData
  })

  return { monthlyData, weeklyData }
}

export default function ConsumptionAnalyticsChart() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [chartType, setChartType] = useState<"bar" | "line" | "area" | "pie">("bar")
  const [showWeekendData, setShowWeekendData] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.slice(0, 6).map((c) => c.key))

  const { monthlyData, weeklyData } = useMemo(() => generateConsumptionData(), [])

  const chartData = selectedMonth === "all" ? monthlyData : weeklyData
  const xAxisKey = selectedMonth === "all" ? "month" : "week"

  const filteredData = chartData.map((item) => {
    const filtered = { [xAxisKey]: item[xAxisKey] }
    selectedCategories.forEach((category) => {
      const suffix = showWeekendData ? "_weekend" : "_weekday"
      filtered[category] = item[`${category}${suffix}`] || item[category]
    })
    return filtered
  })

  const totalConsumption = filteredData.reduce((sum, item) => {
    return sum + selectedCategories.reduce((catSum, cat) => catSum + (item[cat] || 0), 0)
  }, 0)

  const averageConsumption = Math.floor(totalConsumption / filteredData.length)

  // Prepare pie chart data
  const pieData = selectedCategories
    .map((categoryKey) => {
      const category = categories.find((c) => c.key === categoryKey)
      const total = filteredData.reduce((sum, item) => sum + (item[categoryKey] || 0), 0)
      return {
        name: category?.label || categoryKey,
        value: total,
        color: category?.color || "#8884d8",
        icon: category?.icon || "📊",
      }
    })
    .sort((a, b) => b.value - a.value)

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((c) => c !== categoryKey) : [...prev, categoryKey],
    )
  }

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "pie":
        return (
          <PieChart width={500} height={400}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-medium">
                        {data.icon} {data.name}
                      </p>
                      <p className="text-sm text-gray-500">Total: {data.value.toLocaleString()} units</p>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        )
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCategories.map((category) => {
              const cat = categories.find((c) => c.key === category)
              return (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={cat?.color}
                  strokeWidth={2}
                  name={cat?.label}
                />
              )
            })}
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCategories.map((category) => {
              const cat = categories.find((c) => c.key === category)
              return (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={cat?.color}
                  fill={cat?.color}
                  fillOpacity={0.6}
                  name={cat?.label}
                />
              )
            })}
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCategories.map((category) => {
              const cat = categories.find((c) => c.key === category)
              return <Bar key={category} dataKey={category} fill={cat?.color} name={cat?.label} />
            })}
          </BarChart>
        )
    }
  }

  return (
    <div className="w-full space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-2">Annual Consumption Analytics</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Comprehensive analysis of product and service consumption patterns across different categories throughout the
          year.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Consumption</p>
                <p className="text-2xl font-bold">{totalConsumption.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Average per Period</p>
                <p className="text-2xl font-bold">{averageConsumption.toLocaleString()}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">Active Categories</p>
                <p className="text-2xl font-bold">{selectedCategories.length}</p>
              </div>
              <Filter className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Consumption Visualization</CardTitle>
          <CardDescription>Interactive chart showing consumption patterns across categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Label htmlFor="chart-type">Chart Type:</Label>
              <div className="flex gap-1">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Bar
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon className="h-4 w-4 mr-1" />
                  Line
                </Button>
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("area")}
                >
                  <AreaChartIcon className="h-4 w-4 mr-1" />
                  Area
                </Button>
                <Button
                  variant={chartType === "pie" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("pie")}
                >
                  <PieChartIcon className="h-4 w-4 mr-1" />
                  Pie
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Label htmlFor="time-period">Time Period:</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Full Year</SelectItem>
                  <SelectItem value="month">Weekly View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="weekend-mode" checked={showWeekendData} onCheckedChange={setShowWeekendData} />
              <Label htmlFor="weekend-mode">{showWeekendData ? "Weekend" : "Weekday"} Consumption</Label>
            </div>
          </div>

          {/* Category Filters */}
          <div className="mb-4">
            <Label className="mb-2 block">Filter Categories:</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.key}
                  variant={selectedCategories.includes(category.key) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleCategory(category.key)}
                >
                  {category.icon} {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[500px] w-full bg-white p-4 rounded-lg border">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Key Insights:</h3>
            <ul className="space-y-1 text-gray-600">
              <li>• Tourism & Adventures show peak consumption during summer months and holidays</li>
              <li>• Retail products experience significant spikes during November-December shopping seasons</li>
              <li>• Construction materials consumption is highest during warmer months (April-September)</li>
              <li>• Weekend consumption patterns vary significantly across different product categories</li>
              <li>• Financial products show quarterly consumption peaks aligned with business cycles</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
