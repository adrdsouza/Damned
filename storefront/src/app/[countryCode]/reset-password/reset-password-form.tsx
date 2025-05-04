"use client"

import { useMemo, useState } from "react"
import Input from "@modules/common/components/input"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import ErrorMessage from "@modules/checkout/components/error-message"
import { useRouter } from "next/navigation"
import { sdk } from "@lib/config"
import { updatePassword } from "@lib/data/customer"

export default function ResetPasswordForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Get URL parameters
  const searchParams = useMemo(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams()
    }
    return new URLSearchParams(window.location.search)
  }, [])

  const token = useMemo(() => {
    return searchParams.get("token")
  }, [searchParams])

  const email = useMemo(() => {
    return searchParams.get("email")
  }, [searchParams])

  // Validate that we have the required parameters
  const isValidRequest = useMemo(() => {
    return !!token && !!email
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate form
    if (!isValidRequest) {
      setError("Invalid password reset link. Please request a new password reset link.")
      return
    }

    if (!password) {
      setError("Password is required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)
    setError(null)
console.log(token,"sdfasdfassfasdfasd");

    try {
let res=await updatePassword(email,password,token)
console.log(res,"sdfsdgsdfgs");

if(res?.success){
  setSuccess(true)

  // Redirect to login page after 3 seconds
  setTimeout(() => {
    router.push("/account/login")
  }, 3000)
}else{
  setError( "An error occurred while resetting your password. Please try again.")

}
   

    } catch (err: any) {
      setError(err.message || "An error occurred while resetting your password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isValidRequest) {
    return (
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div className="text-center text-ui-fg-base">
          <p className="mb-4">
            Invalid password reset link. The link may have expired or been used already.
          </p>
          <p className="mb-6">
            Please request a new password reset link from the login page.
          </p>
          <button
            onClick={() => router.push("/account/login")}
            className="w-full bg-ui-button-primary text-ui-button-text py-3 px-4 rounded-lg"
          >
            Back to Login
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div className="text-center text-ui-fg-base">
          <h2 className="text-xl font-semibold text-ui-fg-base mb-4">Password Reset Successful!</h2>
          <p className="mb-4">
            Your password has been successfully reset.
          </p>
          <p className="mb-6">
            You will be redirected to the login page in a few seconds...
          </p>
          <button
            onClick={() => router.push("/account/login")}
            className="w-full bg-ui-button-primary text-ui-button-text py-3 px-4 rounded-lg"
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-y-4">
          <Input
            label="New Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
          />
          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
          />
          {error && <ErrorMessage error={error} />}
          <SubmitButton className="w-full mt-2" disabled={loading}>
            {loading ? "Processing..." : "Reset Password"}
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
