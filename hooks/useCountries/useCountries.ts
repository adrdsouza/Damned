import { useEffect, useState } from 'react';
import { DAY_IN_SECONDS } from '@woographql/session-utils';

import { apiCall } from "@/utils/apiCall";
import { CountriesEnum, CountryState } from "@/graphql";

type Country = {
  name: string;
  code: CountriesEnum;
}

const regionNames = new Intl.DisplayNames(['en'], {type: 'region'});
const defaultCountries: Country[] = Object.values(CountriesEnum).map((country) => ({
  name: regionNames.of(country) as string,
  code: country,
}));
export function useCountries(country?: CountriesEnum) {
  const [countries, setCountries] = useState<Country[]>(defaultCountries);
  const [states, setStates] = useState<CountryState[]>([]);

  useEffect(() => {
    apiCall<{ countries: Country[] }>(
      '/api/countries',
      {
        method: 'GET',
        next: { revalidate: 24 * DAY_IN_SECONDS },
      },
    ).then(({ countries }) => setCountries(countries));
  }, []);

  useEffect(() => {
    if (country) {
      apiCall<{ countryStates: CountryState[] }>(
        `/api/countries/${country}`,
        {
          method: 'GET',
          cache: 'force-cache',
          next: { revalidate: 365 * DAY_IN_SECONDS },
        },
      ).then(({ countryStates }) => setStates(countryStates));
    }
  }, [country]);

  const store = { countries, states };

  return store;
}