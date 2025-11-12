"use client"

/**
 * Bills Upload Page
 * 
 * Allows users to upload bill receipts and documents.
 * Supports drag-and-drop and file browser selection.
 */

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/auth-context'
import { Upload, File, X, CheckCircle2, Loader2, Image as ImageIcon } from 'lucide-react'

interface UploadedFile {
  file: File
  preview?: string
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function BillsPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  /**
   * Handle file drop
   */
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploading: false,
      uploaded: false,
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5242880, // 5MB
  })

  /**
   * Remove file from list
   */
  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev]
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!)
      }
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  /**
   * Upload files to Supabase Storage
   */
  const uploadFiles = async () => {
    if (!user || files.length === 0) return

    setUploading(true)

    for (let i = 0; i < files.length; i++) {
      if (files[i].uploaded) continue

      // Update uploading status
      setFiles(prev => {
        const newFiles = [...prev]
        newFiles[i] = { ...newFiles[i], uploading: true }
        return newFiles
      })

      try {
        const file = files[i].file
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('bills')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        // Mark as uploaded
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { ...newFiles[i], uploading: false, uploaded: true }
          return newFiles
        })
      } catch (error: any) {
        console.error('Upload error:', error)
        setFiles(prev => {
          const newFiles = [...prev]
          newFiles[i] = { 
            ...newFiles[i], 
            uploading: false, 
            error: error.message || 'Upload failed' 
          }
          return newFiles
        })
      }
    }

    setUploading(false)
  }

  /**
   * Clear all uploaded files
   */
  const clearFiles = () => {
    files.forEach(f => {
      if (f.preview) URL.revokeObjectURL(f.preview)
    })
    setFiles([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
            <Upload className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Bills</h1>
            <p className="text-gray-600 dark:text-gray-400">Upload receipts and bill documents</p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Drop Files Here</CardTitle>
            <CardDescription>
              Supported formats: PNG, JPG, PDF (max 5MB per file)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                ${isDragActive 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                  : 'border-gray-300 dark:border-gray-700 hover:border-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <Upload className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    or click to browse from your computer
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Files ({files.length})</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={uploadFiles}
                    disabled={uploading || files.every(f => f.uploaded)}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload All
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFiles}
                    disabled={uploading}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((fileItem, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    {/* Preview */}
                    <div className="flex-shrink-0">
                      {fileItem.preview ? (
                        <img
                          src={fileItem.preview}
                          alt={fileItem.file.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <File className="h-6 w-6 text-gray-500" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(fileItem.file.size / 1024).toFixed(2)} KB
                      </p>
                      {fileItem.error && (
                        <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {fileItem.uploading && (
                        <Loader2 className="h-5 w-5 text-purple-600 animate-spin" />
                      )}
                      {fileItem.uploaded && (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      )}
                      {!fileItem.uploading && !fileItem.uploaded && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-0 shadow-lg bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-6">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Note:</strong> To use the upload functionality, you need to create a storage bucket named 'bills' 
              in your Supabase project and configure the appropriate access policies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
