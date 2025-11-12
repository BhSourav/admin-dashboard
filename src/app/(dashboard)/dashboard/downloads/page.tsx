"use client"

/**
 * Download Reports Page
 * 
 * Allows users to generate and download various financial reports
 * in different formats (CSV, PDF, Excel).
 */

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react'

interface ReportConfig {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  formats: string[]
  color: string
}

/**
 * Available report types
 */
const reportTypes: ReportConfig[] = [
  {
    id: 'income',
    title: 'Income Report',
    description: 'Detailed income breakdown by source and date',
    icon: <TrendingUp className="h-5 w-5" />,
    formats: ['CSV', 'PDF', 'Excel'],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'expenses',
    title: 'Expense Report',
    description: 'Complete expense analysis by category',
    icon: <TrendingDown className="h-5 w-5" />,
    formats: ['CSV', 'PDF', 'Excel'],
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'monthly',
    title: 'Monthly Summary',
    description: 'Month-by-month financial overview',
    icon: <Calendar className="h-5 w-5" />,
    formats: ['PDF', 'Excel'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'tax',
    title: 'Tax Report',
    description: 'Tax-ready financial statement',
    icon: <FileText className="h-5 w-5" />,
    formats: ['PDF', 'CSV'],
    color: 'from-orange-500 to-amber-600'
  }
]

export default function DownloadsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  })

  /**
   * Generate and download report
   * In production, this would call Supabase Edge Functions or API routes
   */
  const downloadReport = async (reportId: string, format: string) => {
    setDownloading(`${reportId}-${format}`)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In production, you would:
      // 1. Call a Supabase Edge Function or API route
      // 2. Pass the report type, format, and date range
      // 3. Receive the generated file as a blob
      // 4. Trigger download using the blob

      console.log(`Downloading ${reportId} report in ${format} format`)
      console.log(`Date range: ${dateRange.from} to ${dateRange.to}`)

      // For now, show a success message
      alert(`${format} report generated successfully! (This is a demo)`)
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to generate report')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl shadow-lg">
            <Download className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Download Reports</h1>
            <p className="text-gray-600 dark:text-gray-400">Export your financial data</p>
          </div>
        </div>

        {/* Date Range Selector */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Date Range</CardTitle>
            <CardDescription>Select the period for your reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date-from">From</Label>
                <input
                  id="date-from"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date-to">To</Label>
                <input
                  id="date-to"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Report Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-start space-x-3">
                  <div className={`p-3 bg-gradient-to-br ${report.color} rounded-xl`}>
                    <div className="text-white">{report.icon}</div>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {report.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Available formats:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {report.formats.map((format) => (
                      <Button
                        key={format}
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report.id, format)}
                        disabled={downloading !== null}
                        className="flex-1 min-w-[80px]"
                      >
                        {downloading === `${report.id}-${format}` ? (
                          <>
                            <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            {format === 'CSV' && <FileSpreadsheet className="h-3 w-3 mr-2" />}
                            {format === 'PDF' && <FileText className="h-3 w-3 mr-2" />}
                            {format === 'Excel' && <FileSpreadsheet className="h-3 w-3 mr-2" />}
                            {format}
                          </>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Downloads */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Downloads</CardTitle>
            <CardDescription>Your previously generated reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Income Report - November 2025', format: 'PDF', date: '2025-11-10', size: '1.2 MB' },
                { name: 'Expense Analysis - Q4 2025', format: 'Excel', date: '2025-11-05', size: '856 KB' },
                { name: 'Monthly Summary - October', format: 'CSV', date: '2025-11-01', size: '245 KB' },
              ].map((download, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {download.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {download.format} • {download.size} • {download.date}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-6">
            <p className="text-sm text-amber-900 dark:text-amber-300">
              <strong>Implementation Note:</strong> Report generation will be implemented using Supabase Edge Functions
              or API routes. The system will query your financial data, format it according to the selected export type,
              and generate downloadable files with proper formatting and calculations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
