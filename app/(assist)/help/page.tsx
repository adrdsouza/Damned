const Help: React.FC = () => {
  return (
    <div className={`lg:my-20 lg:mx-96 px-20`}>
      <p className="text-4xl text-center bold-semibold">HELP</p>
      <p className="text-md text-center mt-2">
        In stock products will be dispatched within 2 working days. Pre order
        products will ship on the expected ship date visible on the product page
        and the order confirmation email.
      </p>
      <p className="tex-md text-center mt-2">
        Packages are shipped out of Reno, Nevada, U.S.A. by USPS First class or
        equivalent.
      </p>
      <p className="text-md mt-32">
        To track your order your Order ID in the box below andpress the track
        button. This was give to you on your receipt and in the confirmation
        email you should have received.
      </p>
      <div className="flex mt-10">
        <div className="grid gap-4">
          <label htmlFor="">Order ID</label>
          <input
            type="email"
            name="name"
            id="name"
            placeholder="Found in your order confirmation email."
            className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
          />
        </div>
        <div className="grid gap-4 lg:ml-8">
          <label htmlFor="">Billing email</label>
          <input
            type="email"
            name="name"
            id="name"
            placeholder="Email you used during checkout."
            className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
          />
        </div>
      </div>
      <button className="lg:mt-8 px-20 py-3 bg-gradient-to-b from-gray-600 to-gray-900 rounded-lg text-white text-center">
        Track
      </button>
    </div>
  );
};

export default Help;
