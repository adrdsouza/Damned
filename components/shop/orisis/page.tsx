'use client';

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/graphql/type";
import PocketItem from "@/components/card/card";
import orisisKnife4 from "@/public/assets/images/orisis-knife4.gif";
import orisisKnife5 from "@/public/assets/images/orisis-knife5.jpg";

interface OrisisProps {
  className?: string;
  data: Product[];
}

const Orisis: React.FC<OrisisProps> = (props) => {
 
  return (
    <div className={`${props.className}`}>
      <div className="mt-10 flex justify-center xl:px-96 gap-8">
        {props.data.map((p, index) => (
          <div key={index}>
          <PocketItem
            img={p.node.image && p.node.image.sourceUrl}
            productId={p.node.id}
            name={p.node.name}
            price={p.node.price}
            onSale={p.node.onSale}
          />          
        </div>
        ))}
      </div>
      <div className="flex lg:mt-10">
        <img className="w-2/5" src="https://damnedventures.com/wp-content/uploads/Presentation12.gif" alt="this is orisis" />
        <div className="relative w-3/5 grid">
          <img
            className="w-full h-[479px] object-cover opacity-75"
            src="https://damnedventures.com/wp-content/uploads/IMG_2642-scaled.jpg"
            alt="this is orisis"
          />
          <div className="absolute text-center self-center lg:mx-40 md-mx-32 text-slate-300">
            <p className="text-3xl font-semibold">MAKE IT YOURS</p>
            <p className="text-2xl text-slate-500">With replaceable scales</p>
            <p>
              We are strong advocates of individual expressions fo self and as
              such we have always created products that yu ahve full control
              over. Borrowing from our EDC knives, the Osiris chef knives have
              scales that can be replaced with minimal effort. With many handle
              offerings in the future. you cooking companion cna be however you
              like!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orisis;
