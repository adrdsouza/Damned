import { ChevronDown } from "lucide-react";
import Link from "next/link";

const ContactDropdown = () => {
  return (
    <div className="relative inline-block text-left">
    <button className="peer flex items-center text-lg font-semibold text-gray-800">
      Contact <ChevronDown className="ml-1 h-4 w-4" />
    </button>
  
    <div className="invisible peer-hover:visible hover:visible absolute z-10 mt-[0px] w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 transition-opacity duration-200 opacity-0 peer-hover:opacity-100 hover:opacity-100">
      <div className="py-1 text-sm font-semibold text-black">
        <Link
          href="/about"
          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          About Us
        </Link>
        <Link
          href="/support"
          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
        >
          Support
        </Link>
      </div>
    </div>
  </div>
  
  
  );
};

export default ContactDropdown;
