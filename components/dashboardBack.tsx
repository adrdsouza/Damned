// import DashboardBackVideo from './movies/dashboardBack.mp4';

import Link from "next/link";

const DashboardBack = () => {
  return (
    <div className="fixed w-[1960px] overflow-hidden top-0 -z-50">
      <video
          loop
          autoPlay
          playsInline
          muted
          className="w-[1960px] lg:h-auto"
          src="https://damnedventures.com/wp-content/uploads/Hero-2.mp4"
        >
          <source
            type="video/mp4"
            src="https://damnedventures.com/wp-content/uploads/Hero-2.mp4"
          />
        </video>
    </div>
  );
};

export default DashboardBack;
