"use client"

import { useState } from "react"
import { RadioGroup } from "@headlessui/react"
import { CreditCard } from "@medusajs/icons"
import { Text } from "@medusajs/ui"

export default function TestPayment() {
  const [selected, setSelected] = useState("pp_system_default")

  return (
    <div className="w-full max-w-md mx-auto bg-white p-4 border">
      <h2 className="text-xl font-bold mb-4">Test Payment Options</h2>
      
      <RadioGroup value={selected} onChange={setSelected}>
        <div className="space-y-3">
          <RadioGroup.Option 
            value="pp_system_default"
            className={({ checked }) => 
              `flex cursor-pointer p-4 border rounded-md ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`
            }
          >
            {({ checked }) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-3">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${checked ? 'border-blue-500' : 'border-gray-300'}`}>
                    {checked && <div className="h-3 w-3 rounded-full bg-blue-500" />}
                  </div>
                  <Text>Manual Payment</Text>
                </div>
                <CreditCard />
              </div>
            )}
          </RadioGroup.Option>
          
          <RadioGroup.Option 
            value="pp_nmi_nmi"
            className={({ checked }) => 
              `flex cursor-pointer p-4 border rounded-md ${checked ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`
            }
          >
            {({ checked }) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-x-3">
                  <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${checked ? 'border-blue-500' : 'border-gray-300'}`}>
                    {checked && <div className="h-3 w-3 rounded-full bg-blue-500" />}
                  </div>
                  <Text>Credit Card (NMI)</Text>
                </div>
                <CreditCard />
              </div>
            )}
          </RadioGroup.Option>
        </div>
      </RadioGroup>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <pre>Selected: {selected}</pre>
      </div>
    </div>
  )
}