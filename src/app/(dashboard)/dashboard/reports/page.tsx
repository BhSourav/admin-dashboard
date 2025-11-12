"use client"

/**
 * Reports & Analytics Page
 * 
 * Displays comprehensive financial analytics with charts and graphs.
 * Shows expense breakdown, income trends, and comparative analysis.
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { BarChart2, TrendingUp, TrendingDown, DollarSign, Download } from 'lucide-react'

/**
 * Sample data for charts
 * In production, this will be fetched from Supabase
 */
const monthlyData = [
  { month: 'Jan', income: 4500, expenses: 3200 },
  { month: 'Feb', income: 5200, expenses: 3800 },
  { month: 'Mar', income: 4800, expenses: 3500 },
  { month: 'Apr', income: 5500, expenses: 4200 },
  { month: 'May', income: 6000, expenses: 4500 },
  { month: 'Jun', income: 5800, expenses: 4300 },
]

const expensesByCategory = [
  { name: 'Food & Dining', value: 1250, color: '#FF6384' },
  { name: 'Transportation', value: 850, color: '#36A2EB' },
  { name: 'Utilities', value: 450, color: '#FFCE56' },
  { name: 'Healthcare', value: 320, color: '#4BC0C0' },
  { name: 'Entertainment', value: 680, color: '#9966FF' },
  { name: 'Shopping', value: 940, color: '#FF9F40' },
  { name: 'Other', value: 310, color: '#C9CBCF' },
]

const incomeBySource = [
  { name: 'Salary', value: 5000, color: '#10B981' },
  { name: 'Freelance', value: 1200, color: '#3B82F6' },
  { name: 'Investment', value: 450, color: '#8B5CF6' },
  { name: 'Other', value: 150, color: '#6B7280' },
]

export default function ReportsPage() {
  const [timeRange, setTimeRange] = useState('6months')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
              <p className="text-gray-600 dark:text-gray-400">Visualize your financial data</p>
            </div>
          </div>
          
          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            <Button
              variant={timeRange === '1month' ? 'default' : 'outline'}
              onClick={() => setTimeRange('1month')}
              size="sm"
            >
              1M
            </Button>
            <Button
              variant={timeRange === '3months' ? 'default' : 'outline'}
              onClick={() => setTimeRange('3months')}
              size="sm"
            >
              3M
            </Button>
            <Button
              variant={timeRange === '6months' ? 'default' : 'outline'}
              onClick={() => setTimeRange('6months')}
              size="sm"
            >
              6M
            </Button>
            <Button
              variant={timeRange === '1year' ? 'default' : 'outline'}
              onClick={() => setTimeRange('1year')}
              size="sm"
            >
              1Y
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-green-600">$31,800</span>
                <span className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +12%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-red-600">$22,500</span>
                <span className="text-sm text-red-600 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  +8%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Net Savings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold text-blue-600">$9,300</span>
                <span className="text-sm text-blue-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +29%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Income vs Expenses Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Income vs Expenses Trend</CardTitle>
                <CardDescription>Monthly comparison over time</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  name="Income"
                  dot={{ fill: '#10B981', r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  name="Expenses"
                  dot={{ fill: '#EF4444', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>Breakdown of spending patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {expensesByCategory.map((item) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {item.name}
                    </span>
                    <span className="text-sm font-semibold ml-auto">
                      ${item.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Income by Source */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Income by Source</CardTitle>
              <CardDescription>Sources of your earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={incomeBySource}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="value" fill="#10B981" radius={[8, 8, 0, 0]}>
                    {incomeBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>

              {/* Summary */}
              <div className="mt-4 space-y-2">
                {incomeBySource.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold">
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Note about data */}
        <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Note:</strong> These charts display sample data. Once you connect your Supabase database
              and add real transactions, the charts will automatically populate with your actual financial data.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
