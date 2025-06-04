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
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { TrendingUp, Calendar, BarChart3, LineChartIcon, AreaChartIcon } from "lucide-react"

// Define consumption categories
const categories = [
  { key: "agriculture", label: "Agriculture Products & Services", color: "hsl(var(--chart-1))" },
  { key: "hospitality", label: "Hospitality", color: "hsl(var(--chart-2))" },
  { key: "tourism", label: "Tourism & Adventures", color: "hsl(var(--chart-3))" },
  { key: "insurance", label: "Insurance", color: "hsl(var(--chart-4))" },
  { key: "drinks", label: "Drinks", color: "hsl(var(--chart-5))" },
  { key: "retail", label: "Retail Products", color: "hsl(var(--chart-1))" },
  { key: "construction", label: "Construction & Materials", color: "hsl(var(--chart-2))" },
  { key: "financial", label: "Financial Products", color: "hsl(var(--chart-3))" },
  { key: "entertainment", label: "Entertainment", color: "hsl(var(--chart-4))" },
  { key: "beauty", label: "Beauty Products & Services", color: "hsl(var(--chart-5))" },
  { key: "furniture", label: "Furniture & Other Products", color: "hsl(var(--chart-1))" },
]

// Generate realistic consumption data
const generateConsumptionData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]

  // Monthly data with seasonal patterns
  const monthlyData = months.map((month, index) => {
    const seasonalMultiplier = {
      agriculture: index < 3 || index > 8 ? 1.3 : 0.8, // Higher in planting/harvest seasons
      hospitality: [5, 6, 7, 11].includes(index) ? 1.5 : 1.0, // Peak in summer and holidays
      tourism: [5, 6, 7, 11].includes(index) ? 1.8 : 0.7, // Peak in summer and December
      insurance: [0, 11].includes(index) ? 1.4 : 1.0, // Higher at year start/end
      drinks: [5, 6, 7].includes(index) ? 1.6 : 1.0, // Higher in summer
      retail: [10, 11].includes(index) ? 2.0 : 1.0, // Black Friday/Christmas spike
      construction: [3, 4, 5, 6, 7, 8].includes(index) ? 1.4 : 0.6, // Higher in warmer months
      financial: [0, 3, 6, 9].includes(index) ? 1.3 : 1.0, // Quarterly peaks
      entertainment: [5, 6, 7, 11].includes(index) ? 1.4 : 1.0, // Summer and holidays
      beauty: [4, 5, 10, 11].includes(index) ? 1.3 : 1.0, // Spring/summer and holidays
      furniture: [2, 3, 8, 9].includes(index) ? 1.2 : 1.0, // Spring and fall moving seasons
    }

    const baseData: any = { month }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 50) + 30
      baseData[category.key] = Math.floor(
        baseValue * seasonalMultiplier[category.key as keyof typeof seasonalMultiplier],
      )

      // Add weekday/weekend breakdown
      baseData[`${category.key}_weekday`] = Math.floor(baseData[category.key] * 0.7)
      baseData[`${category.key}_weekend`] = Math.floor(baseData[category.key] * 0.3)
    })

    return baseData
  })

  // Weekly data for detailed view
  const weeklyData = weeks.map((week, weekIndex) => {
    const baseData: any = { week }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 20) + 10
      const weekendMultiplier = weekIndex === 0 || weekIndex === 3 ? 1.2 : 1.0
      baseData[category.key] = Math.floor(baseValue * weekendMultiplier)
      baseData[`${category.key}_weekday`] = Math.floor(baseData[category.key] * 0.65)
      baseData[`${category.key}_weekend`] = Math.floor(baseData[category.key] * 0.35)
    })
    return baseData
  })

  return { monthlyData, weeklyData }
}

export default function ConsumptionAnalyticsChart() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [chartType, setChartType] = useState<"bar" | "line" | "area">("bar")
  const [showWeekendData, setShowWeekendData] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categories.map((c) => c.key))

  const { monthlyData, weeklyData } = useMemo(() => generateConsumptionData(), [])

  const chartData = selectedMonth === "all" ? monthlyData : weeklyData
  const xAxisKey = selectedMonth === "all" ? "month" : "week"

  const filteredData = chartData.map((item) => {
    const filtered: any = { [xAxisKey]: item[xAxisKey] }
    selectedCategories.forEach((category) => {
      const suffix = showWeekendData ? "_weekend" : "_weekday"
      filtered[category] = item[`${category}${suffix}`] || item[category]
    })
    return filtered
  })

  const chartConfig = categories.reduce((config, category) => {
    if (selectedCategories.includes(category.key)) {
      config[category.key] = {
        label: category.label,
        color: category.color,
      }
    }
    return config
  }, {} as any)

  const toggleCategory = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((c) => c !== categoryKey) : [...prev, categoryKey],
    )
  }

  const totalConsumption = filteredData.reduce((sum, item) => {
    return sum + selectedCategories.reduce((catSum, cat) => catSum + (item[cat] || 0), 0)
  }, 0)

  const averageConsumption = Math.floor(totalConsumption / filteredData.length)

  const renderChart = () => {
    const commonProps = {
      data: filteredData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    }

    switch (chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={chartConfig[category]?.color}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={chartConfig[category]?.color}
                fill={chartConfig[category]?.color}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Bar key={category} dataKey={category} fill={chartConfig[category]?.color} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        )
    }
  }

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Annual Consumption Analytics Dashboard
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of product and service consumption patterns across different categories, showing
            seasonal trends and weekday vs weekend consumption behaviors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Controls */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Label htmlFor="chart-type">Chart Type:</Label>
              <div className="flex gap-1">
                <Button
                  variant={chartType === "bar" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "line" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("line")}
                >
                  <LineChartIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant={chartType === "area" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setChartType("area")}
                >
                  <AreaChartIcon className="h-4 w-4" />
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

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Consumption</p>
                    <p className="text-2xl font-bold">{totalConsumption.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Average per Period</p>
                    <p className="text-2xl font-bold">{averageConsumption.toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Categories</p>
                    <p className="text-2xl font-bold">{selectedCategories.length}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Filters */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-2 block">Filter Categories:</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category.key}
                  variant={selectedCategories.includes(category.key) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => toggleCategory(category.key)}
                >
                  {category.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-[500px] w-full">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Insights */}
          <div className="mt-6 p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold mb-2">Key Insights:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
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
