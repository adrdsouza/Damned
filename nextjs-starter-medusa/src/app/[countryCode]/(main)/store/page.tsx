import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { getCategoryByHandle, listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string,
    category?:string,
    s?:string

  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page ,category,s:seachText} = searchParams
  const productCategories = await listCategories();
   let searchCategoryId=category ?productCategories?.find((c)=>c.handle==category)?.id:undefined;
  

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      productCategories={productCategories}
      searchCategoryId={searchCategoryId}
      seachText={seachText}
    />
  )
}
