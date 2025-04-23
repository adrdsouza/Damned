import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Link from "next/link"

export default async function Footer() {
  // const { collections } = await listCollections({
  //   fields: "*products",
  // })
  const productCategories = await listCategories()
  

  return (
    <>
    <footer className="bg-cream pt-12 pb-6 px-[40px]  bg-[#f5f5f5] ">
  <div className="container-wide">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
      
      {/* Column 1: Brand Info */}
      <div>
        <h3 className="font-bold text-lg mb-4">Damned Designs</h3>
        <p className="text-gray-700 mb-4">
          Premium knives and EDC gear designed with passion and precision.
        </p>
        <div className="flex space-x-4">
          <Link
            href="https://instagram.com/damneddesigns"
            className="text-primary hover:text-gray-700"
            aria-label="Instagram"
             target="blank"
          >
            {/* Instagram Icon */}
            <svg width="20" height="20" stroke="currentColor" strokeWidth="2" className="lucide-icon lucide lucide-instagram" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </Link>
          <Link
            href="https://facebook.com/damneddesigns"
            className="text-primary hover:text-gray-700"
            aria-label="Facebook"
             target="blank"
          >
            {/* Facebook Icon */}
            <svg width="20" height="20" stroke="currentColor" strokeWidth="2" className="lucide-icon lucide lucide-facebook" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
            </svg>
          </Link>
          <Link
            href="https://twitter.com/damneddesigns"
            className="text-primary hover:text-gray-700"
            aria-label="Twitter"
             target="blank"
          >
            {/* Twitter Icon */}
            <svg width="20" height="20" stroke="currentColor" strokeWidth="2" className="lucide-icon lucide lucide-twitter" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </Link>
          <Link
            href="mailto:contact@damneddesigns.com"
            className="text-primary hover:text-gray-700"
            aria-label="Email"
            target="blank"
          >
            {/* Email Icon */}
            <svg width="20" height="20" stroke="currentColor" strokeWidth="2" className="lucide-icon lucide lucide-mail" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Column 2: Shop */}
      <div>
        <h3 className="font-bold text-lg mb-4">Shop</h3>
        <ul className="space-y-2">
          <li><Link href="/store" className="text-gray-700 hover:text-primary">All Products</Link></li>
          {productCategories?.slice(0, 5).map((c) => {

            return(
              <li  key={c.id}><Link    className={`${clx(
                                      "hover:text-ui-fg-base"
                                      
                                    )} text-gray-700 hover:text-primary`}
                                    href={`/categories/${c.handle}`}
                                    data-testid="category-link" >{c?.name}</Link></li>
            )

          })}
        
        </ul>
      </div>

      {/* Column 3: Company */}
      <div>
        <h3 className="font-bold text-lg mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link href="/about" className="text-gray-700 hover:text-primary">About Us</Link></li>
          <li><Link href="/contact" className="text-gray-700 hover:text-primary">Contact</Link></li>
        </ul>
      </div>

      {/* Column 4: Customer Service */}
      <div>
        <h3 className="font-bold text-lg mb-4">Customer Service</h3>
        <ul className="space-y-2">
          <li><a href="/privacy-policy#returns-Shipping" className="text-gray-700 hover:text-primary">Shipping &amp; Returns</a></li>
          <li><a href="/support#faq" className="text-gray-700 hover:text-primary">FAQ</a></li>
          <li><a href="/support#warranty" className="text-gray-700 hover:text-primary">Warranty</a></li>
          <li><Link href="/privacy-policy" className="text-gray-700 hover:text-primary">Privacy Policy</Link></li>
          <li><Link href="/terms-and-conditions" className="text-gray-700 hover:text-primary">Terms and Conditions</Link></li>
        </ul>
      </div>
    </div>

    {/* Bottom Footer Text */}
    <div className="border-t border-gray-200 pt-6 text-center text-gray-600 text-sm">
      <p>© 2025 Damned Designs. All rights reserved.</p>
    </div>
  </div>
</footer>




      {/* // <footer className="border-t border-ui-border-base w-full">
    //   <div className="content-container flex flex-col w-full">
    //     <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-40">
    //       <div>
    //         <LocalizedClientLink
    //           href="/"
    //           className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
    //         >
    //           Damned Designs
    //         </LocalizedClientLink>
    //       </div>
    //       <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
    //         {productCategories && productCategories?.length > 0 && (
    //           <div className="flex flex-col gap-y-2">
    //             <span className="txt-small-plus txt-ui-fg-base">
    //               Categories
    //             </span>
    //             <ul
    //               className="grid grid-cols-1 gap-2"
    //               data-testid="footer-categories"
    //             >
    //               {productCategories?.slice(0, 6).map((c) => {
    //                 if (c.parent_category) {
    //                   return
    //                 }

    //                 const children =
    //                   c.category_children?.map((child) => ({
    //                     name: child.name,
    //                     handle: child.handle,
    //                     id: child.id,
    //                   })) || null

    //                 return (
    //                   <li
    //                     className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
    //                     key={c.id}
    //                   >
    //                     <LocalizedClientLink
    //                       className={clx(
    //                         "hover:text-ui-fg-base",
    //                         children && "txt-small-plus"
    //                       )}
    //                       href={`/categories/${c.handle}`}
    //                       data-testid="category-link"
    //                     >
    //                       {c.name}
    //                     </LocalizedClientLink>
    //                     {children && (
    //                       <ul className="grid grid-cols-1 ml-3 gap-2">
    //                         {children &&
    //                           children.map((child) => (
    //                             <li key={child.id}>
    //                               <LocalizedClientLink
    //                                 className="hover:text-ui-fg-base"
    //                                 href={`/categories/${child.handle}`}
    //                                 data-testid="category-link"
    //                               >
    //                                 {child.name}
    //                               </LocalizedClientLink>
    //                             </li>
    //                           ))}
    //                       </ul>
    //                     )}
    //                   </li>
    //                 )
    //               })}
    //             </ul>
    //           </div>
    //         )}
    //         {collections && collections.length > 0 && (
    //           <div className="flex flex-col gap-y-2">
    //             <span className="txt-small-plus txt-ui-fg-base">
    //               Collections
    //             </span>
    //             <ul
    //               className={clx(
    //                 "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
    //                 {
    //                   "grid-cols-2": (collections?.length || 0) > 3,
    //                 }
    //               )}
    //             >
    //               {collections?.slice(0, 6).map((c) => (
    //                 <li key={c.id}>
    //                   <LocalizedClientLink
    //                     className="hover:text-ui-fg-base"
    //                     href={`/collections/${c.handle}`}
    //                   >
    //                     {c.title}
    //                   </LocalizedClientLink>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         )}
    //         <div className="flex flex-col gap-y-2">
    //           <span className="txt-small-plus txt-ui-fg-base">Medusa</span>
    //           <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
    //             <li>
    //               <a
    //                 href="https://github.com/medusajs"
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="hover:text-ui-fg-base"
    //               >
    //                 GitHub
    //               </a>
    //             </li>
    //             <li>
    //               <a
    //                 href="https://docs.medusajs.com"
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="hover:text-ui-fg-base"
    //               >
    //                 Documentation
    //               </a>
    //             </li>
    //             <li>
    //               <a
    //                 href="https://github.com/medusajs/nextjs-starter-medusa"
    //                 target="_blank"
    //                 rel="noreferrer"
    //                 className="hover:text-ui-fg-base"
    //               >
    //                 Source code
    //               </a>
    //             </li>
    //           </ul>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
    //       <Text className="txt-compact-small">
    //         © {new Date().getFullYear()} Damned Designs. All rights reserved.
    //       </Text>
    //       <MedusaCTA />
    //     </div>
    //   </div>
    // </footer> */}

    </>
  )
}
