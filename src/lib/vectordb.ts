import { ChromaClient, CloudClient, Collection, OpenAIEmbeddingFunction } from 'chromadb';
import { Document as LangchainDocument } from '@langchain/core/documents'


interface Document {
    id: string;
    content: string;
    metadata?: Record<string, any>;
}

interface VectorDBConfig {
    useCloud?: boolean;
    chromaApiKey?: string;
    chromaTenant?: string;
    chromaDatabase?: string;
    cloudUrl?: string;
    embeddingModel?: string;
    openAiApiKey?: string;
}

export class VectorDB {
    private client: ChromaClient;
    private embedding: OpenAIEmbeddingFunction;

    constructor(config: VectorDBConfig = {}) {
        // Initialize embedding function
        this.embedding = new OpenAIEmbeddingFunction({
            openai_api_key: config.openAiApiKey || process.env.OPENAI_KEY || '',
            openai_model: config.embeddingModel || 'text-embedding-3-small'
        });

        // Initialize ChromaDB client
        if (process.env.CHROMA_HOST=='localhost') {

            // Default to local ChromaDB
            this.client = new ChromaClient({
                path: 'http://localhost:8000'
            });

        } else {
            if (!config.chromaApiKey ) {
                throw new Error('Cloud API key and URL are required when using ChromaCloud');
            }


            this.client = new CloudClient({
                tenant: config.chromaTenant,
                database: config.chromaDatabase,
                apiKey: config.chromaApiKey
            });
        }
    }

    /**
     * Creates a new collection in the vector database
     */
    async createCollection(collectionId: string): Promise<void> {
        try {
            await this.client.createCollection({
                name: collectionId,
                embeddingFunction: this.embedding
            });
        } catch (error) {
            if (error instanceof Error && error.message.includes('already exists')) {
                console.warn(`Collection ${collectionId} already exists`);
                return;
            }
            throw new Error(`Failed to create collection ${collectionId}: ${error}`);
        }
    }

    /**
     * Adds documents to a specific collection
     */
    async addDocuments(collectionId: string, documents: LangchainDocument[]): Promise<void> {
        try {
            const collection = await this.client.getCollection({
                name: collectionId,
                embeddingFunction: this.embedding
            });


            const ids = documents.map(doc => doc.id);
            const texts = documents.map(doc => doc.pageContent);
            const metadatas = documents.map(doc => doc.metadata || {});

            await collection.add({
                ids,
                documents: texts,
                metadatas
            });
        } catch (error) {
            throw new Error(`Failed to add documents to collection ${collectionId}: ${error}`);
        }
    }

    /**
     * Searches for similar documents in a collection
     */
    async searchDocuments(
        collectionId: string,
        query: string,
        k: number = 5
    ) {
        try {
            const collection = await this.client.getCollection({
                name: collectionId,
                embeddingFunction: this.embedding
            });

            const results = await collection.query({
                queryTexts: [query],
                nResults: k
            });
            return results

        } catch (error) {
            throw new Error(`Failed to search documents in collection ${collectionId}: ${error}`);
        }
    }

    /**
     * Deletes a collection from the vector database
     */
    async deleteCollection(collectionId: string): Promise<void> {
        try {
            await this.client.deleteCollection({
                name: collectionId
            });
        } catch (error) {
            throw new Error(`Failed to delete collection ${collectionId}: ${error}`);
        }
    }

    /**
     * Lists all available collections
     */
    async listCollections(): Promise<string[]> {
        try {
            const collections = await this.client.listCollections();
            return collections.map(collection => collection.name);
        } catch (error) {
            throw new Error(`Failed to list collections: ${error}`);
        }
    }

    /**
     * Gets collection info including document count
     */
    async getCollectionInfo(collectionId: string): Promise<{
        name: string;
        count: number;
        metadata?: Record<string, any>;
    }> {
        try {
            const collection = await this.client.getCollection({
                name: collectionId,
                embeddingFunction: this.embedding
            });

            const count = await collection.count();

            return {
                name: collectionId,
                count,
                metadata: collection.metadata
            };
        } catch (error) {
            throw new Error(`Failed to get collection info for ${collectionId}: ${error}`);
        }
    }
}

// Usage examples:
