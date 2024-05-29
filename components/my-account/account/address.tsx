"use client";

import { useState } from "react";

export default function Address() {
  const [edit, setEdit] = useState<Boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = useState<any>({
    fname: "Adrian",
    lname: "Dsouza",
    region: "United State(US)",
    street1: "124 prince geoge street",
    street2: "124 prince geoge street",
    town: "Bensalem",
    state: "Pennsylvania",
    zip: 19020,
    phone: 60999781 - 6,
    email: "info@damneddesigns.com",
  });

  return (
    <div className="flex flex-col gap-2">
      {!title && (
        <p>
          The following addresses will be used on the checkout page by default.
        </p>
      )}
      {title && <p className="text-2xl uppercase">{title}</p>}
      {!edit && (
        <div className="flex gap-10">
          <div className="flex flex-col">
            <div className="flex justify-around items-end border-b border-slate-100 gap-10">
              <p className="text-2xl uppercase">billing address</p>
              <button
                onClick={() => {
                  setEdit(true);
                  setTitle("billing address");
                }}
              >
                Edit
              </button>
            </div>
            <p>Adrian Dsouza</p>
            <p>124 prince george street</p>
            <p>124 prince george street</p>
            <p>Bensalem, PA 19020</p>
          </div>
          <div className="flex flex-col">
            <div className="flex justify-around items-end border-b border-slate-100 gap-10">
              <p className="text-2xl uppercase">shipping address</p>
              <button
                onClick={() => {
                  setEdit(true);
                  setTitle("shipping address");
                }}
              >
                Edit
              </button>
            </div>
            <p>Adrian Dsouza</p>
            <p>124 prince george street</p>
            <p>124 prince george street</p>
            <p>Bensalem, PA 19020</p>
          </div>
        </div>
      )}
      {edit && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-10">
            <div className="flex flex-col">
              <div className="flex">
                <label htmlFor="">First name</label>
                <abbr className="required text-[red]" title="required">
                  *
                </abbr>
              </div>
              <input
                type="text"
                name=""
                id=""
                className="px-2 py-2 border border-stone-300 focus:outline-none"
                value={data.fname}
              />
            </div>
            <div className="flex flex-col">
              <div className="flex">
                <label htmlFor="">Last name</label>
                <abbr className="required text-[red]" title="required">
                  *
                </abbr>
              </div>
              <input
                type="text"
                name=""
                id=""
                className="px-2 py-2 border border-stone-300 focus:outline-none"
                value={data.lname}
              />
            </div>
          </div>
          <div className="grid">
            <div className="flex">
              <span>Country/Region</span>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <select
              name=""
              id=""
              className="border border-slate-300 focus:outline-none rounded px-2 py-2"
              value={data.country}
            >
              <option value="United States(US)">United States(US)</option>
              <option value="United States(US)">Canada</option>
              <option value="United States(US)">Germany</option>
            </select>
          </div>
          <div className="grid">
            <div className="flex">
              <label htmlFor="">Street address</label>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <input
              type="text"
              name=""
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.street1}
            />
          </div>
          <div className="grid">
            <input
              type="text"
              name=""
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.street2}
            />
          </div>
          <div className="grid">
            <div className="flex">
              <label htmlFor="">Town/City</label>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <input
              type="text"
              name="town"
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.town}
            />
          </div>
          <div className="grid">
            <div className="flex">
              <span>State</span>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <select
              name="state"
              id=""
              className="border border-slate-300 focus:outline-none rounded px-2 py-2"
              value={data.state}
            >
              <option value="United States(US)">United States(US)</option>
              <option value="Pennsylvania">Pennsylvania</option>
              <option value="Orogen">Orogen</option>
            </select>
          </div>
          <div className="grid">
            <div className="flex">
              <label htmlFor="">ZIP Code</label>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <input
              type="number"
              name="zip"
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.zip}
            />
          </div>
          <div className="grid">
            <div className="flex">
              <label htmlFor="">Phone</label>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <input
              type="number"
              name="phonep"
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.phone}
            />
          </div>
          <div className="grid">
            <div className="flex">
              <label htmlFor="">Email address</label>
              <abbr className="required text-[red]" title="required">
                *
              </abbr>
            </div>
            <input
              type="email"
              name="email"
              id=""
              className="px-2 py-2 border border-stone-300 focus:outline-none"
              value={data.email}
            />
          </div>
          <div>
            <button className="px-10 py-2 bg-stone-400 text-white text-xl uppercase hover:bg-stone-300">
              save address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
