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
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Parse LLM preferences from JSON
        const defaultPrefs = { provider: 'ollama', model: 'llama2', apiKeys: {} }


        return NextResponse.json({
            provider: user.llmProvider || defaultPrefs.provider,
            model: user.llmModel || defaultPrefs.model,
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

        const { provider, model, apiKey } = await request.json()

        // Get user by email
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: { id: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                llmProvider: provider || 'ollama',
                llmModel: model || 'llama2',
            }
        })

        if (apiKeys) {
            const apiKey = await prisma.apiKeys.findUnique({
                where: {
                    user: {
                        id: user.id
                    },
                    provider: provider
                }
            })

            apiKey.update({
                key: apiKey
            })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error saving LLM preferences:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
} 