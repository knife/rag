import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { LLMProvider } from '@/components/llm/LLMProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'RAG App - Document Chat Assistant',
    description: 'Chat with your documents using AI',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <AuthProvider>
            <LLMProvider>
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                    {children}
                </div>
                <Toaster />
            </LLMProvider>
        </AuthProvider>
        </body>
        </html>
    )
}


