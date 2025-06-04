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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Calendar,
  BarChart3,
  LineChartIcon,
  AreaChartIcon,
  PieChartIcon,
  Activity,
  Target,
  Zap,
  Eye,
  Filter,
  Sparkles,
} from "lucide-react"

// Enhanced category definitions with better colors and icons
const categories = [
  {
    key: "agriculture",
    label: "Agriculture Products & Services",
    color: "#10B981",
    lightColor: "#D1FAE5",
    icon: "🌾",
    description: "Farm products, seeds, equipment",
  },
  {
    key: "hospitality",
    label: "Hospitality",
    color: "#F59E0B",
    lightColor: "#FEF3C7",
    icon: "🏨",
    description: "Hotels, restaurants, catering",
  },
  {
    key: "tourism",
    label: "Tourism & Adventures",
    color: "#3B82F6",
    lightColor: "#DBEAFE",
    icon: "✈️",
    description: "Travel, tours, adventure activities",
  },
  {
    key: "insurance",
    label: "Insurance",
    color: "#8B5CF6",
    lightColor: "#EDE9FE",
    icon: "🛡️",
    description: "Life, health, property insurance",
  },
  {
    key: "drinks",
    label: "Drinks",
    color: "#EF4444",
    lightColor: "#FEE2E2",
    icon: "🥤",
    description: "Beverages, alcohol, soft drinks",
  },
  {
    key: "retail",
    label: "Retail Products",
    color: "#06B6D4",
    lightColor: "#CFFAFE",
    icon: "🛍️",
    description: "Clothing, electronics, general goods",
  },
  {
    key: "construction",
    label: "Construction & Materials",
    color: "#84CC16",
    lightColor: "#ECFCCB",
    icon: "🏗️",
    description: "Building materials, tools, equipment",
  },
  {
    key: "financial",
    label: "Financial Products",
    color: "#F97316",
    lightColor: "#FED7AA",
    icon: "💰",
    description: "Banking, loans, investments",
  },
  {
    key: "entertainment",
    label: "Entertainment",
    color: "#EC4899",
    lightColor: "#FCE7F3",
    icon: "🎬",
    description: "Movies, games, events, shows",
  },
  {
    key: "beauty",
    label: "Beauty Products & Services",
    color: "#A855F7",
    lightColor: "#F3E8FF",
    icon: "💄",
    description: "Cosmetics, skincare, salon services",
  },
  {
    key: "furniture",
    label: "Furniture & Other Products",
    color: "#059669",
    lightColor: "#D1FAE5",
    icon: "🪑",
    description: "Home furniture, decor, appliances",
  },
]

