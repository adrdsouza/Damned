'use client';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';

const urls: any = {
  home: 'https://admin.damneddesigns.com/wp-content/uploads/Hero-2.mp4',
  chef: 'https://admin.damneddesigns.com/wp-content/uploads/Hero-Video.mp4',
  edc: 'https://admin.damneddesigns.com/wp-content/uploads/EDC.mp4',
};

const DashboardBack = ({ page }: any) => {
  // const [loading, setLoading] = useState(false);

  return (
    <div className='fixed h-screen w-screen overflow-hidden top-0 -z-50'>
      {/* {loading ? (
        <div className='absolute bg-stone-950 h-full w-full flex'>
          <CircularProgress sx={{ color: 'white', mx: 'auto', mt: '40vh' }} />
        </div>
      ) : null} */}

      <video
        loop
        autoPlay
        playsInline
        muted
        className='w-full h-full object-cover bg-stone-950'
        src={urls[page]}
      >
        <source type='video/mp4' src={urls[page]} />
      </video>
    </div>
  );
};

export default DashboardBack;
