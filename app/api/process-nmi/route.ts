export async function POST(request: Request) {
  try {
    const h: any = request.headers;
    const { body, headers } = await request.json();
    const { token, order } = body;
    console.log(body);
    console.log(headers);
    console.log(h);

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
      shipping_email: order.shipping.email,
    };

    const req = {
      type: 'sale',
      security_key: process.env.NMI_PRIVATE_KEY,
      payment_token: token.token,
      ccnumber: token.card.number,
      ccexp: token.card.exp,
      //cvv: token,
      amount: order.total,
      curreny: 'USD',
      orderid: order.databaseId,

      //ipaddress: headers['x-real-ip'],
      customer_receipt: true,

      ...billingInfo,
      ...shippingInfo,

      //
    };

    console.log(req);
  } catch (error) {
    console.log(error);
  }
}

const orderData = {
  id: 'b3JkZXI6NTMwOTA=',
  databaseId: 53090,
  orderKey: 'wc_order_JcqYbdQgFGxiT',
  orderNumber: '53090',
  status: 'PROCESSING',
  date: '2024-08-06T18:39:38+00:00',
  paymentMethodTitle: 'NMI',
  subtotal: '$75.00',
  shippingTotal: '$8.00',
  shippingTax: '$0.00',
  discountTotal: '$0.00',
  discountTax: '$0.00',
  totalTax: '$0.00',
  total: '$83.00',
  billing: {
    firstName: 'test from nextjs',
    lastName: 'Kamal',
    company: null,
    address1: 'Lahore',
    address2: 'Lahore',
    city: 'Lahore',
    state: 'PB',
    postcode: '54000',
    country: 'PK',
    email: 'fareedkamal.dev@gmail.com',
    phone: '77777777777',
  },
  shipping: {
    firstName: null,
    lastName: null,
    company: null,
    address1: null,
    address2: null,
    city: null,
    state: null,
    postcode: null,
    country: null,
    email: null,
    phone: null,
  },
  lineItems: {
    nodes: [
      {
        id: 'b3JkZXJfaXRlbTo1MzA5MCs3MzgxNA==',
        databaseId: 73814,
        product: {
          node: {
            id: 'cHJvZHVjdDo0MTEyNQ==',
            databaseId: 41125,
            name: 'Basilisk Fixed',
            slug: 'basilisk-fixed',
            type: 'VARIABLE',
            image: {
              id: 'cG9zdDo0OTIyNQ==',
              sourceUrl:
                'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
              altText: '',
            },
            price: '$75.00',
            regularPrice: '$75.00',
            salePrice: null,
            stockStatus: 'IN_STOCK',
            stockQuantity: null,
            soldIndividually: false,
          },
        },
        variation: {
          node: {
            id: 'cHJvZHVjdF92YXJpYXRpb246NDExNDc=',
            databaseId: 41147,
            name: 'Basilisk Fixed - Black G10, Stonewashed 14c28n',
            slug: 'basilisk-fixed',
            type: 'VARIATION',
            image: {
              id: 'cG9zdDo0OTIyNQ==',
              sourceUrl:
                'https://admin.damneddesigns.com/wp-content/uploads/DSC_0219-01-800x600.png',
              altText: '',
            },
            price: '$75.00',
            regularPrice: '$75.00',
            salePrice: null,
            stockStatus: 'IN_STOCK',
            stockQuantity: 1,
            soldIndividually: null,
          },
        },
        quantity: 1,
        total: '75',
        subtotal: '75',
        subtotalTax: null,
      },
    ],
  },
};

const token = {
  tokenType: 'inline',
  token: 'gpxE2G97-exjG7C-xAvdqk-f7b5972P88zJ',
  card: {
    number: '559049******1142',
    bin: '559049',
    exp: '0628',
    type: 'mastercard',
    hash: '',
  },
  check: {
    name: null,
    account: null,
    aba: null,
    transit: null,
    institution: null,
    hash: null,
  },
  wallet: {
    cardDetails: null,
    cardNetwork: null,
    email: null,
    billingInfo: {
      address1: null,
      address2: null,
      firstName: null,
      lastName: null,
      postalCode: null,
      city: null,
      state: null,
      country: null,
      phone: null,
    },
    shippingInfo: {
      method: null,
      address1: null,
      address2: null,
      firstName: null,
      lastName: null,
      postalCode: null,
      city: null,
      state: null,
      country: null,
      phone: null,
    },
  },
};
