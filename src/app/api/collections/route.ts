import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const collections = await prisma.collection.findMany({
            where: { userId: session.user.id },
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
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, description } = await request.json()

        if (!name?.trim()) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 })
        }

        const collection = await prisma.collection.create({
            data: {
                name: name.trim(),
                description: description?.trim(),
                userId: session.user.id,
            },
            include: { documents: true }
        })

        // Create vector database collection
        const vectorDB = new VectorDB()
        await vectorDB.createCollection(collection.id)

        return NextResponse.json(collection, { status: 201 })
    } catch (error) {
        console.error('Error creating collection:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}