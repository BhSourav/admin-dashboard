"use client"

/**
 * Main Dashboard Page
 * 
 * Displays financial overview with expense/income summaries,
 * recent transactions, and quick stats.
 */

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingDown, TrendingUp, Wallet, Calendar, DollarSign, Plus } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { supabase, TransactionType } from '@/lib/supabase/client'

interface Transaction {
  TransactionID: string
  Amount: number
  TransactionDate: string
  Type: {
    Name: string
    Category: {
      Name: string
      Type: TransactionType
    }
  }
}

export default function DashboardPage() {
  const { user, privileges } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    thisMonth: 0
  })

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    try {
      // Get Person record for current user
      const { data: person } = await supabase
        .from('Person')
        .select('PersonID')
        .eq('Name', user?.email)
        .single()

      if (!person) {
        setLoading(false)
        return
      }

      // Fetch transactions with Type and Category joins
      const { data, error } = await supabase
        .from('Transaction')
        .select(`
          TransactionID,
          Amount,
          TransactionDate,
          Type:TransID (
            Name,
            Category (
              Name,
              Type
            )
          )
        `)
        .eq('PersonID', person.PersonID)
        .order('TransactionDate', { ascending: false })
        .limit(10)

      if (error) throw error

      const txns = (data as any[]) || []
      setTransactions(txns)

      // Calculate stats
      const income = txns
        .filter((t: any) => t.Type?.Category?.Type === 'INCOME')
        .reduce((sum: number, t: any) => sum + t.Amount, 0)
      
      const expenses = txns
        .filter((t: any) => t.Type?.Category?.Type === 'EXPENSE')
        .reduce((sum: number, t: any) => sum + t.Amount, 0)

      const thisMonthStart = new Date()
      thisMonthStart.setDate(1)
      const thisMonthTxns = txns.filter((t: any) => 
        new Date(t.TransactionDate) >= thisMonthStart
      )
      const thisMonthNet = thisMonthTxns.reduce((sum: number, t: any) => {
        const amount = t.Amount
        return t.Type?.Category?.Type === 'INCOME' ? sum + amount : sum - amount
      }, 0)

      setStats({
        totalIncome: income,
        totalExpenses: expenses,
        netBalance: income - expenses,
        thisMonth: thisMonthNet
      })
    } catch (error) {
      console.error('Error fetching transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const financialStats = [
    {
      title: 'Total Income',
      value: `$${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'This period',
      trend: 'up',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Total Expenses',
      value: `$${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: 'This period',
      trend: 'down',
      icon: <TrendingDown className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Net Balance',
      value: `$${stats.netBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: stats.netBalance >= 0 ? 'Profit' : 'Loss',
      trend: stats.netBalance >= 0 ? 'up' : 'down',
      icon: <Wallet className="h-5 w-5" />,
      color: stats.netBalance >= 0 ? 'text-blue-600' : 'text-red-600',
      bgColor: stats.netBalance >= 0 ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'This Month',
      value: `$${Math.abs(stats.thisMonth).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      change: stats.thisMonth >= 0 ? 'Saved' : 'Overspent',
      trend: 'neutral',
      icon: <Calendar className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
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
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading transactions...</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No transactions yet. Start by adding income or expenses!</p>
                </div>
              ) : (
                transactions.map((transaction) => {
                  const isIncome = transaction.Type?.Category?.Type === 'INCOME'
                  return (
                    <div
                      key={transaction.TransactionID}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`p-2 rounded-lg ${
                            isIncome
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : 'bg-red-100 dark:bg-red-900/30'
                          }`}
                        >
                          {isIncome ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.Type?.Name || 'Unknown'}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.Type?.Category?.Name} • {new Date(transaction.TransactionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-lg font-semibold ${
                          isIncome ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isIncome ? '+' : '-'}${transaction.Amount.toFixed(2)}
                      </p>
                    </div>
                  )
                })
              )}
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
