'use client';

import { useState } from 'react';
import MarkTicket from './markTicket';
import { Sezzle, SheerMark } from './ticketDisplay';

const Ticket = () => {
  const [sheerMark, setSheerMark] = useState<Boolean>(false);
  const [sezzle, setSezzle] = useState<Boolean>(false);
  const [shipping, setShipping] = useState<Boolean>(false);

  return (
    <div className='py-[2em] md:py-[5em]'>
      <div className='grid lg:grid-cols-3 lg:gap-24 gap-5 w-full'>
        <MarkTicket
          mark='https://admin.damneddesigns.com/wp-content/uploads/4payments6weeks0interest-white-1.png'
          text='Buy now, Pay Later. 0% interest'
          onShow={setSezzle}
        />
        <MarkTicket
          mark='https://admin.damneddesigns.com/wp-content/uploads/1_jLAS3yLE6G-ERUcNhAdWUA-Copy-1.png'
          text='Free shipping on US orders over $100'
          onShow={setShipping}
        />
        <MarkTicket
          mark='https://admin.damneddesigns.com/wp-content/uploads/Asset-4-1.png'
          text='Military and first responder discounts'
          onShow={setSheerMark}
        />
      </div>
      {sezzle && <Sezzle onShow={setSezzle} />}
      {sheerMark && <SheerMark onShow={setSheerMark} />}
    </div>
  );
};

export default Ticket;
