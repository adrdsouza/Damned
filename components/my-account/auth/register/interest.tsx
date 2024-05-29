interface InterestProps {
  className?: string;
}

const Interest = (props: InterestProps) => {
  return (
    <div className={`${props.className}`}>
      <h3 className="mb-5 text-lg font-medium text-gray-900">
        What are you interested in?
      </h3>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <input
            type="radio"
            id="application"
            name="inerest"
            value="application"
            className="hidden peer"
            required
          />
          <label
            htmlFor="application"
            className="px-4 py-2 inline-flex items-center justify-between w-full text-slate-950 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-gray-700 peer-checked:border-gray-600 peer-checked:text-slate-100 hover:bg-gray-100"
          >
            <div className="flex">
              <svg
                className="h-8 w-8 text-slate-500"
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
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />{" "}
                <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />{" "}
                <line x1="9" y1="9" x2="10" y2="9" />{" "}
                <line x1="9" y1="13" x2="15" y2="13" />{" "}
                <line x1="9" y1="17" x2="15" y2="17" />
              </svg>
              <div className="ml-3 w-full">Application</div>
            </div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="renewal"
            name="inerest"
            value="renewal"
            className="hidden peer"
            required
          />
          <label
            htmlFor="renewal"
            className="px-4 py-2 inline-flex items-center justify-between w-full text-slate-950 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-gray-700 peer-checked:border-gray-600 peer-checked:text-slate-100 hover:bg-gray-100"
          >
            <div className="flex">
              <svg
                className="h-8 w-8 text-slate-500"
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
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -5v5h5" />{" "}
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 5v-5h-5" />
              </svg>
              <div className="ml-3 w-full">Renewal</div>
            </div>
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="reschedule"
            name="inerest"
            value="reschedule"
            className="hidden peer"
            required
          />
          <label
            htmlFor="reschedule"
            className="px-4 py-2 inline-flex items-center justify-between w-full text-slate-950 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:bg-gray-700 peer-checked:border-gray-600 peer-checked:text-slate-100 hover:bg-gray-100"
          >
            <div className="flex">
              <svg
                className="h-8 w-8 text-slate-500"
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
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <rect x="4" y="5" width="16" height="16" rx="2" />{" "}
                <line x1="16" y1="3" x2="16" y2="7" />{" "}
                <line x1="8" y1="3" x2="8" y2="7" />{" "}
                <line x1="4" y1="11" x2="20" y2="11" />{" "}
                <line x1="11" y1="15" x2="12" y2="15" />{" "}
                <line x1="12" y1="15" x2="12" y2="18" />
              </svg>
              <div className="ml-3 w-full">Reschedule</div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Interest;
