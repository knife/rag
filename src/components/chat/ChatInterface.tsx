// src/components/chat/ChatInterface.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import { ChatMessage, Document } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Props {
    messages: ChatMessage[]
    onSendMessage: (message: string) => void
    documents: Document[]
    isLoading?: boolean
}

export function ChatInterface({ messages, onSendMessage, documents, isLoading = false }: Props) {
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(isLoading)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        if ((messages.length > 0) && messages[messages.length-1]?.role == 'assistant')  setIsTyping(false)
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        onSendMessage(input.trim())
        setInput('')
        setIsTyping(true)

        // Auto-resize textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    const adjustTextareaHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
        }
    }

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <Bot className="w-16 h-16 mb-4" />
                        <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
                        <p className="text-sm text-center max-w-md">
                            Ask questions about your documents. I'll search through them and provide relevant answers.
                        </p>
                        {documents.length === 0 && (
                            <p className="text-xs mt-4 text-amber-600">
                                Upload documents first to get started!
                            </p>
                        )}
                    </div>
                ) : (
                    <AnimatePresence>
                        {messages.map((message, index) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex max-w-3xl ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`flex-shrink-0 ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {message.role === 'user' ? (
                                                <User className="w-4 h-4" />
                                            ) : (
                                                <Bot className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Message Content */}
                                    <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                        <div className={`rounded-2xl px-4 py-3 max-w-full ${
                                            message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-white text-slate-900 border border-slate-200'
                                        }`}>
                                            <div className="prose prose-sm max-w-none">
                                                {message.role === 'user' ? (
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                ) : (
                                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                                )}
                                            </div>
                                        </div>

                                        {/* Sources */}
                                        {message.sources && message.sources.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {message.sources.map((sourceId, idx) => {
                                                    const doc = documents.find(d => d.id === sourceId)
                                                    if (!doc) return null

                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="flex items-center space-x-1 px-2 py-1 bg-slate-100 rounded-md text-xs text-slate-600"
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            <span>{doc.name}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )}

                                        {/* Timestamp */}
                                        <div className="mt-1 text-xs text-slate-400">
                                            {new Date(message.createdAt).toLocaleTimeString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="flex mr-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                                <Bot className="w-4 h-4 text-slate-600" />
                            </div>
                        </div>
                        <div className="bg-white rounded-2xl px-4 py-3 border border-slate-200">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 bg-white p-4">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                    <div className="flex-1 relative">
                        <Textarea
                            ref={textareaRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value)
                                adjustTextareaHeight()
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask a question about your documents..."
                            className="resize-none pr-12 min-h-[44px] max-h-[120px]"
                            disabled={isLoading || documents.length === 0}
                        />
                        <Button
                            type="submit"
                            size="sm"
                            disabled={!input.trim() || isLoading || documents.length === 0}
                            className="absolute right-2 top-2 h-8 w-8 p-0"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </form>

                {documents.length === 0 && (
                    <p className="text-xs text-amber-600 mt-2">
                        Upload documents to start chatting
                    </p>
                )}
            </div>
        </div>
    )
}