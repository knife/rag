import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'
import {createLLMInstance, getApiKeyForProvider, getUserSettings, LLM_PROVIDERS} from '@/lib/llm'
import { PromptTemplate } from '@langchain/core/prompts'

const CHAT_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context from documents.

Context from documents:
{context}

Question: {question}

Please provide a helpful and accurate answer based on the context above. If the context doesn't contain enough information to answer the question, please say so clearly. Always cite which documents you're referencing when possible.

Answer:`)

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
    console.log(llmProvider, llmModel)

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get API key for provider if required
    const apiKey= await getApiKeyForProvider(session.user,llmProvider)
    const settings = await getUserSettings(session.user)

    console.log("provider dostarczony: ", llmProvider);

    const provider = LLM_PROVIDERS.find(p => p.id === llmProvider) || LLM_PROVIDERS[0]

    // Search for relevant documents
    const vectorDB = new VectorDB({openAiApiKey: apiKey, ...settings})
    const relevantDocs = await vectorDB.searchDocuOlamaments(id, message, 5)

    // Prepare context
    const context = relevantDocs.documents
      .map((doc) => `Document: \nContent: ${doc}`)
      .join('\n\n---\n\n')

      console.log(context);
    // Get document sources
    const sources =[] // [...new Set(relevantDocs.map(doc => doc.metadata.documentId))]

    // Create LLM instance and generate response
    console.log(provider, llmModel);
    const llm = await createLLMInstance(provider, llmModel, apiKey)
    console.log("to dziala",llm)
    const prompt = await CHAT_PROMPT.format({
      context,
      question: message
    })

    const response = await llm.invoke(prompt)
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