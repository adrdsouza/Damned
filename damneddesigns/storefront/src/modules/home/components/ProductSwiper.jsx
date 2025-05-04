// components/MySwiper.jsx
'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import './Home.css';
import Homepageimage1 from "../../../assets/homepageknif1.jpg"
import Homepageimage2 from "../../../assets/homepageknif2.jpeg"
import Homepageimage3 from "../../../assets/homepageknif3.jpeg"
import Homepageimage4 from "../../../assets/homepageknif4.jpeg"
import Homepageimage5 from "../../../assets/homepageknif5.jpeg"



import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Link from 'next/link';
import Image from 'next/image';

export default function ProductsSwiper() {
    const products=[
        {
            image:Homepageimage3,
            label:"New Launch",
            productType:"bg-green-500",
            heading:"Wendigo Fixed Blade",
            detail:`The Wendigo is a versatile fixed blade designed for outdoor enthusiasts. With its full-tang construction and premium steel, this knife is ready for any adventure. The ergonomic handle provides a secure grip in all conditions, while the included Kydex sheath offers safe and convenient carry options.`,
            productId:"wendigo-fixed-blade"
        },
        {
            image:Homepageimage4,
            label:"",
            productType:"",
            heading:"Titanium Pocket Tool",
            detail:`Our Titanium Pocket Tool is the perfect companion for your everyday carry. This multi-functional tool includes a pry bar, bottle opener, hex wrench set, and more – all in a compact, lightweight package that fits easily in your pocket or on your keychain.`,
            productId:"titanium-pocket-tool"
        },
        {
            image:Homepageimage5,
            label:"Best Saller",
            productType:"bg-red-600",
            heading:"Djinn XL Titanium",
            detail:`The Djinn XL is our flagship folding knife, featuring a premium titanium handle and a high-performance CPM-S35VN blade. The ergonomic design ensures comfortable use for extended periods, while the smooth action and solid lockup provide reliability you can count on.`,
            productId:"djinn-xl-titanium"
        },
        {
            image:Homepageimage2,
            label:"Featured",
            productType:"bg-black",
            heading:"Oni Compact",
            detail:`The Oni Compact is a smaller, more pocket-friendly version of our popular Oni design. Don't let its size fool you – this knife packs a punch with its D2 tool steel blade and G10 handle scales. Perfect for everyday carry when you need a reliable cutting tool without the bulk.`,
            productId:"oni-compact"
        }
    ]
    return (
        <>
        <Swiper
          navigation={true}  
          autoplay={{ delay: 3000, disableOnInteraction: false }}       
          loop={true} 
          speed={1200}
          modules={[Navigation,Autoplay]}
          slidesPerView={1}
          className="mySwiper"
           >
            {products && products?.map((product,index)=>{
                return(
                    <SwiperSlide className='' key={index}>
                    <div className="relative h-[650px] w-full "
                    >
                        <Image src={product?.image} alt="Wendigo Fixed Blade" className="w-full h-full object-cover " />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent ">
                        </div>
                        <div className="absolute inset-0 w-full flex items-center ">
                            <div className="max-w-2xl text-white px-[50px] md:px-[70px]"
                            >
                                {product?.label &&<div className="mb-4 text-left">
                                    <span className={`${product?.productType} px-3 py-1 text-sm  rounded-full `}>{product?.label}</span>
                                </div>}
                                <h2 className="text-5xl font-bold mb-4 text-left">
                                  {product?.heading}</h2>
                                <p className="text-lg text-gray-200 mb-6 text-left">
                                    {product?.detail}
                                    </p>
                                <div className="flex gap-4  flex-wrap sm:flex-nowrap">
                                    <Link href={`/products/${product?.productId}`} className="text-black bg-white  focus:outline-none focus:ring-4  font-medium rounded-[1px] text-sm px-[40px] py-[15px] me-2 mb-2  dark:focus:ring-gray-700 dark:border-gray-700">View Details</Link>
                                    <button className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[1px] text-sm px-[40px] py-[15px] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
                )
            })}
       
         
        </Swiper>
        </>
    );
}
