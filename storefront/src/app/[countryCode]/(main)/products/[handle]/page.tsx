import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import ProductTemplate from "@modules/products/templates"

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const products = await listProducts({
      countryCode: "US",
      queryParams: { fields: "handle" },
    }).then(({ response }) => response.products)

    return countryCodes
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Damned Designs`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Damned Designs`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  try {
    const params = await props.params
    const region = await getRegion(params.countryCode)

    if (!region) {
      notFound()
    }

    // Add error handling around product fetching
    try {
      const { response } = await listProducts({
        countryCode: params.countryCode,
        queryParams: { handle: params.handle },
      });
      
      const pricedProduct = response.products[0];

      if (!pricedProduct) {
        notFound()
      }

      return (
        <ProductTemplate
          product={pricedProduct}
          region={region}
          countryCode={params.countryCode}
        />
      );
    } catch (productError) {
      console.error("Error fetching product data:", productError);
      
      // Return a graceful error component instead of throwing a 500 error
      return (
        <div className="content-container flex flex-col items-center justify-center py-32">
          <h1 className="text-2xl font-bold mb-4">Product Unavailable</h1>
          <p className="text-center mb-8">
            We're having trouble loading this product right now. Please try again later.
          </p>
          <a 
            href={`/${params.countryCode}`} 
            className="btn btn-primary px-8 py-4 bg-black text-white rounded-md"
          >
            Return to home
          </a>
        </div>
      );
    }
  } catch (error) {
    console.error("Error in product page:", error);
    return (
      <div className="content-container flex flex-col items-center justify-center py-32">
        <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
        <p className="text-center">
          We're having trouble displaying this page. Please try again later.
        </p>
      </div>
    );
  }
}
