interface PhoneProps {
  className?: string;
  signType?: any;
  loginType?: any;
}

const Phone = (props: PhoneProps) => {
  return (
    <div className={`${props.className} lg:mt-10`}>
      <p className="text-4xl text-center font-bold">Welcome Back!</p>
      <p className="text-lg text-center text-slate-600">
        Lets get you one step closer to your United States Visa.&apos
      </p>
      <div className="mt-10 grid grid-cols-1 gap-3 items-center">
        <label className="text-sm" htmlFor="phone">
          Email
        </label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Enter your email"
          className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
        />

        <div>
          <label className="text-sm font-semibold" htmlFor="">
            Password
          </label>
          <div>
            <label
              htmlFor="password"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Password
            </label>
            <div className="relative my-2">
              <input
                type="password"
                id="password"
                className="block w-full p-3 ps-5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-violet-300"
                placeholder="Password"
                required
              />
              
            </div>
          </div>
        </div>
        <div className="flex">
          <a
            className="text-gray-900 text-sm font-semibold"
            href="#"
            onClick={() => props.loginType()}
          >
          </a>
        </div>
        <button className="w-full mt-5 py-3 bg-gradient-to-b from-gray-600 to-gray-900 rounded-lg text-white text-center">
          Log In
        </button>
        
      </div>
    </div>
  );
};

export default Phone;
