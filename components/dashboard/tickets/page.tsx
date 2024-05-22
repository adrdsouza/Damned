import MarkTicket from "./markTicket"
import SheerMark from '@/public/assets/images/sheer.png';
import Sezzle from '@/public/assets/images/sezzle.png';
import Shipping from '@/public/assets/images/shipping.png';

interface TicketProps {
    className?: string
}

const Ticket:React.FC<TicketProps> = (props) => {
    return (
        <div className={`${props.className} lg:px-32 px-10`}>
            <div className="grid lg:grid-cols-3 lg:gap-24 gap-5 w-full">
                <MarkTicket mark={SheerMark} />
                <MarkTicket mark={Sezzle} />
                <MarkTicket mark={Shipping} />
            </div>
        </div>
    )
}

export default Ticket;