// import DashboardBackVideo from './movies/dashboardBack.mp4';

import Link from 'next/link';

const DashboardBack = () => {
  return (
    <div className='fixed h-screen w-screen overflow-hidden top-0 -z-50'>
      <video
        loop
        autoPlay
        playsInline
        muted
        className='w-full h-full object-cover'
        src='https://admin.damneddesigns.com/wp-content/uploads/Hero-2.mp4'
      >
        <source
          type='video/mp4'
          src='https://admin.damneddesigns.com/wp-content/uploads/Hero-2.mp4'
        />
      </video>
    </div>
  );
};

export default DashboardBack;
