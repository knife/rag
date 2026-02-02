
const dictionaries = {
  "en": {
    "app": {
      "name": "RAG",
      "full_name": "Asystent RAG",
      "metadata": {
        "title": "RAG App - Document Chat Assistant",
        "description": "Chat with your documents using AI"
      },
    },
    "pages": {
      "sign_in": {
        "title": "Sign in to your account",
        "email": "Email",
        "password": "Password",
        "signin": "Sign In",
        "signup": "Sign Up",
        "dont_have_account": "Don't have an account?"
      },
      "sign_up": {
        "title": "Create your account",
        "email": "Email",
        "password": "Password",
        "confirm_password": "Confirm password",
        "email_placeholder": "Enter your email",
        "password_placeholder": "Enter your password",
        "password_confirmation_placeholder": "Enter your password again",
        "password_strength": "Password Strength",
        "password_match": "Passwords do match.",
        "password_dont_match": "Passwords do not match.",
        "reqs": {
          "uppercase": "Uppercase letter",
          "lowercase": "Lowercase letter",
          "length": "At least 8 characters",
          "number": "Number",
          "special_character": "Special character"
        },
        "score": {
          "very_weak": "Very weak",
          "weak": "Weak",
          "fair": "Fairy",
          "good": "Good",
          "strong": "Strong",
        },
        "create_account": "Create Account",
        "already_have_account": "Already have an account?",
        "sign_in": "Sign in"
      },
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
      },
      "account": {
        "back_to_collections": "Back to collections",
        "account_info_header": "Account Information",
        "email_address": "Email Address",
        "signout": "Sign out",
        "welcome_header": "Welcome To RAG Assistant",
        "quick_actions": "Quick Actions",
        "my_collections": "My Collections",
        "help_support": "Help and Support",
        "loading_info": "Loading user information..."
      }
    },
    "toast": {
      "success": "Success",
      "general_error": "Something went wrong",
      "sign_out": "Signed out successfully",
      "sign_out_error": "Something went wrong during sign out",
      "sign_in_invalid_creds": "Invalid email or password",
      "sign_in_success": "Signed in successfully",
      "sign_up_passwords_not_match":  "Passwords do not match",
      "sign_up_password_too_weak": "Password is too weak. Please choose a stronger password.",
      "sign_up_success": "Account created successfully",
      "collection_removed": "Collection has been removed.",
      "collection_remove_error": "There was an error while removing collection.",
      "collection_created": "Collection has been created.",
      "settings_saved": "Settings has been saved."
    },
    "buttons" : {
      "settings": "Settings",
      "new_collection": "New collection",
      "upload_document": "Upload Document",
      "back": "Back",
      "save_settings": "Save settings",
      "cancel": "Cancel"
    },
    "modals": {
      "settings": "Settings",
      "create_new_collection": "Create New Collection",
      "collection_name": "Collection Name",
      "collection_description": "Description",
      "collection_name_placeholder": "Enter collection name",
      "collection_description_placeholder": "Enter collection description (optional)",
      "create_collection": "Create Collection",
      "llm_configuration": "LLM Configuration",
      "provider": "Provider",
      "model": "Model",
      "save_configuration": "Save Configuration",
      "api_keys": "API keys",
      "enter_open_apikey": "Enter OpenAI API key",
      "enter_anthropic_key": "Enter Anthropic API key",
      "upload_button": "Upload",
      "supported_filetypes": "Supports PDF and TXT files",
      "upload_file": "Upload File",
      "add_text": "Add Text",
      "upload_title":  "Upload Document",
      "content_label": "Treść",
      "title_label": "Tytuł",
      "drag_and_drop_help": "Drop the file here...",
      "upload_file_help": "Drag & drop a PDF or text file here, or click to select"
    }
  },
  "pl": {
    "app": {
      "name": "RAG",
      "full_name": "Asystent RAG",
      "metadata": {
        "title": "RAG App - Twój asystent AI",
        "description": "Rozmawiaj ze swoimi dokumentami za pomocą AI"
      },
    },
    "pages": {
      "sign_in": {
        "title": "Logowanie",
        "signin": "Zaloguj się",
        "signup": "Zarejestruj się",
        "email": "Email",
        "password": "Hasło",
        "dont_have_account": "Nie masz konta? "
      },
      "sign_up": {
        "title": "Utwórz swoje konto",
        "email": "Email",
        "password": "Hasło",
        "email_placeholder": "Wpisz swój email...",
        "password_placeholder": "Wpisz swoje hasło...",
        "password_confirmation_placeholder": "Wpisz swoje hasło ponownie...",
        "confirm_password": "Potwierdź hasło",
        "password_strength": "Siła hasła",
        "password_match": "Hasła są takie same.",
        "password_dont_match": "Hasła są różne.",
        "reqs": {
          "uppercase": "Duża litera",
          "lowercase": "Mała litera",
          "length": "Co najmniej 8 znaków",
          "number": "Liczba",
          "special_character": "Znak specjalny"
        },
        "score": {
          "very_weak": "Bardzo słabe",
          "weak": "Słabe",
          "fair": "Niezłe",
          "good": "Dobre",
          "strong": "Mocne",
        },
        "create_account": "Utwórz Konto",
        "already_have_account": "Masz już konto? ",
        "sign_in": "Zaloguj się"
      },
      "collections": {
        "title": "Kolekcje dokumentów",
        "subtitle": "Zorganizuj swoje dokumenty w foldery i rozmawiaj z nimi za pomocą AI",
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
      },
      "account": {
        "back_to_collections": "Powrót do kolekcji",
        "account_info_header": "Informacje o koncie",
        "email_address": "Adres email",
        "signout": "Wyloguj się",
        "welcome_header": "Witaj jestem asystentem RAG",
        "quick_actions": "Szybkie akcje",
        "my_collections": "Moje kolekcje",
        "help_support": "Pomoc",
        "loading_info": "Ładuję dane użytkownika..."
      }
    },
    "toast": {
      "success": "Sukces",
      "general_error": "Coś poszło nie tak.",
      "sign_out": "Zostałeś wylogowany.",
      "sign_out_error": "Coś poszło nie tak.",
      "sign_in_invalid_creds": "Niepoprawne hasło lub email",
      "sign_in_success": "Logowanie zakończone powodzeniem.",
      "sign_up_passwords_not_match":  "Wpisane hasła nie są takie same.",
      "sign_up_password_too_weak": "Hasło jest zbyt słabe. Wpisz mocniejsze hasło.",
      "sign_up_success": "Konto zostało utworzone.",
      "collection_removed": "Kolekcja została usunięta.",
      "collection_remove_error": "Wystąpił problem z usunięciem kolekcji.",
      "collection_created": "Kolekcja została utworzona.",
      "settings_saved": "Ustawienia zostały zapisane."
    },
    "buttons" : {
      "settings": "Ustawienia",
      "new_collection": "Nowa kolekcja",
      "upload_document": "Prześlij dokument",
      "back": "Wstecz",
      "save_settings": "Zapisz ustawienia",
      "cancel": "Anuluj"
    },
    "modals": {
      "settings": "Ustawienia",
      "create_new_collection": "Utwórz Nową Kolekcję",
      "collection_name": "Nazwa kolekcji",
      "collection_description": "Opis",
      "collection_name_placeholder": "Wprowadź nazwę kolekcji",
      "collection_description_placeholder": "Wprowadź opis kolekcji (opcjonalnie)",
      "create_collection": "Utwórz kolekcję",
      "llm_configuration": "Konfiguracja LLM",
      "provider": "Dostawca",
      "model": "Model",
      "save_configuration": "Zapisz Konfigurację",
      "api_keys": "Klucze API",
      "enter_open_apikey": "Wpisz OpenAI API klucz",
      "enter_anthropic_key": "Wpisz Anthropic API klucz",
      "upload_button": "Wyślij",
      "supported_filetypes": "Możesz wysłać pliki PDF i TXT",
      "upload_file": "Wyślij plik",
      "add_text": "Dodaj tekst",
      "upload_title":  "Prześlij plik",
      "content_label": "Treść",
      "title_label": "Tytuł",
      "drop_help": "Upuść plik tutaj...",
      "drag_and_drop_help": "Przeciągnij i upuść plik pdf lub txt tutaj albo kliknij wybierz"
    }
  },
}

export const getDictionary = (locale: 'en' | 'pl' = 'pl') =>
dictionaries[locale]