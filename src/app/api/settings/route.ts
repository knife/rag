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

        const settings = await prisma.setting.findMany({
            where: { user: {email:  session.user.email } },
            orderBy: { updatedAt: 'desc' }
        })

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { chromaApiKey, chromaTenant, chromaDatabase } = await request.json()
        const user = await prisma.user.findFirst({where: { email: session.user.email }})
        let newSetting;

        if (user) {

            let settingRecord = await prisma.setting.findFirst({
                where: {
                    userId: user.id
                }
            })

            if (settingRecord) {
                settingRecord = await prisma.setting.update({
                    where: {
                        id: settingRecord.id
                    },
                    data: {
                        chromaApiKey: chromaApiKey.trim(),
                        chromaTenant: chromaTenant.trim(),
                        chromaDatabase: chromaDatabase.trim()
                    }
                })
            } else {
                settingRecord = await prisma.setting.create({
                    data: {
                        userId: user.id,
                        chromaApiKey: chromaApiKey.trim(),
                        chromaTenant: chromaTenant.trim(),
                        chromaDatabase: chromaDatabase.trim()
                    }
                })
            }

        return NextResponse.json(settingRecord , { status: 201 })
        }
    } catch (error) {
        console.error('Error saving setting:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}