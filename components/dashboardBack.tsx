// import DashboardBackVideo from './movies/dashboardBack.mp4';

const DashboardBack = () => {
  return (
    <div className="fixed w-[1960px] overflow-hidden top-0 z-[-3]">
      <div className="relative flex">
        <div className="absolute text-white md:left-8 left-4 md:top-32 top-16 md:w-1/3 w-[350px]">
          <p className="text-4xl font-semibold">DAMNED DESIGNS</p>
          <p className="text-lg mt-2">
            TIMELESS AESTHETIC x UNCOMPROMISING FUNCTION
          </p>
          <p className="text-xl my-5">
            We are on amission to create well designed, high quality products
            that are effective, reliable yet affordable. We design products that
            look great but work better.
          </p>
          <button className="text-center px-4 py-2 border border-white rounded hover:border-slate">
            SHOP NOW
          </button>
        </div>
        <video
          loop
          autoPlay
          className="w-[1960px] lg:h-auto"
          src="https://damneddesigns.com/wp-content/uploads/Hero-2.mp4"
        >
          <source
            type="video/mp4"
            src="https://damneddesigns.com/wp-content/uploads/Hero-2.mp4"
          />
        </video>
      </div>
    </div>
  );
};

export default DashboardBack;
