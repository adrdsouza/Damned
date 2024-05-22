import MarkTicket from "./markTicket"
import SheerMark from '@/assets/images/sheer.png';
import Sezzle from '@/assets/images/sezzle.png';
import Shipping from '@/assets/images/shipping.png';

interface TicketProps {
    className?: string
}

const Ticket:React.FC<TicketProps> = (props) => {
    return (
        <div className={`${props.className} lg:px-32`}>
            <div className="grid grid-cols-3 lg:gap-24 w-full">
                <MarkTicket mark={SheerMark} />
                <MarkTicket mark={Sezzle} />
                <MarkTicket mark={Shipping} />
            </div>
        </div>
    )
}

export default Ticket;