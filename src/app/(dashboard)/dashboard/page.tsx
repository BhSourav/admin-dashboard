"use client"

/**
 * Main Dashboard Page
 * 
 * Displays financial overview with expense/income summaries,
 * recent transactions, and quick stats.
 */

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingDown, TrendingUp, Wallet, Calendar, DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'

export default function DashboardPage() {
  const { user, privileges } = useAuth()

  /**
   * Sample data - In production, this would come from Supabase
   * These will be replaced with real data from your Supabase database
   */
  const financialStats = [
    {
      title: 'Total Income',
      value: '$12,453.00',
      change: '+12.5%',
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: '$8,234.50',
      change: '+8.2%',
      trend: 'down',
      icon: <TrendingDown className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Net Balance',
      value: '$4,218.50',
      change: '+23.1%',
      trend: 'up',
      icon: <Wallet className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'This Month',
      value: '$2,150.00',
      change: 'Saved',
      trend: 'neutral',
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  /**
   * Sample recent transactions
   */
  const recentTransactions = [
    { id: 1, type: 'expense', description: 'Grocery Shopping', amount: 156.50, date: '2025-11-11', category: 'Food' },
    { id: 2, type: 'income', description: 'Salary', amount: 5000.00, date: '2025-11-10', category: 'Salary' },
    { id: 3, type: 'expense', description: 'Electric Bill', amount: 89.30, date: '2025-11-09', category: 'Utilities' },
    { id: 4, type: 'expense', description: 'Gas Station', amount: 45.00, date: '2025-11-08', category: 'Transport' },
    { id: 5, type: 'income', description: 'Freelance Project', amount: 1200.00, date: '2025-11-07', category: 'Freelance' },
  ]

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's your financial overview for today
            </p>
          </div>
          <div className="flex space-x-3">
            {privileges?.can_add_expense && (
              <Link href="/dashboard/expenses/add">
                <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </Link>
            )}
            {privileges?.can_add_income && (
              <Link href="/dashboard/income/add">
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Add Income
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Financial Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {financialStats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {stat.value}
                  </h3>
                  <p className={`text-sm mt-1 ${stat.trend === 'up' ? 'text-green-600' : stat.trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                    {stat.change} from last month
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold">Recent Transactions</CardTitle>
              {privileges?.can_view_reports && (
                <Link href="/dashboard/reports">
                  <Button variant="outline" size="sm">
                    View All Reports
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`p-2 rounded-lg ${
                        transaction.type === 'income'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-5 w-5 text-green-600" />
                      ) : (
                        <TrendingDown className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {transaction.category} • {transaction.date}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-semibold ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {privileges?.can_view_reports && (
                <Link href="/dashboard/reports">
                  <Button variant="outline" className="w-full h-20 text-left justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <DollarSign className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold">View Analytics</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Charts & insights</p>
                      </div>
                    </div>
                  </Button>
                </Link>
              )}
              {privileges?.can_upload_bills && (
                <Link href="/dashboard/bills">
                  <Button variant="outline" className="w-full h-20 text-left justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Plus className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Upload Bills</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Add receipts</p>
                      </div>
                    </div>
                  </Button>
                </Link>
              )}
              {privileges?.can_download_reports && (
                <Link href="/dashboard/downloads">
                  <Button variant="outline" className="w-full h-20 text-left justify-start">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">Download Reports</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Export data</p>
                      </div>
                    </div>
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
