'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Upload, MessageSquare, FileText, Eye } from 'lucide-react'
import { Collection, Document, ChatMessage } from '@/types'
import { DocumentList } from '@/components/documents/DocumentList'
import { DocumentPreview } from '@/components/documents/DocumentPreview'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { UploadDialog } from '@/components/documents/UploadDialog'
import { Button } from '@/components/ui/button'
import { LLMSelector } from '@/components/llm/LLMSelector'
import { useParams } from 'next/navigation'



export default function CollectionDetailPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [collection, setCollection] = useState<Collection | null>(null)
    const [documents, setDocuments] = useState<Document[]>([])
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isPreviewOpen, setIsPreviewOpen] = useState(false)

    const params = useParams<{ id: string }>()


    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            router.push('/auth/signin')
            return
        }
        fetchCollection()
    }, [params.id, session, status, router])

    const fetchCollection = async () => {
        try {
            const response = await fetch(`/api/collections/${params.id}`)
            if (response.ok) {
                const data = await response.json()
                setCollection(data)
                setDocuments(data.documents || [])
                setMessages(data.chatSessions[0]?.messages || [])
            }
        } catch (error) {
            console.error('Error fetching collection:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDocumentUpload = async (file: File, text?: string) => {
        try {
            const formData = new FormData()
            if (file) {
                formData.append('file', file)
            }
            if (text) {
                formData.append('text', text)
                formData.append('name', 'Text Document')
            }

            const response = await fetch(`/api/collections/${params.id}/documents`, {
                method: 'POST',
                body: formData,
            })

            if (response.ok) {
                await fetchCollection()
                setIsUploadDialogOpen(false)
            }
        } catch (error) {
            console.error('Error uploading document:', error)
        }
    }

    const handleSendMessage = async (message: string) => {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: message,
            createdAt: new Date(),
        }

        setMessages(prev => [...prev, userMessage])

        try {
            const response = await fetch(`/api/collections/${params.id}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
            })

            if (response.ok) {
                const data = await response.json()
                const assistantMessage: ChatMessage = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: data.response,
                    sources: data.sources,
                    createdAt: new Date(),
                }
                setMessages(prev => [...prev, assistantMessage])
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
    }

    if (status === 'loading' || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!collection) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Collection not found</h2>
                    <Button onClick={() => router.push('/collections')}>
                        Back to Collections
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/collections')}
                                className="text-slate-600 hover:text-slate-900"
                            >
                                ← Back
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{collection.name}</h1>
                                {collection.description && (
                                    <p className="text-sm text-slate-600">{collection.description}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LLMSelector />
                            <Button
                                onClick={() => setIsUploadDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Document
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Left Sidebar - Documents */}
                <div className="w-1/3 bg-white min-h-[calc(100vh-4rem)] border-r border-b border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="font-semibold text-lg text-slate-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2" />
                            Documents ({documents.length})
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <DocumentList
                            documents={documents}
                            selectedDocument={selectedDocument}
                            onSelectDocument={setSelectedDocument}
                            onPreviewDocument={(doc) => {
                                setSelectedDocument(doc)
                                setIsPreviewOpen(true)
                            }}
                        />
                    </div>
                </div>

                {/* Right Side - Chat */}
                <div className="flex-1 flex flex-col">
                    <div className="p-4 bg-white border-b border-slate-200">
                        <h2 className="font-semibold text-lg text-slate-900 flex items-center">
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Chat with Documents
                        </h2>
                    </div>

                    <div className="flex-1">
                        <ChatInterface
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            documents={documents}
                        />
                    </div>
                </div>
            </div>

            {/* Dialogs */}
            <UploadDialog
                isOpen={isUploadDialogOpen}
                onClose={() => setIsUploadDialogOpen(false)}
                onUpload={handleDocumentUpload}
            />

            <DocumentPreview
                document={selectedDocument}
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
            />
        </div>
    )
}