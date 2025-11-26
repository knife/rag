// src/app/api/collections/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'
import {getApiKeyForProvider, getUserSettings} from "@/lib/llm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;
        const user = await prisma.user.findFirst({where: { email: session.user.email }})

        const collection = await prisma.collection.findFirst({
            where: {
                id: id,
                userId: user?.id,
            },
            include: {
                documents: {
                    orderBy: { createdAt: 'desc' }
                },
                chatSessions: {
                    include: {
                        messages: {
                            orderBy: { createdAt: 'asc' }
                        }
                    }
                }
            }
        })

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
        }

        return NextResponse.json(collection)
    } catch (error) {
        console.error('Error fetching collection:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params;

        const collection = await prisma.collection.findFirst({
            where: {
                id: id,
                user: {
                    email: session.user.email
                }
            }
        })

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
        }

        const settings = await getUserSettings(session.user)
        const apiKey = await getApiKeyForProvider(session.user, 'openai')
        const vectorDB = new VectorDB({openAiApiKey: apiKey, ...settings})
        
        try {
            await vectorDB.deleteCollection(id)
        } catch(error) {
           console.log(error)
        }

        await prisma.document.deleteMany({
            where: { collectionId: id }
        })

        await prisma.collection.delete({
            where: { id: id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting collection:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}