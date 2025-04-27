"use client"
import { useState } from "react"
import Link from "next/link";

import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import ContactDropdown from "@modules/NowComponents/NavDropDown"
import Image from "next/image"
import { IoSearchSharp } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { MdMenu } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";

export default  function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchModal,setSearchModal] = useState(false);
  const [searchText,setSearchText] = useState("");
  const router=useRouter();
  let openSeachModal=()=>{
    setIsOpen(false) 
    setSearchModal(true) 

  }
  const closeSeachModal=()=>{
    setSearchModal(false) 

  }
  return (
    <div className="sticky top-0 inset-x-0 z-50 group ">
      <header className="relative h-16 mx-auto border-b duration-200 bg-white border-ui-border-base mannavbar">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center">
            <Link href="/" className="h-full flex justify-center items-center">
  <Image src={"/Logo.svg"} alt="logo" height={40} width={40} />
            </Link>
       

          </div>

          <div className="flex items-center h-full hidden md:flex">
            <LocalizedClientLink
              href="/store"
              className="txt-compact-xlarge-plus text-ui-fg-base  font-semibold me-2"
              data-testid="nav-store-link"
            >
              Shop
            </LocalizedClientLink>
          
            <ContactDropdown/>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
          <div className="hidden md:flex items-center space-x-4">
        <IoSearchSharp size={24} className="icon-thick cursor-pointer
"  onClick={openSeachModal}/>
<Link href="/account">
        <FiUser size={24} className="icon-thick" />
</Link>
      </div>

      {/* Shown on small screens (<992px) */}
      <div className="flex md:hidden cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <MdMenu size={28} />
      </div>
            {/* <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div> */}
            {/* <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense> */}

{searchModal && (
  <div className="absolute right-0 top-[-5px] w-full w-48 bg-white shadow-lg border rounded-md z-50 ">
    <ul className="flex flex-col p-4 space-y-2">
      <li  className="block font-medium text-xl py-2 text-black hover:text-gray-600 transition-colors flex justify-between">
       <div>
        
      Search Products
       </div>
       <div>
       <RxCross2 onClick={closeSeachModal}/>

       </div>
    
      </li>
  
      <li>
      <div className="relative">
      <input 
    type="text" 
    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" 
    placeholder="Search For Products..." 
    value={searchText}
    onChange={(e)=>setSearchText(e?.target?.value)}
    onKeyDown={(e)=>{
      if(e.key=="Enter"){

        router.push(`/store?s=${searchText}`);
        setSearchText("");
        setSearchModal(false)
      }
      }}
  />
 <IoSearchSharp 
    size={24} 
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 
"
  />
</div>

      </li>
 
    </ul>
  </div>
)}

{isOpen && (
  <div className="absolute right-0 top-[54px]  w-full mt-2 w-48 bg-white shadow-lg border rounded-md z-50 lg:hidden">
    <ul className="flex flex-col p-4 space-y-2">
      <li>
        <Link
          href="/store"
          className="block font-semibold text-xl py-2 text-black hover:text-gray-600 transition-colors"
        >
          Shop
        </Link>
      </li>
      <li>
        <Link
          href="/about"
          className="block text-xl font-semibold py-2 text-black hover:text-gray-600 transition-colors"
        >
          About Us
        </Link>
      </li>
      <li>
        <Link
          href="/support"
          className="block font-semibold text-xl py-2 text-black hover:text-gray-600 transition-colors"
        >
          Support
        </Link>
      </li>
      <hr className="my-2" />
      <li className="flex items-center space-x-4 px-2">
        <IoSearchSharp size={20} className="cursor-pointer text-black" onClick={openSeachModal}/>
        <Link href="/account">
        <FiUser size={20} className="cursor-pointer text-black" />
        </Link>
      </li>
    </ul>
  </div>
)}

          </div>
        </nav>
      </header>
    </div>
  )
}
