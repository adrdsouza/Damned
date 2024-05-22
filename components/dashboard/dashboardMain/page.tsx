import Image from "next/image"
import dashboardKnife from '@/assets/images/knife.png';
import Cards from "./cards/page";
import Ticket from "./tickets/page";
import Figure from "./figures/page";

const DashboardMain = () => {
    return (
        <div className="mt-[70vh] relative w-screen bg-white">
            <div className="lg:-mt-32 lg:px-60 flex justify-around items-center">
                <Image 
                    className="w-1/2"
                    src={dashboardKnife}
                    alt='this is knife'
                />
                <div className="lg:grid lg:grid-cols-1 lg:gap-5">
                    <p className="text-3xl font-semibold">
                        OSIRIS CHEF KNIVES
                    </p>
                    <p className="text-lg">
                        After years of being part of countless pockets in the fidget, EDCC and knife communities, we are coming for your kitchen!
                    </p>
                    <button className="lg:w-1/3 lg:py-2 border border-slate-300 bg-slate-200 rounded-lg hover:bg-slate-400">
                        LEARN MORE
                    </button>
                </div>
            </div>
            <Cards className="mt-20" />
            <Ticket className="mt-20 w-full" />
            <Figure className="mt-4"/>
        </div>
    )
}

export default DashboardMain;