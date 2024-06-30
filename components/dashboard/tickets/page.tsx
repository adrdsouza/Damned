'use client';

import { useState } from 'react';
import MarkTicket from './markTicket';
interface TicketProps {
  className?: string;
}

const Ticket: React.FC<TicketProps> = (props) => {
  const [sheerMark, setSheerMark] = useState<Boolean>(false);
  const [sezzle, setSezzle] = useState<Boolean>(false);
  const [shipping, setShipping] = useState<Boolean>(false);

  const handleShow = () => {};

  return (
    <div className={`py-[2em] md:py-[5em] w-full`}>
      <div className='grid lg:grid-cols-3 gap-10 w-full'>
        <MarkTicket
          text='Buy now, Pay Later. 0% interest'
          mark='https://admin.damneddesigns.com/wp-content/uploads/4payments6weeks0interest-white-1.png'
        />
        <MarkTicket
          text='Free shipping on US orders over $100'
          mark='https://admin.damneddesigns.com/wp-content/uploads/1_jLAS3yLE6G-ERUcNhAdWUA-Copy-1.png'
        />
        <MarkTicket
          text='Military and first responder discounts'
          mark='https://admin.damneddesigns.com/wp-content/uploads/Asset-4-1.png'
        />
      </div>
      {/* <div
        className={`${
          !sheerMark && 'hidden'
        } fixed top-0 left-0 flex justify-center items-center px-96 py-60 w-screen h-[100vh]`}
      ></div> */}
    </div>
  );
};

export default Ticket;
