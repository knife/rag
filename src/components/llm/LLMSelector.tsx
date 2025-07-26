'use client'

import { useState } from 'react'
import { Settings, Key, Cpu, Cloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLLM } from './LLMProvider'
import { LLM_PROVIDERS } from '@/lib/llm'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function LLMSelector() {
    const { selectedProvider, selectedModel, setSelectedProvider, setSelectedModel, apiKeys, setApiKey } = useLLM()
    const [isOpen, setIsOpen] = useState(false)
    const [tempApiKeys, setTempApiKeys] = useState<Record<string, string>>(apiKeys)

    const handleSaveApiKeys = () => {
        Object.entries(tempApiKeys).forEach(([provider, key]) => {
            if (key.trim()) {
                setApiKey(provider, key.trim())
            }
        })
        setIsOpen(false)
    }

    return (
        <div className="flex items-center space-x-2">
            {/* Current Selection Display */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg border border-slate-200">
                {selectedProvider?.type === 'local' ? (
                    <Cpu className="w-4 h-4 text-green-600" />
                ) : (
                    <Cloud className="w-4 h-4 text-blue-600" />
                )}
                <div className="text-sm">
                    <div className="font-medium">{selectedProvider?.name}</div>
                    <div className="text-slate-500">{selectedModel}</div>
                </div>
            </div>

            {/* Settings Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>LLM Configuration</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Provider Selection */}
                        <div>
                            <label className="text-sm font-medium mb-2 block">Provider</label>
                            <Select
                                value={selectedProvider?.id}
                                onValueChange={(value) => {
                                    const provider = LLM_PROVIDERS.find(p => p.id === value)
                                    if (provider) {
                                        setSelectedProvider(provider)
                                        setSelectedModel(provider.models[0])
                                    }
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LLM_PROVIDERS.map((provider) => (
                                        <SelectItem key={provider.id} value={provider.id}>
                                            <div className="flex items-center space-x-2">
                                                {provider.type === 'local' ? (
                                                    <Cpu className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Cloud className="w-4 h-4 text-blue-600" />
                                                )}
                                                <span>{provider.name}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Model Selection */}
                        {selectedProvider && (
                            <div>
                                <label className="text-sm font-medium mb-2 block">Model</label>
                                <Select
                                    value={selectedModel || ''}
                                    onValueChange={setSelectedModel}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedProvider.models.map((model) => (
                                            <SelectItem key={model} value={model}>
                                                {model}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        {/* API Keys */}
                        <div>
                            <label className="text-sm font-medium mb-2 block flex items-center">
                                <Key className="w-4 h-4 mr-2" />
                                API Keys
                            </label>
                            <div className="space-y-3">
                                {LLM_PROVIDERS.filter(p => p.requiresApiKey).map((provider) => (
                                    <div key={provider.id}>
                                        <label className="text-xs text-slate-600 mb-1 block">
                                            {provider.name}
                                        </label>
                                        <Input
                                            type="password"
                                            placeholder={`Enter ${provider.name} API key`}
                                            value={tempApiKeys[provider.id] || ''}
                                            onChange={(e) =>
                                                setTempApiKeys(prev => ({
                                                    ...prev,
                                                    [provider.id]: e.target.value
                                                }))
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveApiKeys}>
                                Save Configuration
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}