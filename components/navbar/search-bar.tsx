import * as React from 'react';
import Popover from '@mui/material/Popover';
import { Cross, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const router = useRouter();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSearch('');
    setAnchorEl(null);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    handleClose();
    setSearch('');
    router.push(`/search?query=${search}`);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Search
        aria-describedby={id}
        onClick={handleClick}
        className='cursor-pointer h-5 w-5'
      />
      <Popover
        disableScrollLock
        sx={{
          '.MuiPopover-paper': {
            position: 'fixed',
            width: 'calc(100% - 30px)',
            maxWidth: '1440px',
            m: 'auto !important',
            left: '0px !important',
            right: '0px !important',
            top: '55px !important',
            borderRadius: 0,
            boxShadow: 'none',
            bgcolor: '#918484',
          },
        }}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <div className='flex justify-between w-full items-center'>
          <form className='w-full' onSubmit={handleSearch}>
            <input
              className='w-full bg-[#918484] placeholder:text-white text-white p-4 focus:outline-none'
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search'
            />
          </form>
          <div className='flex gap-2 items-center'>
            <div
              onClick={handleSearch}
              className='text-white font-medium cursor-pointer'
            >
              FIND
            </div>
            <X
              onClick={handleClose}
              className=' text-white m-2 cursor-pointer h-5 w-5'
            />
          </div>
        </div>
      </Popover>
    </div>
  );
};

export default SearchBar;
