interface CardProps {
  className?: string;
  name?: string;
  time?: string;
  star?: Number;
  text?: string;
}

const Card: React.FC<CardProps> = (props) => {
  const starArray = [0, 1, 2, 3, 4];

  return (
    <div className={`${props.className}`}>
      <div className="w-full flex jsutfy-between">
        <div className="flex">
          <svg
            className="h-20 w-20 text-green-100"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="px-2">
            <p className="text-xl font-semibold">{props.name}</p>
            <p>{props.time}</p>
          </div>
        </div>
        <svg
          className="h-8 w-8 text-green-500"
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
          <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
        </svg>
      </div>
      <div className="flex">
        {starArray.map((value, index) => (
          <svg
            key={index}
            className="h-8 w-8 text-green-500"
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
            <path d="M12 17.75l-6.172 3.245 1.179-6.873-4.993-4.867 6.9-1.002L12 2l3.086 6.253 6.9 1.002-4.993 4.867 1.179 6.873z" />
          </svg>
        ))}
      </div>
      <p className="my-2">{props.text}</p>
    </div>
  );
};

export default Card;
