import { NextResponse as BaseResponse } from 'next/server';

import {
  CountriesEnum,
  CountryState,
  getClientWithSdk,
} from '@/graphql';

type ResponseBody = {
  states: CountryState[];
} | {
  errors: {
    message: string;
  };
}

const NextResponse = BaseResponse<ResponseBody>;

export async function GET(
  request: Request,
  { params }: { params: { country: CountriesEnum } },
) {
  try {
    const { country } = params;
    const client = getClientWithSdk();

    if (!CountriesEnum[country]) {
      return NextResponse.json({ errors: { message: 'Invalid country code' } }, { status: 500 });
    }

    const { countryStates } = await client.GetCountryStates({ country });

    if (!countryStates) {
      return NextResponse.json({ errors: { message: 'Failed to retrieve country states' } }, { status: 500 });
    }

    return NextResponse.json({ countryStates }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}