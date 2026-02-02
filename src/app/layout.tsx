import 'tailwindcss';
import './globals.css'
import '@radix-ui/themes/styles.css'


import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {Theme} from '@radix-ui/themes'
import {AuthProvider} from '@/components/auth/AuthProvider'
import {LLMProvider} from '@/components/llm/LLMProvider'
import {Toaster} from '@/components/ui/toaster'
import {getDictionary} from "@/app/dict";

const inter = Inter({subsets: ['latin']})
const dict = getDictionary('pl')

export const metadata: Metadata = {
    title: dict.app.metadata.title,
    description: dict.app.metadata.description
}


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="pl">
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
