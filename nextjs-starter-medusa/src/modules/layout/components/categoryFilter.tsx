"use client"
import React, { useCallback, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export default function CategoryFilter({productCategories,searchCategoryId}:any) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [search,setSearch]=useState("");
  const createQueryString = useCallback(
      (name: string, value: string) => {
        const params = new URLSearchParams(searchParams)
        params.set(name, value)
  
        return params.toString()
      },
      [searchParams]
    )
  
  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }
  return (
   
   
           <div className="flex flex-col md:flex-row justify-between gap-6 mb-4">
     {/* Filter Buttons */}
     <div className="flex flex-wrap gap-2">
       <button onClick={()=>setQueryParams("category","")} className={`px-4 py-2 rounded-full border ${searchCategoryId?"bg-white text-black ":"bg-black text-white "} border-primary`}>
         All Products
       </button>
       {productCategories && productCategories?.map((c:any)=>{
   return(
     <button key={c.id} onClick={()=>setQueryParams("category",c.handle)} className={`px-4 py-2 rounded-full border ${searchCategoryId==c.id?"bg-black text-white ":"bg-white text-black "}text-primary border-gray-300 hover:bg-gray-100`}>
         {c?.name}
       </button>
   )
       })}
     
     </div>
   
     {/* Search Input */}
     <div className="relative">
       <input
         type="text"
         placeholder="Search products..."
         className="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
         value={search}
         onChange={(e)=>setSearch(e?.target?.value)}
         onKeyDown={(e)=>{
            if(e.key=="Enter")
           setQueryParams("s",search);
           
            }
        }
       />
       <div className="absolute left-3 top-[22px] transform -translate-y-1/2 text-gray-400">
         <svg
           xmlns="http://www.w3.org/2000/svg"
           width="18"
           height="18"
           viewBox="0 0 24 24"
           fill="none"
           stroke="currentColor"
           strokeWidth="2"
           strokeLinecap="round"
           strokeLinejoin="round"
           className="lucide-icon lucide lucide-search"
         >
           <circle cx="11" cy="11" r="8"></circle>
           <path d="m21 21-4.3-4.3"></path>
         </svg>
       </div>
     </div>
   </div>
   
  )
}
