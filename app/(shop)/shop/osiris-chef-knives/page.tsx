import OrisisMain from "@/components/shop/orisis/page";
import { fetchProducts } from "@/lib/integration/products/query";

const Orisis: React.FC = async () => {
  const products = await fetchProducts("1269", "", "12");
  return (
    <div>
      <div className="relative flex flex-col justify-center items-center">
        <video
          loop
          autoPlay
          playsInline
          className="w-screen"
          src="https://damnedventures.com/wp-content/uploads/Hero-Video.mp4"
        >
          <source
            type="video/mp4"
            src="https://damnedventures.com/wp-content/uploads/Hero-Video.mp4"
          />
        </video>
        <div className="absolute w-2/3 px-10 flex flex-col gap-5 text-white">
          <p className="text-5xl">OSIRIS CHEF KNIVES</p>
          <p className="text-2xl">FUNCTION x AESTHETIC</p>
          <p className="text-xl">
            We love EDC knives but we love food more! The Osiris knives were
            born out of a burning desire to create a set of knives for
            ourselves. After having them as a staple in our kitchen for the past
            six months and having run a sucessful Kickstarter campaign, our
            intention is is to now bring these remarkably designed, premium
            knives to your kitchen.
          </p>
          <p className="text-xl">Make cooking great again with our Osiris Chef Knives! </p>
        </div>
      </div>
      <OrisisMain data={products} />
    </div>
  );
};

export default Orisis;
