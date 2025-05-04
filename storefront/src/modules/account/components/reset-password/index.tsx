"use client"

import { useState } from "react"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { sdk } from "@lib/config"
import { resetPassword } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const ResetPassword = ({ setCurrentView }: Props) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) {
      setError("Email is required")
      return
    }
    setLoading(true)
    setError(null)

    try {
      let res:any=await resetPassword(email);
      
      if(res?.success){

        setSuccess(true)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during the password reset request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center bg-white p-8 rounded-lg shadow-md"
      data-testid="reset-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">Reset Password</h1>
      {!success ? (
        <>
          <p className="text-center text-base-regular text-ui-fg-base mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full gap-y-2">
              <Input
                label="Email"
                name="email"
                type="email"
                title="Enter a valid email address."
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="reset-email-input"
              />
            </div>
            {error && <ErrorMessage error={error} data-testid="reset-error-message" />}
            <SubmitButton 
              data-testid="reset-button" 
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Processing..." : "Request Password Reset"}
            </SubmitButton>
          </form>
        </>
      ) : (
        <div className="text-center">
          <p className="text-base-regular text-ui-fg-base mb-4">
            If an account exists with the email <strong>{email}</strong>, you will receive instructions to reset your password.
          </p>
          <p className="text-base-regular text-ui-fg-base mb-8">
            Please check your email inbox and spam folder.
          </p>
        </div>
      )}
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        Remember your password?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
          data-testid="back-to-login-button"
        >
          Back to login
        </button>
      </span>
    </div>
  )
}

export default ResetPassword
