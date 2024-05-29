export default function Points() {
  return (
    <div className="grid gap-5">
      <p className="text-3xl text-black uppercase">my points</p>
      <div className="grid">
        <p>You have 0 Points</p>
        <table className="table-auto border-collapse border border-slate-400 content-center">
          <thead>
            <tr>
              <th className="border border-slate-300">Event</th>
              <th className="border border-slate-300">Date</th>
              <th className="border broder-slate-300">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-300">Points expired</td>
              <td className="border border-slate-300 decoration-dotted">
                December 22,2022
              </td>
              <td className="border border-slate-300">-60</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Points expired</td>
              <td className="border border-slate-300 decoration-dotted">
                November 15,2022
              </td>
              <td className="border border-slate-300">-500</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Points expired</td>
              <td className="border border-slate-300 decoration-dotted">
                November 15,2022
              </td>
              <td className="border border-slate-300">-1000</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Points expired</td>
              <td className="border border-slate-300 decoration-dotted">
                November 14,2022
              </td>
              <td className="border border-slate-300">-1500</td>
            </tr>
            <tr>
              <td className="border border-slate-300">Points expired</td>
              <td className="border border-slate-300 decoration-dotted">
                November 14,2022
              </td>
              <td className="border border-slate-300">-500</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex">
        <button className="px-6 py-4 border-2 rounded border-slate-600 text-xl hover:bg-slate-50">
          Next
        </button>
      </div>
    </div>
  );
}
