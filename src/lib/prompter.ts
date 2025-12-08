import {PromptTemplate} from "@langchain/core/prompts";

const CHAT_PROMPT = PromptTemplate.fromTemplate(`
You are a helpful AI assistant that answers questions based on the provided context from documents.

Context from documents:
{context}

Question: {question}

Please provide a helpful and accurate answer based on the context above. If the context doesn't contain enough information to answer the question, please say so clearly.

Answer:`)


export class Prompter {
    private relevantDocs
    private llm

    constructor(llm, relevantDocs){
       this.relevantDocs = relevantDocs;
       this.llm = llm;
    }

    async send(message) {

        // Prepare context
        console.log(this.relevantDocs.metadatas)
        console.log(this.relevantDocs.distances);
        const context = this.relevantDocs.documents[0]
            .map((doc) => `Document: \nContent: ${doc}`)
            .join('\n\n---\n\n')

        console.log(context);

        const prompt = await CHAT_PROMPT.format({
            context,
            question: message
        })

        return this.llm.invoke(prompt)
    }
}