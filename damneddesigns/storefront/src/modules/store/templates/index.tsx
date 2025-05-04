import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import CategoryFilter from "@modules/layout/components/categoryFilter"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  productCategories,
  searchCategoryId,
  seachText
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string,
  productCategories:any,
  searchCategoryId?:string,
  seachText?:string | null

}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  
  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 sm:px-[60px] content-container"
      data-testid="category-container"
    >
      {/* <RefinementList sortBy={sort} /> */}
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title " className="text-center
">Our products</h1>

        </div>

<CategoryFilter searchCategoryId={searchCategoryId} productCategories={productCategories}/>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            {...(searchCategoryId ? { categoryId: searchCategoryId } : {})}
            seachText = {seachText?seachText:'' }

          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
