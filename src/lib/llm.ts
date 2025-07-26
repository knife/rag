import type { LLMProvider } from '@/types'

export const LLM_PROVIDERS: LLMProvider[] = [
    {
        id: 'ollama-llama2',
        name: 'Llama 2 (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['llama2', 'llama2:13b', 'llama2:70b'],
        requiresApiKey: false,
    },
    {
        id: 'ollama-mistral',
        name: 'Mistral (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['mistral', 'mistral:7b', 'mistral:instruct'],
        requiresApiKey: false,
    },
    {
        id: 'ollama-codellama',
        name: 'Code Llama (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['codellama', 'codellama:13b', 'codellama:34b'],
        requiresApiKey: false,
    },
    {
        id: 'openai',
        name: 'OpenAI GPT',
        type: 'remote',
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'],
        requiresApiKey: true,
    },
    {
        id: 'anthropic',
        name: 'Anthropic Claude',
        type: 'remote',
        models: ['claude-3-sonnet', 'claude-3-opus', 'claude-3-haiku'],
        requiresApiKey: true,
    },
]

export async function createLLMInstance(provider: LLMProvider, model: string, apiKey?: string) {
    if (provider.type === 'local') {
        const { ChatOllama } = await import('@langchain/community/chat_models/ollama')
        return new ChatOllama({
            baseUrl: provider.endpoint,
            model: model,
        })
    } else if (provider.id === 'openai') {
        const { ChatOpenAI } = await import('@langchain/openai')
        return new ChatOpenAI({
            openAIApiKey: apiKey,
            modelName: model,
        })
    } else if (provider.id === 'anthropic') {
        const { ChatAnthropic } = await import('@langchain/anthropic')
        return new ChatAnthropic({
            anthropicApiKey: apiKey,
            modelName: model,
        })
    }

    throw new Error(`Unsupported provider: ${provider.id}`)
}