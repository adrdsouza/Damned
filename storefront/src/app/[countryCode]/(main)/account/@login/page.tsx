import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Login | Damned Designs",
  description: "Log in to your Damned Designs account to view orders, manage your profile, and more.",
}

export default function Login() {
  return <LoginTemplate />
}
