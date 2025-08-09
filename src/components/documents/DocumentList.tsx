'use client'

import { useState } from 'react'
import { FileText, File, Eye, Trash2, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { Document } from '@/types'
import { Button } from '@/components/ui/button'

interface Props {
    documents: Document[]
    selectedDocument: Document | null
    onSelectDocument: (document: Document) => void
    onPreviewDocument: (document: Document) => void
    onDeleteDocument?: (document: Document) => void
}

export function DocumentList({
                                 documents,
                                 selectedDocument,
                                 onSelectDocument,
                                 onPreviewDocument,
                                 onDeleteDocument
                             }: Props) {
    const [hoveredDoc, setHoveredDoc] = useState<string | null>(null)

    if (documents.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <FileText className="w-16 h-16 mb-4" />
                <p className="text-sm">No documents uploaded yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-2 p-4">
            {documents.map((document, index) => (
                <motion.div
                    key={document.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                        selectedDocument?.id === document.id
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                    }`}
                    onClick={() => onSelectDocument(document)}
                    onMouseEnter={() => setHoveredDoc(document.id)}
                    onMouseLeave={() => setHoveredDoc(null)}
                >
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-md ${
                            document.type === 'pdf' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                            {document.type === 'pdf' ? (
                                <File className="w-4 h-4 text-red-600" />
                            ) : (
                                <FileText className="w-4 h-4 text-blue-600" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-slate-900 truncate">
                                {document.name}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-slate-500">
                                <Calendar className="w-3 h-3 mr-1" />
                                {new Date(document.createdAt).toLocaleDateString()}
                            </div>
                            <div className="mt-1 text-xs text-slate-400">
                                {document.content.length > 100
                                    ? `${document.content.substring(0, 100)}...`
                                    : document.content}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {hoveredDoc === document.id && (
                        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onPreviewDocument(document)
                                }}
                                className="h-6 w-6 p-0"
                            >
                                <Eye className="w-3 h-3" />
                            </Button>
                            {onDeleteDocument && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteDocument(document)
                                    }}
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            )}
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}