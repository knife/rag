
const dictionaries = {
  "en": {
    "app": {
      "name": "RAG"
    },
    "pages": {
      "collections": {
        "title": "Document Collections",
        "subtitle": "Organize your documents into collections and chat with them using AI",
        "documents": "docs",
        "no_collections": "No collections yet",
        "new_collection": "Create your first collection to start organizing documents.",
        "create_collection": "Create collection"
      },
      "chat": {
        "documents": "Documents",
        "chat_with_documents": "Chat with Documents",
        "no_documents": "No documents uploaded yet",
        "start_conversation": "Start a conversation",
        "start_conversation_help": "Ask questions about your documents. I'll search through them and provide relevant answers.",
        "start_conversation_no_docs": "Upload documents first to get started!",
        "imput_prompt": "Ask a question about your documents...",
        "upload_files": "Upload documents to start chatting"
      }
    },
    "buttons" : {
      "settings": "Settings",
      "new_collection": "New collection",
      "upload_document": "Upload Document",
      "back": "Back"
    }
  },
  "pl": {
    "app": {
      "name": "RAG"
    },
    "pages": {
      "collections": {
        "title": "Kolekcje dokumentów",
        "subtitle": "Zoorganizuj swoje dokumenty w foldery i rozmawiaj z nimi za pomocą AI",
        "documents": "Dokument",
        "no_collections": "Brak kolekcji",
        "new_collection": "Stwórz swoją pierwszą kolekcję aby zacząć organizować dokumenty.",
        "create_collection": "Utwórz kolekcję"
      },
      "chat": {
        "documents": "Dokumenty",
        "chat_with_documents": "Rozmowa z dokumentami",
        "no_documents": "Brak dokumentów",
        "start_conversation": "Rozpocznij rozmowę",
        "start_conversation_help": "Zadaj pytanie dotyczące przesłanych dokumentów. Przeszukam je i odpowiem.",
        "start_conversation_no_docs": "Prześlij dokumenty aby zacząć rozmowę.",
        "input_prompt": "Zadaj pytanie odnośnie dokumentów",
        "upload_files": "Prześlij dokumenty aby zacząć rozmowę"
      }
    },
    "buttons" : {
      "settings": "Ustawienia",
      "new_collection": "Nowa kolekcja",
      "upload_document": "Prześlij dokument",
      "back": "Wstecz"
    }
  },
}

export const getDictionary = (locale: 'en' | 'pl' = 'pl') =>
dictionaries[locale]