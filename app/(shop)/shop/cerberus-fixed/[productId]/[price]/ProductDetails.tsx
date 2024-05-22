'use client';

import { useGood } from '@/components/context/GoodContext';
import { ProductInfo } from '@/lib/graphql/type';

interface ProductDetailsProps {
  productInfo: ProductInfo;
  price: string
}

const ProductDetails: React.FC<ProductDetailsProps> = ( {productInfo, price} ) => {
  const { good, setGood } = useGood();
  
  const handleGood = () => {
    good && good.filter(g => g.name == productInfo.name).length < 1 ?
    setGood([...good, { name: productInfo.name, price: productInfo.price ? productInfo.price: '' }]) :
    alert("Already added");
  }

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
      <button
        className="px-4 py-2 w-1/3 text-white bg-stone-400 hover:bg-stone-300 focus:outline-none"
        onClick={handleGood}
      >
        ADD TO CART
      </button>
      <div dangerouslySetInnerHTML={{ __html: productInfo.description}}></div>
      <p>SPECS</p>
      <div className="flex flex-col gap-2 text-sm">
        {/* Assuming you have more specs data to display */}
        <p>Product ID: {productInfo.id}</p>
      </div>
      <div className="gallery">
        {/* {productInfo.galleryImages.edges.map((imageEdge, index) => (
          <Image key={index} src={imageEdge.node.sourceUrl} alt={`Gallery image ${index + 1}`} width={100} height={100} />
        ))} */}
      </div>
    </>
  );
}

export default ProductDetails;
