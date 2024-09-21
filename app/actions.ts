'use server';

export async function nmiAction(data) {
  try {
    const { token, order } = data;

    const orderDesc = order?.lineItems?.nodes
      .map((node) => `${node?.variation?.node.name} × ${node.quantity}`)
      .join(', ');

    const billingInfo = {
      first_name: order.billing.firstName,
      last_name: order.billing.lastName,
      address1: order.billing.address1,
      address2: order.billing.address2,
      city: order.billing.city,
      state: order.billing.state,
      zip: order.billing.postcode,
      country: order.billing.country,
      phone: order.billing.phone,
      email: order.billing.email,
    };

    const shippingInfo = {
      shipping_firstname: order.shipping.firstName,
      shipping_lastname: order.shipping.lastName,
      shipping_address1: order.shipping.address1,
      shipping_address2: order.shipping.address2,
      shipping_city: order.shipping.city,
      shipping_state: order.shipping.state,
      shipping_country: order.shipping.country,
      shipping_zip: order.shipping.postcode,
    };

    const req: any = {
      type: 'sale',
      security_key: process.env.NMI_PRIVATE_KEY,
      payment_token: token.token,

      ccnumber: token.card.number,
      ccexp: token.card.exp,

      //amount: order.total.replace('$', ''),
      amount: '0.00',
      curreny: 'USD',
      orderid: order.orderNumber,
      order_description: `Damned Designs - Order ${order.orderNumber} (${orderDesc})`,

      //ipaddress: ip,
      customer_receipt: true,

      ...billingInfo,
      ...shippingInfo,
    };

    const reqData: any = new URLSearchParams(req);

    console.log(reqData);

    const response = await fetch(
      'https://secure.networkmerchants.com/api/transact.php',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: reqData,
      }
    );

    // const response = await axios.post(
    //   'https://secure.networkmerchants.com/api/transact.php',
    //   reqData,
    //   {
    //     headers: {
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     timeout: 20000,
    //   }
    // );

    console.log(response);

    if (response.status !== 200) {
      throw new Error();
    }

    const nmiResponse = await response.text();

    console.log(nmiResponse);

    // const params: any = new URLSearchParams(nmiResponse);
    // const result: any = {};

    // for (const [key, value] of params.entries()) {
    //   result[key] = value;
    // }

    // console.log(result);

    return nmiResponse;
  } catch (error) {
    console.log(error);
    return 'Error while completing transaction';
  }
}
