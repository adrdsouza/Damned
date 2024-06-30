import { NextResponse as BaseResponse } from 'next/server';

import {
  CountriesEnum,
  getClientWithSdk,
} from '@/graphql';

type ResponseBody = {
  countries: {
    name: string;
    code: CountriesEnum;
  }[];
} | {
  errors: {
    message: string;
  };
}

const NextResponse = BaseResponse<ResponseBody>;

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
export async function GET(request: Request) {
  try {
    const client = getClientWithSdk();

    const { allowedCountries } = await client.GetCountries();

    if (!allowedCountries) {
      return NextResponse.json({ errors: { message: 'Currently not selling to any countries' } }, { status: 500 });
    }

    const countries = (allowedCountries as CountriesEnum[]).map((code) => ({
      name: regionNames.of(code) as string,
      code
    }));

    return NextResponse.json({ countries }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ errors: { message: 'Sorry, something went wrong' } }, { status: 500 });
  }
}