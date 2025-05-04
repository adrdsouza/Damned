"use client"

import { Heading } from "@medusajs/ui"
import ResetPasswordForm from "./reset-password-form"

export default function ResetPasswordPage() {
  return (
    <div className="w-full flex justify-center py-24">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="flex flex-col items-center mb-8">
          <Heading level="h1" className="text-2xl mb-2 text-center">
            Reset Your Password
          </Heading>
          <p className="text-center text-ui-fg-base">
            Enter your new password below to complete the password reset process.
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}
