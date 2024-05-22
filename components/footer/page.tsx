import Buket from "./bucket";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = (props) => {
  return (
    <div className="md:flex md:justify-between sm:grid sm:gap-4 sm:px-8 lg:px-20 lg:py-8 bg-[#f1f1f1] md:items-end">
      <p className="text-sm sm:px-12">@2017 Damned Design All RightsReserved.</p>
      <div className="flex lg:my-8">
        <input type="email" placeholder="Email" className="w-[20vw] text-center border border-[#c7c7c7] focus:border-0 focus:border-b focus:outline-none" />
        <button className="lg:px-10 lg:py-2 sm:p-px border border-slate-300 text-white text-center bg-[#a89c9c]">SUBSCRIBE</button>
      </div>
      <p className="text-sm">T&C | Privacy Policy | Shipping Information</p>
      <Buket />
    </div>
  );
};

export default Footer;
