import { retrieveCart } from '@lib/data/cart'
import { retrieveCustomer } from '@lib/data/customer'
import React from 'react'
import SideCartTemplate from './sideCartTemplate'

export default async function SideCart() {

     const cart = await retrieveCart().catch((error) => {
        console.error(error)
        
      })
    
      const customer = await retrieveCustomer()
    
 
  return (
   <SideCartTemplate cart={cart} customer={customer}/>
  )
}
