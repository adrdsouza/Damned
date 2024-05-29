import Image from "next/image";
import Shop from "../(shop)/shop/page";
import Link from "next/link";
import Cards from "@/components/dashboard/cards/page";
import Ticket from "@/components/dashboard/tickets/page";
import DashboardBack from "@/components/dashboardBack";

export default async function Home() {
    
  return (
    <main className="flex flex-col">
      <DashboardBack />
      <div className="flex">
        <div className="text-white md:left-8 left-4 md:top-32 top-16 md:w-1/2 w-[350px]
          md:px-20 md:pt-20 md:pb-96
        ">
          <p className="text-4xl font-semibold">DAMNED DESIGNS</p>
          <p className="text-lg my-5">
            TIMELESS AESTHETIC x UNCOMPROMISING FUNCTION
          </p>
          <p className="text-xl my-10">
            We are on amission to create well designed, high quality products
            that are effective, reliable yet affordable. We design products that
            look great but work better.
          </p>
          <Link href="/shop" className="text-center px-10 py-4 border border-white rounded hover:border-slate">
            SHOP NOW
          </Link>
        </div>
      </div>
      <div className="md:relative bg-white">
        <div className="sm:mt-0 lg:px-60 grid justify-items-center md:flex md:justify-around md:items-center">
          <div className="sm:w-1/2">
            <Image className="mt-[-10vh] xl:mt-[-20vh] w-[30vh] sm:w-[90vh]" src="https://damnedventures.com/wp-content/uploads/996A9287-4-e1714822334887.png" width={400} height={400} alt="this is knife" />
          </div>
          <div className="w-1/2 py-2 px-10 xl:px-20 xl:py-5 lg:grid lg:grid-cols-1 lg:gap-5">
            <p className="text-3xl font-semibold underline">OSIRIS CHEF KNIVES</p>
            <p className="text-2xl">
              After years of being part of countless pockets in the fidget, EDCC
              and knife communities, we are coming for your kitchen!
            </p>
            <Link href="/shop/osiris-chef-knives" className="lg:w-1/3 lg:py-2 border-2 border-black hover:bg-slate-100 group/button flex justify-center transition duration-300">
              <span className="text-xl">LEARN MORE</span>
              <svg className="h-6 w-6 text-slate-300 hidden group-hover/button:block" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
            </Link>
          </div>
        </div>
        <Cards className="mt-20" />
        <Ticket className="mt-20" />
        <Shop />
      </div>
    </main>
  );
}
