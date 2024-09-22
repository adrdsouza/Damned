import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let ip: any = request.headers.get('cf-connecting-ip');
    if (!ip) {
      ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim();
    }

    const body = await request.json();
    const { token, order } = body;

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

      ipaddress: ip,
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
          accept: 'application/x-www-form-urlencoded',
          'content-type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          type: 'sale',
          ccnumber: '4111111111111111',
          ccexp: '1025',
          cvv: '123',
          amount: '1',
          security_key: '6457Thfj624V5r7WUwc5v6a68Zsd6YEm',
        }),
      }
    );

    console.log(response);

    if (response.status !== 200) {
      throw new Error();
    }

    const nmiResponse = await response.text();

    const params: any = new URLSearchParams(nmiResponse);
    const result: any = {};

    for (const [key, value] of params.entries()) {
      result[key] = value;
    }

    console.log(result);

    return NextResponse.json({ status: true, data: result });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: false });
  }
}
