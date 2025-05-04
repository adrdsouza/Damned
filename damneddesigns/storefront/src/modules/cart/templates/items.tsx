"use client"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import DiscountCode from "@modules/checkout/components/discount-code"
import Spinner from "@modules/common/icons/spinner"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import Image from "next/image"
import { useState } from "react"

function NewItemDesign({item,currencyCode}:any) {

  const { total, original_total } = item;
  const initialImage = item?.thumbnail || item.variant?.product?.images?.[0]?.url  
   const [updating, setUpdating] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const currentPrice = total
   const changeQuantity = async (quantity: number) => {
    if(quantity==0) return
      setError(null)
      setUpdating(true)
  
      await updateLineItem({
        lineId: item.id,
        quantity,
      })
        .catch((err) => {
          setError(err.message)
        })
        .finally(() => {
          setUpdating(false)
        })
    }
    
      const handleDelete = async (id: string) => {
        setIsDeleting(true)
        await deleteLineItem(id).catch((err) => {
          setIsDeleting(false)
        })
      }
  return (
  <>
        <div className="flex">
      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={initialImage}
          alt={item?.product_title || "Product Image"}
          width={64}
          height={64}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-3 flex-grow">
        <div className="flex justify-between">
          <h4 className="font-bold text-sm">{item?.product_title}</h4>
          <p className="font-bold text-green-600 text-sm">
            {convertToLocale({
              amount: currentPrice,
              currency_code: currencyCode,
            })}
          </p>
        </div>
        <p className="text-xs text-gray-600">{item?.variant?.title}</p>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => changeQuantity(item?.quantity - 1)}
              className="px-2 py-1 border-r border-gray-300 pointer-events-auto"
              disabled={item?.quantity <= 0}
              aria-label="Decrease quantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide-icon lucide lucide-minus"
              >
                <path d="M5 12h14" />
              </svg>
            </button>
            <span className="px-3 py-1">{item?.quantity}</span>
            <button
              onClick={() => changeQuantity(item?.quantity + 1)}
              className="px-2 py-1 border-l border-gray-300 pointer-events-auto"
              aria-label="Increase quantity"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide-icon lucide lucide-plus"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
            </button>
          </div>
          <button
            className="text-red-500 hover:text-red-700 transition-colors pointer-events-auto"
            aria-label="Remove item"
            onClick={()=>handleDelete(item?.id)}
          >
              {isDeleting ? <Spinner className="animate-spin" /> :
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
              className="lucide-icon lucide lucide-trash-2"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>}
          </button>
        </div>
      </div>
    </div>
      </>
  )

}

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  const {
    currency_code,
    total,
    item_total,
  
    shipping_subtotal,
  } = cart
  console.log(cart,"asdfasdfasdfasdfsd");
  
  return (
    <>
     <h3 className="font-bold mb-4 text-lg">
      Your items
     </h3>
      <div className="space-y-4 divide-y divide-gray-200 flex-grow overflow-y-auto scroll-custom">

    
      <div className="pt-4 first:pt-0 ">
      {items
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <NewItemDesign
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
 </div>
 </div>
 <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50">
 
  <DiscountCode cart={cart}/>
  <div className="space-y-2">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span> {convertToLocale({ amount: item_total ?? 0, currency_code })}</span>
    </div>
    <div className="flex justify-between">
      <span>Shipping</span>
      <span>{convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}</span>
    </div>
    <div className="border-t border-gray-200 pt-3 flex justify-between font-bold">
      <span>Total</span>
      <span>  {convertToLocale({ amount: total ?? 0, currency_code })}</span>
    </div>
  </div>
</div>

      {/* <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="text-ui-fg-subtle txt-medium-plus">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items
            ? items
              .sort((a, b) => {
                return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
              })
              .map((item) => {
                return (
                  <Item
                    key={item.id}
                    item={item}
                    currencyCode={cart?.currency_code}
                  />
                )
              })
            : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
        </Table.Body>
      </Table> */}
    </>
  )
}

export default ItemsTemplate
