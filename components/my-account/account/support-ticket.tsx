export default function SupportTicket() {
  return (
    <div className="grid gap-5">
      <p>
        Create a new ticket or reply to the already opened tickets. Note: To
        submit a ticket about an order, please click on Orders tab, click on the
        order you wish and then use the ticket area you find in the its details
        page.
      </p>
      <div className="flex justify-between">
        <div className="flex gap-1">
          <div className="flex flex-col gap-1">
            <p>Sort tickets from:</p>
            <select name="" id="" className="px-1 py-1 border border-slate-100">
              <option value="Newer to older">Newer to older</option>
              <option value="Older to newer">Older to newer</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <p>Filter by status:</p>
            <select name="" id="" className="px-1 py-1 border border-slate-100">
              <option value="Show all">Show all</option>
              <option value="Open">Open</option>
              <option value="Inprogress">Inprogress</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>
        <button className="px-10 py-2 bg-stone-500 text-white self-end text-xl uppercase rounded hover:bg-stone-300">
          new ticket
        </button>
      </div>
      <div className="py-5 grid bg-stone-100 gap-2">
        <p className="bg-white px-5 py-1 text-xl text-black">
          Submit a new ticket
        </p>
        <div className="flex flex-col gap-2 w-4/5 px-3">
          <p>Subject (Characters left: 100)</p>
          <input
            type="text"
            name=""
            id=""
            className="px-2 py-1 bg-white focus:outline-none border border-slate-600"
          />
        </div>
        <div className="flex flex-col gap-2 w-4/5 px-3">
          <p>Message (Characters left: 500)</p>
          <textarea
            name=""
            id=""
            className="px-2 py-1 bg-white focus:outline-none border border-slate-600 h-32"
          ></textarea>
        </div>
        <div className="flex flex-col w-full px-3">
          <p>Attachment(s) (Max size: 4MB)</p>
          <div className="flex border border-slate-200 px-3 py-4 gap-1">
            <input type="file" name="" id="" />
          </div>
        </div>
        <div className="flex">
          <button className="mx-5 px-10 py-3 uppercase text-xl text-white rounded bg-stone-500 hover:bg-stone-400">
            open new ticket
          </button>
        </div>
      </div>
    </div>
  );
}
