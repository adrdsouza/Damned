interface GridPagenation {
  className?: string;
  count?: number;
  total?: number;
}

const GridPagenation: React.FC<GridPagenation> = (props) => {
  return (
    <div className={`${props.className} w-full flex justify-between lg:px-36`}>
      <div className="flex items-center">
        <p className="lg:ml-4 sm:ml-2">
          Showing 1-{props.count && props.count} of {props.total && props.total}{" "}
          results
        </p>
      </div>
      <div className="flex items-center">
        <p>Setting Sorting Method</p>
        <select
          className="lg:ml-4 px-10 py-2 bg-gray-100 border-0 focus:outline-none"
          name=""
          id=""
        >
          <option value="">Default sorting</option>
          <option value="">Sort by popularity</option>
        </select>
      </div>
    </div>
  );
};

export default GridPagenation;
