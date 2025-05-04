import Image from "next/image";
import ProductsSwiper from "./ProductSwiper"
import Homepageimage1 from "../../../assets/homepageknif1.jpg"
import Homepageimage2 from "../../../assets/homepageknif2.jpeg"
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex-grow  lg:mt-[-50px] ">
            {/* Hero Section */}
            <section className="relative bg-cream min-h-[600px] flex items-center px-[40px] bg-[#f5f5f5] ">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="lg:pr-12 mt-6">
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Precision Crafted Knives for the Discerning Collector
                            </h1>
                            <p className="text-lg text-gray-700 mb-6 max-w-xl">
                                Discover our premium collection of EDC knives, designed with meticulous attention to detail and crafted from the finest materials.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">

                                <Link href="/store" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[1px] text-sm px-[40px] py-[18px] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 text-center">Shop Collection</Link>
                                <Link
                                    href="/about"
                                    className="text-black bg-white border border-black-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 font-medium rounded-[1px] text-sm px-[40px] py-[18px] me-2 mb-2 text-center"
                                >
                                    About Us
                                </Link>

                            </div>
                        </div>
                        <div className="relative h-full">
                            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={Homepageimage1}
                                   

                                    alt="Premium knife from Damned Designs"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-white py-3 border-y border-gray-200 px-[40px]">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 justify-items-center ">
                        {[
                            {
                                icon: (
                                    <svg width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3c-.6 0-1-.4-1-1V7c0-.6.4-1 1-1h10c.6 0 1 .4 1 1v11" /><path d="M14 9h4l4 4v4c0 .6-.4 1-1 1h-2" /><circle cx="7" cy="18" r="2" /><path d="M15 18H9" /><circle cx="17" cy="18" r="2" /></svg>
                                ),
                                title: "Free Shipping",
                                description: "On orders over $100"
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                ),
                                title: "Military & First Responder",
                                description: "Verified 10% discount"
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                ),
                                title: "Buy Now, Pay Later",
                                description: "4 interest-free payments"
                            },
                            {
                                icon: (
                                    <svg width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /></svg>
                                ),
                                title: "Trusted by Customers",
                                description: "4.8/5 on Trustpilot"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center text-center">
                                <div className="w-10 h-10 bg-[#f5f5f5]   flex items-center justify-center bg-cream rounded-full mb-2">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-bold text-sm">{item.title}</p>
                                    <p className="text-xs text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="bg-white  border-y border-gray-200 ">
                
                    <ProductsSwiper />
           
            </section>

            {/*  */}
            <section className="py-16 bg-cream  bg-[#f5f5f5] px-[40px]">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-6" data-svelte-h="svelte-qpzdtd">Crafted with Passion</h2>
                            <p className="text-gray-700 mb-4" data-svelte-h="svelte-ty3w3y">At Damned Designs, we're passionate about creating exceptional everyday carry tools that combine innovative design, premium materials, and superior craftsmanship.</p>

                            <p className="text-gray-700 mb-6" data-svelte-h="svelte-zualmh">Each knife we create is a perfect balance of form and function, designed to be used and appreciated for years to come. We take pride in our attention to detail, our innovative approach to design, and our unwavering commitment to quality.</p>

                            <Link href="/about" className="text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-[1px] text-sm px-[40px] py-[20px] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn More</Link>

                        </div>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <Image src={Homepageimage2} alt="Damned Designs workshop" className="w-full h-full object-cover" />
                        </div>
                    </div>

                </div>

            </section>


            <section className="py-16 bg-[#f5f5f5] px-[40px]">
                <div className="container">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4" data-svelte-h="svelte-es7olw">Join Our Newsletter</h2>
                        <p className="mb-8 text-gray-700" data-svelte-h="svelte-jjrbvv">Subscribe to receive updates on new products, special offers, and exclusive content.</p>
                        <form method="POST" className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <div className="flex-grow">
                                <input type="email" id="email" placeholder="Your email address" className="w-full px-4 py-3 rounded-md border border-gray-300 text-primary focus:outline-none focus:ring-2 focus:ring-primary" /> </div>
                            <button type="submit" className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors" data-svelte-h="svelte-1is74v1">Subscribe</button>
                        </form>
                    </div>
                </div>

            </section>
        </main>
    );
}
