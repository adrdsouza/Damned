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
    setTimeout(() => {
      window.location.reload();
    }, 4000);
  }
};

export const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    window.localStorage.clear();
  }
};

export const getLocalStorageItem = (key) => {
  if (typeof window !== 'undefined') {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }
  return null;
};

export const setLocalStorageItem = (key, value) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
};

export const storeCustomerInformation = (customer) => {
  setLocalStorageItem('customerId', customer?.databaseId);
};
