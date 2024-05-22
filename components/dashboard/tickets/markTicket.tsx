import Image from "next/image";

interface MarkTicketProps {
    className?: string;
    mark?: any;
    text?: string;
}

const MarkTicket:React.FC<MarkTicketProps> = (props) => {
    return (
        <div className={`${props.className} lg:px-20 lg:py-5 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg flex justify-center`}>
            <Image src={props.mark} alt="this is mark" className="w-40 h-18"/>
            <p className="text-lg font-semibold">{props.text}</p>
        </div>
    )
}

export default MarkTicket;