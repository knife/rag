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
            include: {
                apiKeys: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const defaultPrefs = { provider: 'ollama', model: 'llama2', apiKeys: {} }

        let userKeys: Record<string,string>  = {}
        user.apiKeys.map((record)=> {
           userKeys[record.provider] = record.key
        })

        return NextResponse.json({
            provider: user.llmProvider || defaultPrefs.provider,
            model: user.llmModel || defaultPrefs.model,
            apiKeys: userKeys
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
            for (const property in apiKeys) {

                const apiKeyRecord = await prisma.apiKey.findFirst({
                    where: {
                        userId: user.id,
                        provider: property
                    }
                })

                if (apiKeyRecord) {
                    await prisma.apiKey.update({
                        where: {
                            id: apiKeyRecord.id,
                            provider: property
                        },
                        data: {
                          key: apiKeys[property]
                        }
                    })
                } else {
                   await prisma.apiKey.create({
                       data: {
                           userId: user.id,
                           provider: property,
                           key: apiKeys[property]
                       }
                   })
                }
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error saving LLM preferences:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
} 