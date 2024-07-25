const SearchBar: React.FC = () => {
  return (
    <div className='w-[70%] left-0 right-0  fixed m-auto  top-[35px]'>
      <input
        className='w-full bg-[#a89c9c] placeholder:text-white text-white p-4 focus:outline-none'
        type='text'
        placeholder='Search'
      />
    </div>
  );
};

export default SearchBar;
