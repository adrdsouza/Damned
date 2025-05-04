import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import HomePage from "@modules/home/components/NewHome"
import { getBaseURL } from "@lib/util/env"

// app/about-us/page.tsx or app/about/page.tsx (depending on your route)

export const metadata: Metadata = {
  title: "Damned Designs - Premium Knives & EDC Gear",
  description:
    "Discover premium knives and EDC gear at Damned Designs. Exceptional craftsmanship, innovative designs, and superior materials for enthusiasts and collectors.",
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
    title: "Damned Designs - Premium Knives & EDC Tools",
    description:
      "Discover premium knives and EDC gear at Damned Designs. Exceptional craftsmanship, innovative designs, and superior materials for enthusiasts and collectors.",
    url: new URL(getBaseURL()),
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
    description:
      "Founded by Adrian D'Souza, Damned Designs is built on quality, craftsmanship, and innovation in the world of everyday carry.",
    images: [`${new URL(getBaseURL())}/assets/Damned-designs.jpeg`],
    creator: "@damneddesigns", 
  },
  metadataBase: new URL(getBaseURL()),

};


export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
    <HomePage/>
      {/* <Hero />
      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
    </>
  )
}
