'use client';

import classnames from 'classnames';
import { useState } from 'react';
import LoginForm from './login/page';
import RegisterForm from './register/page';

const Auth: React.FC = () => {
  const [showLogin, setShowLogin] = useState<Boolean>(true);

  return (
    <div className='px-[30px] py-[2em] md:py-[5em] 2xl:w-[1440px] w-full m-auto'>
      <div className=' max-w-[600px] w-full m-auto'>
        <p className='text-center font-medium text-3xl mb-8'>
          ACCOUNT DASHBOARD
        </p>
        <div className='flex cursor-pointer'>
          <div
            onClick={() => setShowLogin(true)}
            className={classnames(
              { 'bg-black text-center text-white': showLogin },
              { 'bg-gray-100 text-center text-black': !showLogin },
              ' flex-1 p-3'
            )}
            // aria-current="page"
          >
            Login
          </div>
          <div
            onClick={() => setShowLogin(false)}
            className={classnames(
              { 'bg-black text-center text-white': !showLogin },
              { 'bg-gray-100 text-center text-black': showLogin },
              ' flex-1 p-3 '
            )}
            // aria-current="page"
          >
            Sign Up
          </div>
        </div>
        {showLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default Auth;
