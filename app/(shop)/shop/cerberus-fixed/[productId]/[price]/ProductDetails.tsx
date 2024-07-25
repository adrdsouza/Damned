"use client";

import { useState } from "react";
import { ProductInfo } from "@/lib/graphql/type";
import { useGood } from "@/components/context/GoodContext";

interface ProductDetailsProps {
  productInfo: ProductInfo;
  price: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  productInfo,
  price,
}) => {
  const { good, setGood } = useGood();
  const [type, setType] = useState<any>();

  const handleGood = () => {
    good
      ? good.filter((g) => g.name == productInfo.name).length < 1
        ? setGood([
            ...(good || []),
            {
              name: productInfo.name,
              price: productInfo.price ? productInfo.price : "",
            },
          ])
        : alert("Already added")
      : setGood([
          {
            name: productInfo.name,
            price: productInfo.price ? productInfo.price : "",
          },
        ]);
  };

  return (
    <>
      <p className="text-3xl fond-semibold uppercase">{productInfo.name}</p>
      <div className="flex flex-col">
        <p className="text-xl">{productInfo.price}</p>
        <p>or 4 interest-free payments with</p>
      </div>
      <div className="flex flex-col text-sm font-semibold">
        <fieldset>
          <legend className="sr-only">Countries</legend>

          {productInfo.attributes.edges[0].node.options.map((option, index) => (
            <div className="flex items-center mb-4" key={index}>
              <input
                id={`country-option-${index}`}
                type="radio"
                name="countries"
                value={option}
                onClick={() => setType(option)}
                className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-stone-300 dark:focus:ring-stone-600 dark:focus:bg-stone-600 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor={`country-option-${index}`}
                className="block ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                <div className="flex flex-col">
                  <span>{option}</span>
                  <span>{price}</span>
                </div>
              </label>
            </div>
          ))}
        </fieldset>
      </div>

      {type && (
        <div className="py-1 gap-1">
          <p>
            Join the waitlist to be emailed when this product becomes available
          </p>
          <div className="flex flex-col w-1/4 gap-1">
            <input
              type="email"
              name=""
              id=""
              className="border border-stone-300 px-2 py-1 text-slate-600 focus:outline-none"
              placeholder="Email Address"
            />
            <button className="px-5 py-2 bg-stone-400 uppercase text-white text-xl hover:bg-stone-300">
              JOIN WAITLIST
            </button>
            {/* <p>The email provided is already on the waitlist for this project</p> */}
          </div>
        </div>
      )}

      <button
        className="px-4 py-2 w-1/3 text-white bg-stone-400 hover:bg-stone-300 focus:outline-none"
        onClick={handleGood}
      >
        <span>ADD TO CART</span>
      </button>
      <div
        className="my-5"
        dangerouslySetInnerHTML={{ __html: productInfo.description }}
      ></div>
    </>
  );
};

export default ProductDetails;
