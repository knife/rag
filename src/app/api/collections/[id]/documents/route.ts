import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { VectorDB } from '@/lib/vectordb'
import pdfParse from 'pdf-parse'
import {getApiKeyForProvider, getUserSettings, LLM_PROVIDERS} from '@/lib/llm'
import { Document } from '@langchain/core/documents'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

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
          email: session.user.email,
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const text = formData.get('text') as string
    const name = formData.get('name') as string
    const llmProvider = formData.get('llmProvider') as string

    let content = ''
    let documentName = ''
    let documentType = ''

    if (file) {
      // Handle file upload
      const buffer = Buffer.from(await file.arrayBuffer())
      documentName = file.name

      if (file.type === 'application/pdf') {
        const pdfData = await pdfParse(buffer)
        content = pdfData.text
        documentType = 'pdf'
      } else if (file.type === 'text/plain') {
        content = buffer.toString('utf-8')
        documentType = 'text'
      } else {
        return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
      }
    } else if (text) {
      // Handle text input
      content = text
      documentName = name || 'Text Document'
      documentType = 'text'
    } else {
      return NextResponse.json({ error: 'No file or text provided' }, { status: 400 })
    }

    if (!content.trim()) {
      return NextResponse.json({ error: 'Document content is empty' }, { status: 400 })
    }

    // Split text into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
    })

    const chunks = await textSplitter.splitText(content)

    // Create document in database
    const document = await prisma.document.create({
      data: {
        name: documentName,
        content,
        type: documentType,
        collectionId: id,
        vectorIds: [], // Will be updated after vector insertion
      }
    })



    // Get API key for provider if required
    const apiKey= await getApiKeyForProvider(session.user,llmProvider)
    const settings = await getUserSettings(session.user)

    // Search for relevant documents
    const vectorDB = new VectorDB({openAiApiKey: apiKey, ...settings})

    // Create vector embeddings
    const langchainDocs = chunks.map(
      (chunk, index) => new Document({
        pageContent: chunk,
        id: document.id + "_" + index,
        metadata: {
          documentId: document.id,
          chunkIndex: index,
          source: documentName,
        }
      })
    )

    await vectorDB.addDocuments(id, langchainDocs)

    // Update document with vector IDs (simplified - in real implementation you'd get actual IDs)
    const vectorIds = chunks.map((_, index) => `${document.id}_chunk_${index}`)
    await prisma.document.update({
      where: { id: document.id },
      data: { vectorIds }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}