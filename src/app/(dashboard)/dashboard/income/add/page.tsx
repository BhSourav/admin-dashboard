"use client"

/**
 * Add Income Page
 * 
 * Form for users to add new income entries.
 * Uses the Transaction table with Type/Category hierarchy.
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { supabase, TransactionType } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { TrendingUp, Loader2, CheckCircle2 } from 'lucide-react'

interface IncomeType {
  TypeID: string
  Name: string
  CategoryID: string
  Category: {
    Name: string
    Type: TransactionType
  }
}

export default function AddIncomePage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    amount: '',
    typeId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  })
  
  const [incomeTypes, setIncomeTypes] = useState<IncomeType[]>([])
  const [personId, setPersonId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  /**
   * Fetch income types from database on mount
   */
  useEffect(() => {
    fetchIncomeTypes()
    fetchOrCreatePerson()
  }, [user])

  /**
   * Fetch or create Person record for the current user
   */
  const fetchOrCreatePerson = async () => {
    if (!user) return

    try {
      let { data: person, error: fetchError } = await supabase
        .from('Person')
        .select('PersonID')
        .eq('Name', user.email)
        .single()

      if (fetchError || !person) {
        const { data: newPerson, error: createError } = await supabase
          .from('Person')
          .insert({
            Name: user.email || 'Unknown User'
          })
          .select('PersonID')
          .single()

        if (createError) {
          console.error('Error creating person:', createError)
          return
        }
        setPersonId(newPerson?.PersonID)
      } else {
        setPersonId(person.PersonID)
      }
    } catch (error) {
      console.error('Error managing person:', error)
    }
  }

  /**
   * Fetch income types (Types with Category.Type = 'INCOME')
   */
  const fetchIncomeTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('Type')
        .select(`
          TypeID,
          Name,
          CategoryID,
          Category!inner (
            Name,
            Type
          )
        `)
        .eq('Category.Type', 'INCOME')
        .order('Name')

      if (error) throw error
      setIncomeTypes((data as any[]) || [])
    } catch (error) {
      console.error('Error fetching income types:', error)
      setError('Failed to load income sources')
    } finally {
      setLoadingTypes(false)
    }
  }

  /**
   * Handle form input changes
   */
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  /**
   * Submit income to Supabase
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !personId) {
      setError('You must be logged in to add income')
      return
    }

    // Validate form
    if (!formData.amount || !formData.typeId || !formData.date) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Insert transaction into Supabase
      const { error: insertError } = await supabase
        .from('Transaction')
        .insert({
          TransID: formData.typeId, // TypeID goes in TransID field
          PersonID: personId,
          Amount: parseFloat(formData.amount),
          TransactionDate: formData.date,
        })

      if (insertError) throw insertError

      // Show success message
      setSuccess(true)
      
      // Reset form after 2 seconds and navigate
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      
    } catch (err: any) {
      console.error('Error adding income:', err)
      setError(err.message || 'Failed to add income')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add Income</h1>
            <p className="text-gray-600 dark:text-gray-400">Record your earnings</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-0 shadow-xl">
          {success ? (
            <CardContent className="p-12 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Income Added Successfully!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Redirecting to dashboard...
              </p>
            </CardContent>
          ) : (
            <>
              <CardHeader>
                <CardTitle>Income Details</CardTitle>
                <CardDescription>
                  Enter the details of your income below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleChange('amount', e.target.value)}
                        className="pl-8 h-12"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Type/Source Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="typeId">Income Source *</Label>
                    <select
                      id="typeId"
                      value={formData.typeId}
                      onChange={(e) => handleChange('typeId', e.target.value)}
                      className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      required
                      disabled={loading || loadingTypes}
                    >
                      <option value="">Select a source</option>
                      {loadingTypes ? (
                        <option disabled>Loading sources...</option>
                      ) : (
                        incomeTypes.map((type) => (
                          <option key={type.TypeID} value={type.TypeID}>
                            {type.Category?.Name} - {type.Name}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="h-12"
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add any additional notes..."
                      value={formData.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="min-h-[100px]"
                      disabled={loading}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="mr-2 h-4 w-4" />
                          Add Income
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      disabled={loading}
                      className="h-12 px-8"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
