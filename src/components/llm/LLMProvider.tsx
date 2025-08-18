'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LLMProvider as LLMProviderType } from '@/types'
import { LLM_PROVIDERS } from '@/lib/llm'

interface LLMContextType {
    selectedProvider: LLMProviderType | null
    selectedModel: string | null
    setSelectedProvider: (provider: LLMProviderType) => void
    setSelectedModel: (model: string) => void
    apiKeys: Record<string, string>
    setApiKey: (provider: string, key: string) => void
}

const LLMContext = createContext<LLMContextType | undefined>(undefined)

const STORAGE_KEYS = {
    PROVIDER: 'llm-provider',
    MODEL: 'llm-model',
    API_KEYS: 'llm-api-keys'
}

export function LLMProvider({ children }: { children: ReactNode }) {
    const [selectedProvider, setSelectedProviderState] = useState<LLMProviderType | null>(
        LLM_PROVIDERS[0]
    )
    const [selectedModel, setSelectedModelState] = useState<string | null>(
        LLM_PROVIDERS[0]?.models[0] || null
    )
    const [apiKeys, setApiKeysState] = useState<Record<string, string>>({})

    // Load preferences from localStorage and API on mount
    useEffect(() => {
        const loadPreferences = async () => {
            try {
                // First load from localStorage for immediate UI update
                const storedProvider = localStorage.getItem(STORAGE_KEYS.PROVIDER)
                const storedModel = localStorage.getItem(STORAGE_KEYS.MODEL)
                const storedApiKeys = localStorage.getItem(STORAGE_KEYS.API_KEYS)

                if (storedProvider) {
                    const provider = LLM_PROVIDERS.find(p => p.id === storedProvider)
                    if (provider) {
                        setSelectedProviderState(provider)
                    }
                }

                if (storedModel) {
                    setSelectedModelState(storedModel)
                }

                if (storedApiKeys) {
                    setApiKeysState(JSON.parse(storedApiKeys))
                }

                // Then load from API to sync with database
                try {
                    const response = await fetch('/api/auth/llm-preferences')
                    if (response.ok) {
                        const data = await response.json()
                        
                        const provider = LLM_PROVIDERS.find(p => p.id === data.provider)
                        if (provider) {
                            setSelectedProviderState(provider)
                            localStorage.setItem(STORAGE_KEYS.PROVIDER, provider.id)
                        }

                        if (data.model) {
                            setSelectedModelState(data.model)
                            localStorage.setItem(STORAGE_KEYS.MODEL, data.model)
                        }

                        if (data.apiKeys) {
                            setApiKeysState(data.apiKeys)
                            localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(data.apiKeys))
                        }
                    }
                } catch (apiError) {
                    console.log('API preferences not available, using localStorage')
                }
            } catch (error) {
                console.error('Error loading LLM preferences:', error)
            }
        }

        loadPreferences()
    }, [])

    const savePreferences = async (provider?: LLMProviderType | null, model?: string | null, keys?: Record<string, string>) => {
        console.log("co jest", model, provider)
        try {
            const data = {
                provider: provider?.id || selectedProvider?.id || 'ollama',
                model: model || selectedModel || 'llama2',
                apiKeys: keys || apiKeys
            }

            await fetch('/api/auth/llm-preferences', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
        } catch (error) {
            console.error('Error saving preferences to server:', error)
        }
    }

    const setSelectedProvider = (provider: LLMProviderType) => {
        setSelectedProviderState(provider)
        localStorage.setItem(STORAGE_KEYS.PROVIDER, provider.id)
        savePreferences(provider, selectedModel, apiKeys)
    }

    const setSelectedModel = (model: string) => {
        setSelectedModelState(model)
        localStorage.setItem(STORAGE_KEYS.MODEL, model)
        savePreferences(selectedProvider, model, apiKeys)
    }

    const setApiKey = (provider: string, key: string) => {
        const newApiKeys = { ...apiKeys, [provider]: key }
        setApiKeysState(newApiKeys)
        localStorage.setItem(STORAGE_KEYS.API_KEYS, JSON.stringify(newApiKeys))
        savePreferences(selectedProvider, selectedModel, newApiKeys)
    }

    return (
        <LLMContext.Provider
            value={{
                selectedProvider,
                selectedModel,
                setSelectedProvider,
                setSelectedModel,
                apiKeys,
                setApiKey,
            }}
        >
            {children}
        </LLMContext.Provider>
    )
}

export function useLLM() {
    const context = useContext(LLMContext)
    if (context === undefined) {
        throw new Error('useLLM must be used within a LLMProvider')
    }
    return context
}