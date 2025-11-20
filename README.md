#### Uruchomienie lokalne



Aby aplikacja dziłała lokalnie należy zainstalować ChromaDB, PostgreSQL, oraz Ollama wraz z potrzebnymi modelami

##### Olama
Należy zainstalować Ollama wraz z potrzebnymi modelami. Przykładowo:
```bash
ollama run SpeakLeash/bielik-7b-instruct-v0.1-gguf:latest
ollama run smollm2:360m
ollama run llama2:7b
```


##### ChromaDB
Należy zainstalować ChromaDB. Aplikacja korzysta z domyślnego portu, co można zmienić w zmiennych środowiskowych


#### Next.js app

Uruchomienie aplikacji Nextjs:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Aplikacja jest dostępna pod adresem [http://localhost:3000](http://localhost:3000) 



### Uruchomienie zdalne
1. Należy utworzyć konto na stronie (https://rag-blond.vercel.app/)
2. Następnie należy utworzyć bazę danych w Chroma Cloud i zapisać dane konfiguracyjne
3. Potrzebne jest także konto na platformie OpenAI i klucz do OpenAIAPI
4. Wklejamy klucz i dane konfiguracyjne ChormaDB cloud po kliknięciu w przcisku Settings
5. Wklemajmy klucz OpenAi w okienku wyboru modelu LLM
6. Wybieramy OpenAI GPT 
6. Teraz możemy tworzyć kolekcje i uploadować dokumenty https://rag-blond.vercel.app/collections
7. Po wejściu na stronę kolekcji możemy rozpocząć czat.
