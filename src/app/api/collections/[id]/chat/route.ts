import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'
import {createLLMInstance, getApiKeyForProvider, getUserSettings, LLM_PROVIDERS} from '@/lib/llm'
import {Prompter} from "@/lib/prompter";


export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    const { id } = await params;

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify collection ownership
    const collection = await prisma.collection.findFirst({
      where: {
        id: id,
        user: {
          email: session.user.email
        }
      },
      include: { documents: true }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const { message, llmProvider, llmModel } = await request.json()

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get API key for provider if required
    const apiKey= await getApiKeyForProvider(session.user,llmProvider)
    const settings = await getUserSettings(session.user)
    const provider = LLM_PROVIDERS.find(p => p.id === llmProvider) || LLM_PROVIDERS[0]
    const llm = await createLLMInstance(provider, llmModel, apiKey)

    // Search for relevant documents
    const vectorDB = new VectorDB({openAiApiKey: apiKey, ...settings})
    const relevantDocs = await vectorDB.searchDocuments(id, message, 5)

    const sources = [...new Set(relevantDocs.metadatas[0].map((metadata) => metadata?.documentId))]

    const prompter = new Prompter(llm, relevantDocs)
    const response = await prompter.send(message)


    const responseContent = typeof response.content === 'string'
      ? response.content
      : response.content.toString()

    // Save chat session and messages (simplified)
    let chatSession = await prisma.chatSession.findFirst({
      where: { collectionId: id },
      orderBy: { createdAt: 'desc' }
    })

    if (!chatSession) {
      chatSession = await prisma.chatSession.create({
        data: { collectionId: id }
      })
    }

    // Save messages
    await prisma.chatMessage.createMany({
      data: [
        {
          sessionId: chatSession.id,
          role: 'user',
          content: message,
          sources: []
        },
        {
          sessionId: chatSession.id,
          role: 'assistant',
          content: responseContent,
          sources
        }
      ]
    })

    return NextResponse.json({
      response: responseContent,
      sources
    })
  } catch (error) {
    console.error('Error in chat:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}