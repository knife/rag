import {ChromaClient, CloudClient} from 'chromadb'

import { OllamaEmbeddings } from '@langchain/ollama'

// Initialize Ollama embeddings



import { Document } from '@langchain/core/documents'
import { Chroma } from '@langchain/community/vectorstores/chroma'
import {OpenAI, OpenAIEmbeddings} from "@langchain/openai";

let client;

if (process.env.CHROMA_HOST == 'localhost') {
    client = new ChromaClient({
        path: `http://${process.env.CHROMA_HOST || 'localhost'}:${process.env.CHROMA_PORT || '8000'}`,
    })

} else {
    client = new CloudClient({
        apiKey: process.env.CHROMA_API_KEY,
        tenant: '88b5f29d-342c-45dc-98d4-da284f24b1d4',
        database: 'ragdb'
    });

}


export class VectorDB {
    private embeddings: OllamaEmbeddings | OpenAIEmbeddings

    constructor(apiKey?: string) {

        if (process.env.CHROMA_HOST == 'olocalhost') {
            this.embeddings = new OllamaEmbeddings({
                model: 'nomic-embed-text', // or 'all-minilm' for smaller model
                baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
            })

        } else {
                this.embeddings = new OpenAIEmbeddings({
                    apiKey: process.env.OPENAI_KEY,
                    batchSize: 512,
                    model: "text-embedding-3-large"
                });
        }
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
            console.log(vectorStore);

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