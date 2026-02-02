'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, UserPlus, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {getDictionary} from "@/app/dict";

interface PasswordStrength {
    score: number
    label: string
    color: string
    requirements: {
        length: boolean
        uppercase: boolean
        lowercase: boolean
        number: boolean
        special: boolean
    }
}

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const dict = getDictionary('pl')

    const calculatePasswordStrength = (password: string): PasswordStrength => {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        }

        const score = Object.values(requirements).filter(Boolean).length

        let label = ''
        let color = ''

        switch (score) {
            case 0:
            case 1:
                label = dict.pages.sign_up.score.very_weak
                color = 'bg-red-500'
                break
            case 2:
                label = dict.pages.sign_up.score.weak
                color = 'bg-orange-500'
                break
            case 3:
                label = dict.pages.sign_up.score.fair
                color = 'bg-yellow-500'
                break
            case 4:
                label = dict.pages.sign_up.score.good
                color = 'bg-blue-500'
                break
            case 5:
                label = dict.pages.sign_up.score.strong
                color = 'bg-green-500'
                break
            default:
                label = ''
                color = 'bg-gray-300'
        }

        return { score, label, color, requirements }
    }

    const passwordStrength = calculatePasswordStrength(password)
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: 'Error',
                description: dict.toast.sign_up_passwords_not_match,
                variant: 'destructive',
            })
            return
        }

        if (passwordStrength.score < 3) {
            toast({
                title: 'Error',
                description: dict.toast.sign_up_password_too_weak,
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)

        try {
            // Replace with your actual signup API call
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            })

            if (response.ok) {
                toast({
                    title: dict.toast.success,
                    description: dict.toast.sign_up_success,
                })

                // Automatically sign in after successful signup
                const result = await signIn('credentials', {
                    email,
                    password,
                    redirect: false,
                })

                if (!result?.error) {
                    router.push('/collections')
                    router.refresh()
                }
            } else {
                const data = await response.json()
                toast({
                    title: 'Error',
                    description: data.error || dict.toast.general_error,
                    variant: 'destructive',
                })
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: dict.toast.general_error,
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            {dict.app.full_name}
                        </h1>
                        <p className="text-slate-600">{dict.pages.sign_up.title }</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                                {dict.pages.sign_up.email}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={dict.pages.sign_up.email_placeholder}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                                {dict.pages.sign_up.password}
                            </label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={dict.pages.sign_up.password_placeholder}
                                    required
                                    disabled={isLoading}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-slate-600">{dict.pages.sign_up.password_strength}</span>
                                        <span className="text-sm font-medium">{passwordStrength.label}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                        />
                                    </div>

                                    {/* Password Requirements */}
                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                        <div className={`flex items-center ${passwordStrength.requirements.length ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.requirements.length ? (
                                                <Check className="w-3 h-3 mr-1" />
                                            ) : (
                                                <X className="w-3 h-3 mr-1" />
                                            )}
                                            {dict.pages.sign_up.reqs.length}
                                        </div>
                                        <div className={`flex items-center ${passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.requirements.uppercase ? (
                                                <Check className="w-3 h-3 mr-1" />
                                            ) : (
                                                <X className="w-3 h-3 mr-1" />
                                            )}
                                            {dict.pages.sign_up.reqs.uppercase}
                                        </div>
                                        <div className={`flex items-center ${passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.requirements.lowercase ? (
                                                <Check className="w-3 h-3 mr-1" />
                                            ) : (
                                                <X className="w-3 h-3 mr-1" />
                                            )}
                                            {dict.pages.sign_up.reqs.lowercase}
                                        </div>
                                        <div className={`flex items-center ${passwordStrength.requirements.number ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.requirements.number ? (
                                                <Check className="w-3 h-3 mr-1" />
                                            ) : (
                                                <X className="w-3 h-3 mr-1" />
                                            )}
                                            {dict.pages.sign_up.reqs.number}
                                        </div>
                                        <div className={`flex items-center ${passwordStrength.requirements.special ? 'text-green-600' : 'text-slate-400'}`}>
                                            {passwordStrength.requirements.special ? (
                                                <Check className="w-3 h-3 mr-1" />
                                            ) : (
                                                <X className="w-3 h-3 mr-1" />
                                            )}
                                            {dict.pages.sign_up.reqs.special_character}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                                {dict.pages.sign_up.confirm_password}
                            </label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={dict.pages.sign_up.password_confirmation_placeholder}
                                    required
                                    disabled={isLoading}
                                    className={`pr-10 ${
                                        confirmPassword && !passwordsMatch
                                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                                            : confirmPassword && passwordsMatch
                                                ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
                                                : ''
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="mt-1 text-sm text-red-600">{dict.pages.sign_up.password_dont_match} </p>
                            )}
                            {confirmPassword && passwordsMatch && (
                                <p className="mt-1 text-sm text-green-600">{dict.pages.sign_up.password_match}</p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={isLoading || !passwordsMatch || passwordStrength.score < 3}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            ) : (
                                <UserPlus className="w-4 h-4 mr-2" />
                            )}
                            {dict.pages.sign_up.create_account}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            {dict.pages.sign_up.already_have_account}{' '}
                            <Link
                                href="/auth/signin"
                                className="font-medium text-blue-600 hover:text-blue-500"
                            >
                                {dict.pages.sign_up.sign_in}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}