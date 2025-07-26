import { ChromaApi, OpenAIApi } from 'chromadb'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Document } from '@langchain/core/documents'
import { Chroma } from '@langchain/community/vectorstores/chroma'

const client = new ChromaApi({
    host: process.env.CHROMA_HOST || 'localhost',
    port: process.env.CHROMA_PORT || '8000',
})

export class VectorDB {
    private embeddings: OpenAIEmbeddings

    constructor(apiKey?: string) {
        this.embeddings = new OpenAIEmbeddings({
            openAIApiKey: apiKey || process.env.OPENAI_API_KEY,
        })
    }

    async createCollection(collectionId: string) {
        try {
            await client.createCollection({
                name: collectionId,
                metadata: { created_at: new Date().toISOString() }
            })
        } catch (error) {
            console.error('Error creating collection:', error)
        }
    }

    async addDocuments(collectionId: string, documents: Document[]) {
        try {
            const vectorStore = await Chroma.fromDocuments(
                documents,
                this.embeddings,
                {
                    collectionName: collectionId,
                    url: `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT}`,
                }
            )
            return vectorStore
        } catch (error) {
            console.error('Error adding documents:', error)
            throw error
        }
    }

    async searchDocuments(collectionId: string, query: string, k: number = 5) {
        try {
            const vectorStore = await Chroma.fromExistingCollection(
                this.embeddings,
                {
                    collectionName: collectionId,
                    url: `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT}`,
                }
            )

            const results = await vectorStore.similaritySearch(query, k)
            return results
        } catch (error) {
            console.error('Error searching documents:', error)
            throw error
        }
    }

    async deleteCollection(collectionId: string) {
        try {
            await client.deleteCollection({ name: collectionId })
        } catch (error) {
            console.error('Error deleting collection:', error)
        }
    }
}