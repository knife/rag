'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
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

export function LLMProvider({ children }: { children: ReactNode }) {
    const [selectedProvider, setSelectedProvider] = useState<LLMProviderType | null>(
        LLM_PROVIDERS[0]
    )
    const [selectedModel, setSelectedModel] = useState<string | null>(
        LLM_PROVIDERS[0]?.models[0] || null
    )
    const [apiKeys, setApiKeysState] = useState<Record<string, string>>({})

    const setApiKey = (provider: string, key: string) => {
        setApiKeysState(prev => ({ ...prev, [provider]: key }))
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