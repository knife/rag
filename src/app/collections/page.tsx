'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Plus, Folder, Calendar, FileText } from 'lucide-react'
import { motion } from 'framer-motion'
import { Collection } from '@/types'
import { Button } from '@/components/ui/button'
import { CreateCollectionDialog } from '@/components/collections/CreateCollectionDialog'
import { SettingsDialog } from '@/components/settings/SetttingsDialog'
import { LLMSelector } from '@/components/llm/LLMSelector'
import {useLLM} from "@/components/llm/LLMProvider";

export default function CollectionsPage() {
    const { data: session, status } = useSession()
    const { selectedProvider, selectedModel, setSelectedProvider, setSelectedModel, apiKeys, setApiKey } = useLLM()

    const router = useRouter()
    const [collections, setCollections] = useState<Collection[]>([])
    const [settings, setSettings] = useState<Record<string, any>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [isSetttngsDialogOpen, setIsSettingsDialogOpen] = useState(false)


    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            router.push('/auth/signin')
            return
        }
        fetchCollections()
    }, [session, status, router])

    useEffect(() => {
        fetchSettings()
    }, [session])


    const fetchCollections = async () => {
        try {
            const response = await fetch('/api/collections')
            if (response.ok) {
                const data = await response.json()
                setCollections(data)
            }
        } catch (error) {
            console.error('Error fetching collections:', error)
        } finally {
            setIsLoading(false)
        }
    }
    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/settings')
            if (response.ok) {
                const data = await response.json()
                console.log('hello', data);
                setSettings(data[0])
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

    const handleCreateCollection = async (name: string, description: string) => {
        try {
            const response = await fetch('/api/collections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description, llmProvider: selectedProvider }),

            })

            if (response.ok) {
                await fetchCollections()
                setIsCreateDialogOpen(false)
            }
        } catch (error) {
            console.error('Error creating collection:', error)
        }
    }

    const handleSaveSettings = async (chromaApiKey: string, chromaTenant: string, chromaDatabase: string) => {
        try {
            const response = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chromaApiKey, chromaTenant, chromaDatabase }),
            })

            if (response.ok) {
                setIsSettingsDialogOpen(false)
            }
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }


    if (status === 'loading' || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                RAG Assistant
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <LLMSelector />
                            <Button
                                onClick={() => setIsCreateDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Collection
                            </Button>
                            <Button
                                onClick={() => setIsSettingsDialogOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                Settings
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">
                        Document Collections
                    </h2>
                    <p className="text-slate-600">
                        Organize your documents into collections and chat with them using AI
                    </p>
                </div>

                {collections.length === 0 ? (
                    <div className="text-center py-12">
                        <Folder className="mx-auto h-24 w-24 text-slate-300 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">
                            No collections yet
                        </h3>
                        <p className="text-slate-600 mb-6">
                            Create your first collection to start organizing documents
                        </p>
                        <Button
                            onClick={() => setIsCreateDialogOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Collection
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {collections.map((collection, index) => (
                            <motion.div
                                key={collection.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group cursor-pointer"
                                onClick={() => router.push(`/collections/${collection.id}`)}
                            >
                                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-slate-200 group-hover:border-blue-300">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                                            <Folder className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <FileText className="w-4 h-4 mr-1" />
                                                {collection.documents?.length || 0} docs
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {collection.name}
                                    </h3>

                                    {collection.description && (
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                            {collection.description}
                                        </p>
                                    )}

                                    <div className="flex items-center text-xs text-slate-500">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {new Date(collection.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            <CreateCollectionDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateCollection}
            />
            <SettingsDialog
                settings={settings}
                isOpen={isSetttngsDialogOpen}
                onClose={() => setIsSettingsDialogOpen(false)}
                onSubmit={handleSaveSettings}
            />

        </div>
    )
}