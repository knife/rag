export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  userId: string;
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'text';
  collectionId: string;
  vectorIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
  createdAt: Date;
}

export interface LLMProvider {
  id: string;
  name: string;
  type: 'local' | 'remote';
  endpoint?: string;
  models: string[];
  requiresApiKey: boolean;
}

export interface ApiKey {
  id: string;
  provider: string;
  key: string;
}