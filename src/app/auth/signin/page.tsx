import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import SignInForm from "@/components/SignInForm"
import SignInButton from "@/components/SignInButton"
import Link from "next/link"
import Image from "next/image"

export default async function SignInPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/")
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image Section */}
            <div className="hidden lg:block lg:w-1/2 fixed left-0 h-screen">
                <Image
                    src="https://images.unsplash.com/photo-1579403124614-197f69d8187b"
                    alt="Authentication background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 backdrop-blur-[2px]"></div>
            </div>

            {/* Right Side - Sign In Form */}
            <div className="flex-1 min-h-screen overflow-y-auto lg:ml-[50%]">
                <div className="flex items-center justify-center p-8 sm:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <Image
                                src="/vercel.svg"
                                alt="Logo"
                                width={60}
                                height={60}
                                className="mx-auto mb-4"
                            />
                            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Please sign in to your account
                            </p>
                        </div>

                        <div className="mt-8">
                            <SignInForm />
                        </div>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <SignInButton mode="signin" />
                        </div>

                        <div className="mt-6 flex flex-col space-y-4 text-center text-sm">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                                    Sign up
                                </Link>
                            </p>
                            <Link 
                                href="/auth/forgot-password" 
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 