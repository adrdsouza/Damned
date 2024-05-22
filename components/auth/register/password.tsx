interface PasswordProps {
  className?: string;
  setRegister?: any;
  signType?: any;
}

const Password = (props: PasswordProps) => {
  return (
    <div className={`${props.className}`}>
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
    </div>
  );
};

export default Password;
