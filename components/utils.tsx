import { CircularProgress } from '@mui/material';

export const Loader = ({ className, text }: any) => {
  return (
    <div className={`flex ${className ?? ''}`}>
      <div className='m-auto flex gap-2 items-center'>
        <CircularProgress color='inherit' />
        {text && <p>{text}</p>}
      </div>
    </div>
  );
};

export const reloadBrowser = () => {
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
};

export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
};
