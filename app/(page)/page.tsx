import Image from "next/image";
import dashboardKnife from "@/public/assets/images/knife.png";
import Cards from "@/components/dashboard/cards/page";
import Ticket from "@/components/dashboard/tickets/page";
import Figure from "@/components/dashboard/figures/page";
import DashboardBack from "@/components/dashboardBack";
import { fetchCategories } from "@/lib/integration/categories/query";

export default async function Home() {
  const categories = await fetchCategories();
    
  return (
    <main>
      <DashboardBack />
      <div className="md:relative mt-[60vh] bg-white">
        <div className="sm:mt-0 lg:mt-32 lg:px-60 grid justify-items-center md:flex md:justify-around md:items-center">
          <div className="sm:w-1/2">
            <Image className="mt-[-10vh] xl:mt-[-20vh] w-[30vh] sm:w-[90vh]" src={dashboardKnife} alt="this is knife" />
          </div>
          <div className="py-5 px-10 xl:px-20 xl:py-20 lg:grid lg:grid-cols-1 lg:gap-5">
            <p className="text-3xl font-semibold">OSIRIS CHEF KNIVES</p>
            <p className="textLg">
              After years of being part of countless pockets in the fidget, EDCC
              and knife communities, we are coming for your kitchen!
            </p>
            <button className="lg:w-1/3 lg:py-2 border hover:bg-slate-100 group/button flex justify-center transition duration-300">
              <span>LEARN MORE</span>
              <svg className="h-6 w-6 text-slate-300 hidden group-hover/button:block" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
        <Cards className="mt-20" />
        <Ticket className="mt-20" />
        <Figure className="mt-4" data={categories} />
      </div>
    </main>
  );
}
