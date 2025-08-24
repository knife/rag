
import 'tailwindcss';
import './globals.css'
import '@radix-ui/themes/styles.css'


import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Theme, Container } from '@radix-ui/themes'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { LLMProvider } from '@/components/llm/LLMProvider'
import {Toaster, ToastProvider, useToast} from '@/components/ui/toaster'

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
                <Theme>
                        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                                <Toaster></Toaster>
                            {children}
                        </div>
                </Theme>
            </LLMProvider>
        </AuthProvider>
        </body>
        </html>
    )
}


