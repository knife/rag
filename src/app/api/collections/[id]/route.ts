// src/app/api/collections/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const collection = await prisma.collection.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            include: {
                documents: {
                    orderBy: { createdAt: 'desc' }
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
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const collection = await prisma.collection.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            }
        })

        if (!collection) {
            return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
        }

        // Delete from vector database
        const vectorDB = new VectorDB()
        await vectorDB.deleteCollection(params.id)

        // Delete from main database
        await prisma.collection.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting collection:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}