// Generate more realistic and varied consumption data
const generateConsumptionData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"]

  // Enhanced seasonal patterns with more realistic variations
  const monthlyData = months.map((month, index) => {
    const seasonalMultiplier = {
      agriculture: index < 3 || index > 8 ? 1.4 + Math.random() * 0.3 : 0.7 + Math.random() * 0.2,
      hospitality: [5, 6, 7, 11].includes(index) ? 1.6 + Math.random() * 0.4 : 0.9 + Math.random() * 0.2,
      tourism: [5, 6, 7, 11].includes(index) ? 1.9 + Math.random() * 0.3 : 0.6 + Math.random() * 0.2,
      insurance: [0, 11].includes(index) ? 1.5 + Math.random() * 0.2 : 0.9 + Math.random() * 0.1,
      drinks: [5, 6, 7].includes(index) ? 1.7 + Math.random() * 0.3 : 0.9 + Math.random() * 0.2,
      retail: [10, 11].includes(index) ? 2.2 + Math.random() * 0.3 : 0.8 + Math.random() * 0.2,
      construction: [3, 4, 5, 6, 7, 8].includes(index) ? 1.5 + Math.random() * 0.3 : 0.5 + Math.random() * 0.2,
      financial: [0, 3, 6, 9].includes(index) ? 1.4 + Math.random() * 0.2 : 0.9 + Math.random() * 0.1,
      entertainment: [5, 6, 7, 11].includes(index) ? 1.5 + Math.random() * 0.3 : 0.9 + Math.random() * 0.2,
      beauty: [4, 5, 10, 11].includes(index) ? 1.4 + Math.random() * 0.2 : 0.9 + Math.random() * 0.1,
      furniture: [2, 3, 8, 9].includes(index) ? 1.3 + Math.random() * 0.2 : 0.8 + Math.random() * 0.1,
    }

    const baseData: any = { month }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 60) + 40
      baseData[category.key] = Math.floor(
        baseValue * seasonalMultiplier[category.key as keyof typeof seasonalMultiplier],
      )

      // More realistic weekday/weekend split
      const weekendRatio = ["drinks", "entertainment", "tourism", "beauty"].includes(category.key) ? 0.45 : 0.25
      baseData[`${category.key}_weekday`] = Math.floor(baseData[category.key] * (1 - weekendRatio))
      baseData[`${category.key}_weekend`] = Math.floor(baseData[category.key] * weekendRatio)
    })

    return baseData
  })

  // Enhanced weekly data
  const weeklyData = weeks.map((week, weekIndex) => {
    const baseData: any = { week }
    categories.forEach((category) => {
      const baseValue = Math.floor(Math.random() * 25) + 15
      const weekendMultiplier = weekIndex === 0 || weekIndex === 3 ? 1.3 : 1.0
      baseData[category.key] = Math.floor(baseValue * weekendMultiplier)

      const weekendRatio = ["drinks", "entertainment", "tourism", "beauty"].includes(category.key) ? 0.4 : 0.3
      baseData[`${category.key}_weekday`] = Math.floor(baseData[category.key] * (1 - weekendRatio))
      baseData[`${category.key}_weekend`] = Math.floor(baseData[category.key] * weekendRatio)
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
  const [activeTab, setActiveTab] = useState("overview")

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
  const peakPeriod = filteredData.reduce(
    (max, item) => {
      const total = selectedCategories.reduce((sum, cat) => sum + (item[cat] || 0), 0)
      return total > max.total ? { period: item[xAxisKey], total } : max
    },
    { period: "", total: 0 },
  )

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
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  return (
                    <div className="bg-white p-3 border rounded-lg shadow-lg">
                      <p className="font-medium">
                        {data.icon} {data.name}
                      </p>
                      <p className="text-sm text-muted-foreground">Total: {data.value.toLocaleString()} units</p>
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
            <defs>
              {selectedCategories.map((category, index) => (
                <linearGradient key={category} id={`gradient-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[category]?.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[category]?.color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={chartConfig[category]?.color}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2 }}
                activeDot={{ r: 7, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        )
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              {selectedCategories.map((category) => (
                <linearGradient key={category} id={`area-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[category]?.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig[category]?.color} stopOpacity={0.2} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Area
                key={category}
                type="monotone"
                dataKey={category}
                stackId="1"
                stroke={chartConfig[category]?.color}
                fill={`url(#area-${category})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        )
      default:
        return (
          <BarChart {...commonProps}>
            <defs>
              {selectedCategories.map((category) => (
                <linearGradient key={category} id={`bar-${category}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig[category]?.color} stopOpacity={0.9} />
                  <stop offset="95%" stopColor={chartConfig[category]?.color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <YAxis tick={{ fontSize: 12 }} axisLine={{ stroke: "#e0e0e0" }} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            {selectedCategories.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                fill={`url(#bar-${category})`}
                radius={[4, 4, 0, 0]}
                stroke={chartConfig[category]?.color}
                strokeWidth={1}
              />
            ))}
          </BarChart>
        )
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">Analytics Dashboard</span>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Annual Consumption Analytics
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive analysis of product and service consumption patterns across different categories, revealing
          seasonal trends and behavioral insights throughout the year.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Consumption</p>
                    <p className="text-2xl font-bold text-blue-900">{totalConsumption.toLocaleString()}</p>
                    <p className="text-xs text-blue-600 mt-1">units consumed</p>
                  </div>
                  <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Average per Period</p>
                    <p className="text-2xl font-bold text-green-900">{averageConsumption.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">avg consumption</p>
                  </div>
                  <div className="h-12 w-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Peak Period</p>
                    <p className="text-2xl font-bold text-purple-900">{peakPeriod.period}</p>
                    <p className="text-xs text-purple-600 mt-1">{peakPeriod.total.toLocaleString()} units</p>
                  </div>
                  <div className="h-12 w-12 bg-purple-500 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-600">Active Categories</p>
                    <p className="text-2xl font-bold text-orange-900">{selectedCategories.length}</p>
                    <p className="text-xs text-orange-600 mt-1">of {categories.length} total</p>
                  </div>
                  <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center">
                    <Filter className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Consumption Visualization
                  </CardTitle>
                  <CardDescription>
                    Interactive charts showing consumption patterns across different time periods and categories
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enhanced Controls */}
              <div className="flex flex-wrap gap-4 p-4 bg-white/50 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="chart-type" className="text-sm font-medium">
                    Chart Type:
                  </Label>
                  <div className="flex gap-1">
                    <Button
                      variant={chartType === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("bar")}
                      className="h-9"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "line" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("line")}
                      className="h-9"
                    >
                      <LineChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "area" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("area")}
                      className="h-9"
                    >
                      <AreaChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartType === "pie" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartType("pie")}
                      className="h-9"
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Label htmlFor="time-period" className="text-sm font-medium">
                    Time Period:
                  </Label>
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-40 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">📅 Full Year</SelectItem>
                      <SelectItem value="month">📊 Weekly View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="weekend-mode" checked={showWeekendData} onCheckedChange={setShowWeekendData} />
                  <Label htmlFor="weekend-mode" className="text-sm font-medium">
                    {showWeekendData ? "🎉 Weekend" : "💼 Weekday"} Consumption
                  </Label>
                </div>
              </div>

              {/* Enhanced Category Filters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Filter Categories:</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedCategories(categories.map((c) => c.key))}
                    >
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setSelectedCategories([])}>
                      Clear All
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div
                      key={category.key}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedCategories.includes(category.key)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                      onClick={() => toggleCategory(category.key)}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: category.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{category.icon}</span>
                            <p className="text-sm font-medium truncate">{category.label}</p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{category.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chart Container */}
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="h-[500px] w-full">
                  <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height="100%">
                      {renderChart()}
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Target className="h-5 w-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">🏖️</span>
                    <div>
                      <p className="font-medium text-blue-900">Seasonal Tourism Peak</p>
                      <p className="text-sm text-blue-700">
                        Tourism & Adventures show 90% higher consumption during summer months and holidays
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">🛍️</span>
                    <div>
                      <p className="font-medium text-blue-900">Holiday Shopping Surge</p>
                      <p className="text-sm text-blue-700">
                        Retail products experience 120% spike during November-December shopping seasons
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">🏗️</span>
                    <div>
                      <p className="font-medium text-blue-900">Construction Seasonality</p>
                      <p className="text-sm text-blue-700">
                        Construction materials peak 140% higher during warmer months (April-September)
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Activity className="h-5 w-5" />
                  Behavioral Patterns
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="font-medium text-green-900">Weekend Entertainment</p>
                      <p className="text-sm text-green-700">
                        Entertainment and drinks show 45% higher weekend consumption patterns
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="font-medium text-green-900">Weekday Business Services</p>
                      <p className="text-sm text-green-700">
                        Financial products and insurance peak during weekdays with business activity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                    <span className="text-2xl">📈</span>
                    <div>
                      <p className="font-medium text-green-900">Quarterly Cycles</p>
                      <p className="text-sm text-green-700">
                        Financial products show distinct quarterly peaks aligned with business reporting cycles
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Categories</CardTitle>
              <CardDescription>Categories with highest consumption in the selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pieData.slice(0, 5).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.value.toLocaleString()} units</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
