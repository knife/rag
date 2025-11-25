import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {getDictionary} from "@/app/dict";

interface CreateCollectionDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (name: string, description: string) => void
}

export function CreateCollectionDialog({ isOpen, onClose, onSubmit }: CreateCollectionDialogProps) {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')

    const dict = getDictionary('pl')

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (name.trim()) {
            onSubmit(name.trim(), description.trim())
            setName('')
            setDescription('')
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full mx-4">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">{dict.modals.create_new_collection}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                                {dict.modals.collection_name} *
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={dict.modals.collection_name_placeholder}
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                                {dict.modals.collection_description}
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder={dict.modals.collection_description_placeholder}
                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                {dict.buttons.cancel}
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            >
                                {dict.modals.create_collection}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
} 