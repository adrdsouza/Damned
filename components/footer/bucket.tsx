"use client";

import React, { useState } from "react";
import { useGood } from "../context/GoodContext";

export default function Bucket() {
  const [show, setShow] = useState<Boolean>(false);
  const { good, setGood } = useGood();

  return (
    <div>
      <button className="fixed bottom-0 right-0 shadow" onClick={() => setShow(!show)}>
        <svg
          className="h-16 w-16 text-stone-400"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" /> <path d="M19 9l-2 9a2 2.5 0 0 1 -2 2h-6a2 2.5 0 0 1 -2 -2l-2 -9Z" /> <path d="M7 9a5 5 0 0 1 10 0" />
        </svg>
      </button>
      <div className={`${!show && "hidden"} w-screen h-[100vh] flex fixed bottom-0 right-0`}>
        <div className="w-3/4 bg-black opacity-25" onClick={() => setShow(false)}></div>
        <div className="w-1/4 px-10 gap-5 bg-stone-500 flex flex-col justify-center items-around shadow transition duration-300 linear">
          {good &&
            good.map((g) => (
              <div className="flex justify-around text-white" key={g.name}>
                <p>{g.name}</p>
                <p>{g.price}</p>
                <button onClick={() => setGood([...good.filter((go) => go.name !== g.name)])}>return cart</button>
              </div>
            ))}
          <button className="px-5 py-2 bg-white border-4 border-blue-300" onClick={() => setGood(null)}>
            Return Cart
          </button>
        </div>
      </div>
    </div>
  );
}
