import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"
import ForgotPasswordForm from "@/components/ForgotPasswordForm"

export default async function ForgotPasswordPage() {
    const session = await getServerSession(authOptions)

    if (session) {
        redirect("/")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-2">
            <div className="flex flex-col items-center mt-10 p-10 shadow-md">
                <h1 className="mb-4 text-4xl font-bold">Forgot Password</h1>
                
                <ForgotPasswordForm />
                
                <p className="mt-4 text-center text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link href="/auth/signin" className="text-blue-500 hover:text-blue-700">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    )
} 