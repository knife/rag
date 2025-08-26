import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'
import {getApiKeyForProvider, getUserSettings} from "@/lib/llm";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const collections = await prisma.collection.findMany({
            where: { user: {email:  session.user.email } },
            include: {
                documents: true,
                _count: { select: { documents: true } }
            },
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(collections)
    } catch (error) {
        console.error('Error fetching collections:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, description, llmProvider } = await request.json()
        const user = await prisma.user.findFirst({where: { email: session.user.email }})

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        if (user) {
            const collection = await prisma.collection.create({
                data: {
                    name: name.trim(),
                    description: description?.trim(),
                    userId: user.id,
                },
                include: {documents: true}
            })


            // Get API key for provider if required
            const apiKey= await getApiKeyForProvider(session.user,llmProvider)
            const settings = await getUserSettings(session.user)

            // Search for relevant documents
            const vectorDB = new VectorDB({openAiApiKey: apiKey, ...settings})


        // Create vector database collection
        await vectorDB.createCollection(collection.id)

        return NextResponse.json(collection, { status: 201 })
        }
    } catch (error) {
        console.error('Error creating collection:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}