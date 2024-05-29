"use client";

import Link from "next/link";
import { useState } from "react";
import Dashboard from "./dashboard";
import Orders from "./orders";
import Address from "./address";
import PaymentMethod from "./payment-method";
import SupportTicket from "./support-ticket";
import Points from "./points";

export default function Account() {
  const [page, setPage] = useState<number>(0);

  return (
    <div className="w-screen flex flex-col justify-center items-center mb-20 py-20 gap-5">
      <p className="text-4xl text-[#333] uppercase">account dashboard</p>
      <div className="w-full py-5 flex justify-center text-[#776d6d]">
        <ul className="w-1/5 flex flex-col gap-2 text-xl uppercase">
          <li className="cursor-pointer" onClick={() => setPage(0)}>
            <span>dashboard</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(1)}>
            <span>orders</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(2)}>
            <span>address</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(3)}>
            <span>payment details</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(4)}>
            <span>support tickets</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(5)}>
            <span>points</span>
          </li>
          <li className="cursor-pointer" onClick={() => setPage(3)}>
            <span>your waitlists</span>
          </li>
          <li className="cursor-pointer">
            <Link href="/"><span>log out</span></Link>
          </li>
        </ul>
        <div className="w-2/5">
          {page == 0 && <Dashboard />}
          {page == 1 && <Orders />}
          {page == 2 && <Address />}
          {page == 3 && <PaymentMethod />}
          {page == 4 && <SupportTicket />}
          {page == 5 && <Points />}
        </div>
      </div>
    </div>
  );
}
