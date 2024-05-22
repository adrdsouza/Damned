import Card from "./card";
import "./style.css";

interface CardsProps {
  className?: string;
}

const Cards: React.FC<CardsProps> = (props) => {
  return (
    <div className={`${props.className} lg:px-40`}>
      <p className="text-3xl">A PROVEN TRACK RECORD!</p>
      <div className="lg:my-4 flex justify-between">
        <div className="flex">
          <p className="text-xl px-2 font-semibold">4.7</p>
          <div className="flex">
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            </svg>
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            </svg>
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            </svg>
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            </svg>
            <svg
              className="h-8 w-8 text-green-500"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {" "}
              <path stroke="none" d="M0 0h24v24H0z" />{" "}
              <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
            </svg>
          </div>
        </div>
        <button className="px-2 py-2 bg-black text-white rounded-lg flex jsutify-around items-center">
          <svg
            className="h-8 w-8 text-green-100"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
            <line x1="16" y1="5" x2="19" y2="8" />
          </svg>
          Write a Review
        </button>
      </div>

      <div className="relative flex flex-col bg-white">
        <div className="absolute lg:left-0 lg:bottom-20 opacity-75 bg-slate-200 rounded-full z-10">
          <svg
            className="h-10 w-10 text-green-700"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <polyline points="15 6 9 12 15 18" />
          </svg>
        </div>

        <div className="absolute lg:right-0 lg:bottom-20 opacity-75 bg-slate-200 rounded-full z-10">
          <svg
            className="h-10 w-10 text-green-700"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path stroke="none" d="M0 0h24v24H0z" />{" "}
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </div>
        <div className="relative flex overflow-x-scroll pb-10 hide-scroll-bar">
          <div className="flex flex-nowrap lg:ml-40 md:ml-20 ml-10 ">
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
            <div className="inline-block px-3">
              <div className="w-96 max-w-xs overflow-hidden rounded-lg shadow-md bg-white hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <Card
                  name="Gray"
                  className="mx-2 px-2 pt-5 pb-2"
                  time="2 years ago"
                  star={3}
                  text="I have multiple Dammed design Knives and love every one for a different reasons. The last 3 fixed blades I got exceed all expatiations. First quality of the product next the design and last the shipping experience.
                    The know how to make the customer happy."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative overflow-auto animate-infinite-scroll"></div>
    </div>
  );
};

export default Cards;
