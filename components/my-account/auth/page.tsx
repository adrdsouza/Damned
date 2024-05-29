"use client";

import Register from "@/components/my-account/auth/register/page";
import Login from "@/components/my-account/auth/login/page";
import classnames from "classnames";
import { useState } from "react";

const Auth: React.FC = () => {
  const [auth, setAuth] = useState<Boolean>(false);

  const handleAuth = (flag: Boolean) => setAuth(flag);

  return (
    <div className={`grid justify-items-center lg:my-20`}>
      <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px lg:text-4xl">
          <li className="me-2">
            <a
              href="#"
              onClick={() => handleAuth(false)}
              className={classnames(
                { "border-gray-600": !auth },
                "inline-block p-4 border-b-2 rounded-t-lg hover:text-gray-600 dark:hover:text-gray-300"
              )}
            >
              <span>Register</span>
            </a>
          </li>
          <li className="me-2">
            <a
              href="#"
              onClick={() => handleAuth(true)}
              className={classnames(
                { "border-gray-600": auth },
                "inline-block p-4 text-gray-600 border-b-2 rounded-t-lg dark:text-gray-500 dark:border-gray-500"
              )}
              // aria-current="page"
            >
              Login
            </a>
          </li>
        </ul>
      </div>
      <Register className={`${auth ? "hidden" : "block"}`} />
      <Login className={`${auth ? "block" : "hidden"}`} />
    </div>
  );
};

export default Auth;
