'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Mail, LogOut, Settings, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin')
        }
    }, [status, router])

    const handleLogout = async () => {
        setIsLoading(true)

        try {
            await signOut({
                redirect: false,
                callbackUrl: '/auth/signin'
            })

            toast({
                title: 'Success',
                description: 'Signed out successfully',
            })

            router.push('/auth/signin')
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong during sign out',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-600">Loading user information...</p>
                </div>
            </div>
        )
    }

    if (status === 'unauthenticated' || !session) {
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Navigation Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/collections"
                            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Collections
                        </Link>
                        <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Account Information
                        </h1>
                        <div></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12">
                        <div className="flex items-center space-x-6">
                            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-white" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-2">
                                    {session.user?.name || 'User Profile'}
                                </h2>
                                <p className="text-blue-100">
                                    Welcome to RAG Assistant
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* User Information */}
                    <div className="p-8 space-y-6">
                        <div className="grid gap-6">
                            {/* Email */}
                            <div className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-slate-900 mb-1">Email Address</h3>
                                    <p className="text-slate-600">
                                        {session.user?.email || 'No email provided'}
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3 pt-6 border-t">
                            <Button
                                onClick={handleLogout}
                                disabled={isLoading}
                                variant="destructive"
                                className="w-full justify-start"
                            >
                                {isLoading ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : (
                                    <LogOut className="w-4 h-4 mr-2" />
                                )}
                                Sign Out
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Additional Info Card */}
                <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
                    <h3 className="font-semibold text-slate-900 mb-3">Quick Actions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Link
                            href="/collections"
                            className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">My Collections</span>
                        </Link>

                        <Link
                            href="/help"
                            className="flex items-center p-3 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                        >
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <Settings className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm font-medium text-slate-700">Help & Support</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
