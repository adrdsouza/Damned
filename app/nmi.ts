'use server';

import axios from 'axios';

export const processNmiPayment = async () => {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set('type', 'sale');
    encodedParams.set('ccnumber', '4111111111111111');
    encodedParams.set('ccexp', '1025');
    encodedParams.set('cvv', '123');
    encodedParams.set('amount', '1');
    encodedParams.set('security_key', '6457Thfj624V5r7WUwc5v6a68Zsd6YEm');

    const options = {
      method: 'POST',
      url: 'https://secure.nmi.com/api/transact.php',
      headers: {
        accept: 'application/x-www-form-urlencoded',
        'content-type': 'application/x-www-form-urlencoded',
      },
      data: encodedParams,
    };

    const res = await axios.request(options);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
