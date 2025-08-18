import type { LLMProvider } from '@/types'

export const LLM_PROVIDERS: LLMProvider[] = [
    {
        id: 'ollama-smollm2',
        name: 'SmallLLM 2 (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['smollm2:360m'],
        requiresApiKey: false,
    },
    {
        id: 'ollama-llama2',
        name: 'Llama 2 (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['llama2:7b', 'llama2:13b', 'llama2:70b'],
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
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o-mini'],
        requiresApiKey: false,
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
    const { ChatOpenAI } = await import('@langchain/openai')
    console.log('Teraz jest openai');
    return new ChatOpenAI({
        openAIApiKey: process.env.OPENAI_KEY,
        modelName: model,
    })

    console.log('Dlaczego kurna', provider)
    if (provider.type === 'local') {
        const { ChatOllama } = await import('@langchain/community/chat_models/ollama')
        return new ChatOllama({
            baseUrl: provider.endpoint,
            model: model,
        })
    } else if (provider.id === 'openai') {
        console.log('Teraz jest openai');
        return new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_KEY,
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