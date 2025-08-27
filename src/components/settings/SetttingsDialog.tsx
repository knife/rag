import {useEffect, useState} from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SettingsDialogProps {
    isOpen: boolean
    onClose: () => void
    settings: Record<string, any>
    onSubmit: (chromaApiKey: string, chromaDatabase: string, chromaTenant) => void
}

export function SettingsDialog({ isOpen, onClose, onSubmit, settings }: SettingsDialogProps) {
    const [chromaApiKey, setChromaApiKey] = useState(settings?.chromaApiKey)
    const [chromaDatabase, setChromaDatabase] = useState(settings?.chromaDatabase)
    const [chromaTenant, setChromaTenant] = useState(settings?.chromaTenant)


    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (chromaApiKey.trim()) {
            onSubmit(chromaApiKey.trim(), chromaTenant.trim(), chromaDatabase.trim())
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Create New Collection</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Chroma Api Key
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={chromaApiKey}
                                onChange={(e) => setChromaApiKey(e.target.value)}
                                placeholder="Enter Chroma API Key "
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Chroma Tenant
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={chromaTenant}
                                onChange={(e) => setChromaTenant(e.target.value)}
                                placeholder="Enter Chroma Tenant"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                Chroma Database
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={chromaDatabase}
                                onChange={(e) => setChromaDatabase(e.target.value)}
                                placeholder="Enter Chroma Database name "
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 