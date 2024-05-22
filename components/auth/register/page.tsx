interface RegisterFormProps {
  className?: string;
  setRegister?: any;
  signType?: any;
}

const RegisterForm = (props: RegisterFormProps) => {
  return (
    <div className={`${props.className} lg:px-10`}>
      <div className="mt-5 grid grid-cols-1 gap-3 items-center">
        <label className="text-sm" htmlFor="name">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Enter your name"
          className="px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
        />        
        <label className="text-sm" htmlFor="email">
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
            <div className="relative">
              <input
                type="password"
                id="password"
                className="block w-full px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
                placeholder="Password"
                required
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold" htmlFor="">
            Confirm
          </label>
          <div>
            <label
              htmlFor="password"
              className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="block w-full px-3 py-2.5 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-violet-300"
                placeholder="Password"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex">
          <input type="checkbox" name="apply" id="apply" className="mr-3" />
          <label className="text-sm" htmlFor="apply">
            I have read and agree to MyVisaUSAs Terms and Conditions and Privacy
            Policy
          </label>
        </div>
        <button
          className="w-full py-3 bg-gradient-to-b from-gray-600 to-gray-900 rounded-lg text-white text-center"
          onClick={() => props.setRegister()}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
