'use client'

import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {getDictionary} from "@/app/dict";

interface Props {
    isOpen: boolean
    onClose: () => void
    onUpload: (file?: File, text?: string, title?: string) => void
}

export function UploadDialog({ isOpen, onClose, onUpload }: Props) {
    const [uploadType, setUploadType] = useState<'file' | 'text'>('file')
    const [textContent, setTextContent] = useState('')
    const [textTitle, setTextTitle] = useState('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const dict = getDictionary('pl')

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'application/pdf': ['.pdf'],
            'text/plain': ['.txt'],
        },
        multiple: false,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setSelectedFile(acceptedFiles[0])
            }
        },
    })

    const handleSubmit = () => {
        if (uploadType === 'file' && selectedFile) {
            onUpload(selectedFile)
        } else if (uploadType === 'text' && textContent.trim()) {
            onUpload(undefined, textContent, textTitle)
        }

        // Reset form
        setSelectedFile(null)
        setTextContent('')
        setTextTitle('')
        setUploadType('file')
    }

    const handleClose = () => {
        setSelectedFile(null)
        setTextContent('')
        setTextTitle('')
        setUploadType('file')
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{dict.modals.upload_title}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Upload Type Selector */}
                    <div className="flex space-x-2">
                        <Button
                            variant={uploadType === 'file' ? 'default' : 'outline'}
                            onClick={() => setUploadType('file')}
                            className="flex-1"
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            {dict.modals.upload_file}
                        </Button>
                        <Button
                            variant={uploadType === 'text' ? 'default' : 'outline'}
                            onClick={() => setUploadType('text')}
                            className="flex-1"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            {dict.modals.add_text}
                        </Button>
                    </div>

                    {/* File Upload */}
                    {uploadType === 'file' && (
                        <div>
                            {!selectedFile ? (
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                                        isDragActive
                                            ? 'border-blue-400 bg-blue-50'
                                            : 'border-slate-300 hover:border-slate-400'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <Upload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                                    <p className="text-sm text-slate-600">
                                        {isDragActive
                                            ? dict.modals.drop_help
                                            : dict.modals.drag_and_drop_help }
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2">
                                        {dict.modals.supported_filetypes}
                                    </p>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-5 h-5 text-slate-600" />
                                        <span className="text-sm font-medium">{selectedFile.name}</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedFile(null)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Text Input */}
                    {uploadType === 'text' && (
                        <div className="space-y-3">
                            <div>
                                <label className="text-sm font-medium mb-1 block">{dict.modals.title_label}</label>
                                <Input
                                    placeholder="Document title"
                                    value={textTitle}
                                    onChange={(e) => setTextTitle(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">{dict.modals.content_label}</label>
                                <Textarea
                                    placeholder="Paste your text content here..."
                                    value={textContent}
                                    onChange={(e) => setTextContent(e.target.value)}
                                    rows={8}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            {dict.buttons.cancel}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                (uploadType === 'file' && !selectedFile) ||
                                (uploadType === 'text' && !textContent.trim())
                            }
                        >
                            {dict.modals.upload_button}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}