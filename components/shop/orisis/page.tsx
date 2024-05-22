'use client';

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/graphql/type";
import PocketItem from "@/components/card/card";
import Pagenation from "@/components/pagenation/page";
import orisisKnife4 from "@/public/assets/images/orisis-knife4.gif";
import orisisKnife5 from "@/public/assets/images/orisis-knife5.jpg";

interface OrisisProps {
  className?: string;
  data: Product[];
}

const Orisis: React.FC<OrisisProps> = (props) => {
   
  const [page, setPage] = useState<number>(1);

  const prePage = () => {
    page > 1 && setPage(page-1);
  }

  const afterPage = () => {    
    props.data.length > page * 12 && setPage(page+1);
  }

  return (
    <div className={`${props.className}`}>
      <div className="mt-10 flex justify-center gap-8">
        {props.data.map((p, index) => 12 * (page - 1) <= index && index < 12 * (page) && (
          <div key={index}>
          <PocketItem
            img={p.node.image && p.node.image.sourceUrl}
            productId={p.node.id}
            name={p.node.name}
            price={p.node.price}
            onSale={p.node.onSale}
          />
          <p>{p.node.name}</p>
          <p>{p.node.price}</p>
        </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Pagenation className="lg:mt-8" page={page} prePage={prePage} afterPage={afterPage} />
      </div>
      <div className="flex lg:mt-10">
        <Image className="w-2/5" src={orisisKnife4} alt="this is orisis" />
        <div className="relative w-3/5 grid">
          <Image
            className="h-[479px] object-cover"
            src={orisisKnife5}
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
