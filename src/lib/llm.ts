import type { LLMProvider } from '@/types'
import {ChatOpenAI} from "@langchain/openai";
import {prisma} from "@/lib/db";


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
        models: ['llama2:7b', 'llama3.1:8b'],
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
        id: 'ollama-bielik',
        name: 'Bielik (Local)',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['SpeakLeash/bielik-7b-instruct-v0.1-gguf:latest','SpeakLeash/bielik-4.5b-v3.0-instruct:Q8_0' ],
        requiresApiKey: false,
    },
    {
        id: 'openai',
        name: 'OpenAI GPT',
        type: 'remote',
        models: ['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-5-nano'],
        requiresApiKey: true,
    },
    {
        id: 'phi',
        name: 'Phi',
        type: 'local',
        endpoint: 'http://localhost:11434',
        models: ['phi3:mini'],
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
    console.log("Tworzę instancje", provider);
    if (provider.type === 'local') {

        const { ChatOllama } = await import('@langchain/community/chat_models/ollama')
        return new ChatOllama({
            baseUrl: provider.endpoint,
            model: model,
        })
    } else if (provider.id === 'openai') {
        console.log('Teraz jest openai');
        return new ChatOpenAI({
            openAIApiKey: apiKey || 'abc',
            modelName: model,
        })
    }

    throw new Error(`Unsupported provider: ${provider.id}`)
}

export async function getApiKeyForProvider(user, activeProvider){

    // Get user's API keys
    const apiKeys = await prisma.apiKey.findMany({
        where: {
            user: {
                email: user.email } }
    })



    const apiKeyMap = apiKeys.reduce((acc, key) => {
        acc[key.provider] = key.key
        return acc
    }, {} as Record<string, string>)

    // Find LLM provider
    const provider = LLM_PROVIDERS.find(p => p.id === activeProvider) || LLM_PROVIDERS[0]


    return apiKeyMap[provider.id]
}

export async function getUserSettings(user) {
    const settings = await prisma.setting.findMany({
        where: {
            user: {
                email: user.email } }
    })
    return settings[0]
}