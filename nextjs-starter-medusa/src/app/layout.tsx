import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "styles/globals.css"
import "styles/navbar.css"


export const metadata: Metadata = {
  title: "Damned Designs",
  description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
  keywords: [
    "Damned Designs",
    "About Damned Designs",
    "EDC tools",
    "premium knives",
    "Adrian D'Souza",
    "knife craftsmanship",
    "custom knives",
    "EDC gear",
    "knife design",
  ],
  authors: [{ name: "Adrian D'Souza" }],
  creator: "Damned Designs",
  publisher: "Damned Designs",
  openGraph: {
    title: " Damned Designs - Premium Knives & EDC Tools",
    description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
    url: `${new URL(getBaseURL())}`,
    siteName: "Damned Designs",
    images: [
      {
        url: `${new URL(getBaseURL())}/assets/Damned-designs.jpeg`,
        width: 1200,
        height: 630,
        alt: "Inside Damned Designs Workshop",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Damned Designs - Premium EDC Tools",
    description:"Learn about Damned Designs, our mission, values, and the story behind our premium knives and EDC gear.",
    images: [`${new URL(getBaseURL())}/assets/Damned-designs.jpeg`],
    creator: "@damneddesigns", 
  },
  metadataBase: new URL(getBaseURL()),

  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', rel: 'shortcut icon' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
