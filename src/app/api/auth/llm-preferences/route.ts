import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Get user by email and fetch preferences
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                id: true,
                llmPreferences: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Parse LLM preferences from JSON
        const defaultPrefs = { provider: 'ollama', model: 'llama2', apiKeys: {} }
        let preferences = defaultPrefs
        
        if (user.llmPreferences) {
            try {
                preferences = typeof user.llmPreferences === 'string' 
                    ? JSON.parse(user.llmPreferences)
                    : user.llmPreferences as any
            } catch (error) {
                console.error('Error parsing LLM preferences:', error)
                preferences = defaultPrefs
            }
        }

        return NextResponse.json({
            provider: preferences.provider || 'ollama',
            model: preferences.model || 'llama2',
            apiKeys: preferences.apiKeys || {}
        })
    } catch (error) {
        console.error('Error fetching LLM preferences:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { provider, model, apiKeys } = await request.json()

        // Get user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Update user's LLM preferences in JSON field
        const preferences = {
            provider: provider || 'ollama',
            model: model || 'llama2',
            apiKeys: apiKeys || {}
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                llmProvider: provider || 'ollama',
                llmModel: model || 'llama2',
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error saving LLM preferences:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
} 