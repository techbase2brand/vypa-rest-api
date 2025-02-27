import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import Radio from '@/components/ui/radio/radio';
import TextArea from '@/components/ui/text-area';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import { useModalState } from '@/components/ui/modal/modal.context';
import { Form } from '@/components/ui/form/form';
import { AddressType, GoogleMapLocation } from '@/types';
import { useSettings } from '@/contexts/settings.context';
import { Controller } from 'react-hook-form';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { useEffect, useState } from 'react';
import Select from '../ui/select/select';
import { Country, State, City } from 'country-state-city';

type FormValues = {
  title: string;
  type: string;
  address: {
    country: string;
    city: string;
    state: string;
    zip: string;
    street_address: string;
  };
  location: GoogleMapLocation;
};

const addressSchema = yup.object().shape({
  type: yup
    .string()
    .oneOf([AddressType.Billing, AddressType.Shipping, AddressType.For_both])
    .required('error-type-required'),
  title: yup.string().required('error-title-required'),
  address: yup.object().shape({
    country: yup.string().required('error-country-required'),
    city: yup.string().required('error-city-required'),
    state: yup.string().required('error-state-required'),
    zip: yup.string().required('error-zip-required'),
    street_address: yup.string().required('error-street-required'),
  }),
});

const AddressForm: React.FC<any> = ({ onSubmit }) => {
  const { t } = useTranslation('common');
  const { useGoogleMap } = useSettings();
  const {
    data: { address, type },
  } = useModalState();
  console.log('addressaddressaddressaddressaddress,,,,,', address);

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(
    address?.address?.country || 'AU',
  );
  const [selectedState, setSelectedState] = useState(
    address?.address?.state || '',
  );
  const [selectedCity, setSelectedCity] = useState(
    address?.address?.city || '',
  );
  // Fetch countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    // @ts-ignore
    setCountries(countryList);
    const stateList = State.getStatesOfCountry('AU');
    // @ts-ignore
    setStates(stateList);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      const stateList = State.getStatesOfCountry(selectedCountry);
      // @ts-ignore
      setStates(stateList);
    }
    if (selectedState) {
      const cityList = City.getCitiesOfState(selectedCountry, selectedState);
      // @ts-ignore
      setCities(cityList);
    }
  }, [selectedCountry, selectedState]);

  // Fetch states when a country is selected
  const handleCountryChange = (e: any) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);

    setSelectedState('');
    setSelectedCity('');
    const stateList = State.getStatesOfCountry(countryCode);
    // @ts-ignore
    setStates(stateList);
    setCities([]); // Clear cities when changing country
  };

  // Fetch cities when a state is selected
  const handleStateChange = (e: any) => {
    console.log('handleStateChange', e.target.value);
    const stateCode = e.target.value;
    setSelectedState(stateCode);

    setSelectedCity('');
    const cityList = City.getCitiesOfState(selectedCountry, stateCode);
    // @ts-ignore
    setCities(cityList);
  };

  const handleCityChange = (e: any) => {
    console.log('handleCityChange', e);
    const cityCode = e.target.value;

    setSelectedCity(e.target.value);
  };

  return (
    <div className="min-h-screen p-5 bg-light sm:p-8 md:min-h-0 md:rounded-xl">
      <h1 className="mb-4 text-lg font-semibold text-center text-heading sm:mb-6">
        {address ? t('text-update') : t('text-add-new')} {t('text-address')}
      </h1>
      <Form<FormValues>
        onSubmit={onSubmit}
        className="grid h-full grid-cols-2 gap-5"
        //@ts-ignore
        validationSchema={addressSchema}
        options={{
          shouldUnregister: true,
          defaultValues: {
            title: address?.title ?? '',
            type: address?.type ?? type,
            address: {
              // city: address?.address?.city ?? '',
              // country: address?.address?.country ?? '',
              // state: address?.address?.state ?? '',
              zip: address?.address?.zip ?? '',
              street_address: address?.address?.street_address ?? '',
              ...address?.address,
            },
            location: address?.location ?? '',
          },
        }}
        resetValues={{
          title: address?.title ?? '',
          type: address?.type ?? type,
          ...(address?.address && address),
        }}
      >
        {({
          register,
          control,
          getValues,
          setValue,
          formState: { errors },
        }) => (
          <>
            <div>
              <Label>{t('text-type')}</Label>
              <div className="flex items-center space-s-4">
                <Radio
                  id="billing"
                  {...register('type')}
                  type="radio"
                  value={AddressType.Billing}
                  label={t('text-billing')}
                />
                <Radio
                  id="shipping"
                  {...register('type')}
                  type="radio"
                  value={AddressType.Shipping}
                  label={t('text-shipping')}
                />
                <Radio
                  id="both"
                  {...register('type')}
                  type="radio"
                  value={AddressType.For_both}
                  label={t('Both')}
                />
              </div>
            </div>

            <Input
              label={t('text-title')}
              {...register('title')}
              error={t(errors.title?.message!)}
              variant="outline"
              className="col-span-2"
            />

            {useGoogleMap && (
              <div className="col-span-2">
                <Label>{t('text-location')}</Label>
                <Controller
                  control={control}
                  name="location"
                  render={({ field: { onChange } }) => (
                    <GooglePlacesAutocomplete
                      icon={true}
                      //@ts-ignore
                      // onChange={(location: any) => {
                      //   onChange(location);
                      //   setValue('address.country', location?.country);
                      //   setValue('address.city', location?.city);
                      //   setValue('address.state', location?.state);
                      //   setValue('address.zip', location?.zip);
                      //   setValue(
                      //     'address.street_address',
                      //     location?.street_address,
                      //   );
                      //   setValue(
                      //     'title',
                      //     location?.title,
                      //   );
                      // }}
                      data={getValues('location')!}
                    />
                  )}
                />
              </div>
            )}

            {/* <Input
              label={t('text-country')}
              {...register('address.country')}
              error={t(errors.address?.country?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-city')}
              {...register('address.city')}
              error={t(errors.address?.city?.message!)}
              variant="outline"
            />

            <Input
              label={t('text-state')}
              {...register('address.state')}
              error={t(errors.address?.state?.message!)}
              variant="outline"
            /> */}

            <div className="mb-5">
              <label
                htmlFor="userType"
                className="block text-sm text-black font-medium"
              >
                Country
              </label>
              <select
                value={selectedCountry}
                {...register('address.country')}
                onChange={handleCountryChange}
                className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  // @ts-ignore
                  <option key={country.isoCode} value={country.isoCode}>
                    {/* @ts-ignore */}
                    {country.name}
                  </option>
                ))}
              </select>

              <p className="my-2 text-xs text-red-500 text-start">
                {errors.address?.country?.message!}
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="userType"
                className="block text-sm text-black font-medium"
              >
                State
              </label>
              <select
                value={selectedState}
                {...register('address.state')}
                onChange={handleStateChange}
                className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  // @ts-ignore
                  <option key={state.isoCode} value={state.isoCode}>
                    {/* @ts-ignore */}
                    {state.name}
                  </option>
                ))}
              </select>
              <p className="my-2 text-xs text-red-500 text-start">
                {errors.address?.state?.message!}
              </p>
            </div>

            <div className="mb-5">
              <label
                htmlFor="userType"
                className="block text-sm text-black font-medium"
              >
                City
              </label>
              <select
                value={selectedCity}
                {...register('address.city')}
                onChange={handleCityChange}
                className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                required
              >
                <option value="">Select City</option>
                {cities?.map((city) => (
                  // @ts-ignore
                  <option key={city.name} value={city.name}>
                    {/* @ts-ignore */}
                    {city.name}
                  </option>
                ))}
              </select>
              <p className="my-2 text-xs text-red-500 text-start">
                {errors.address?.city?.message!}
              </p>
            </div>

            <Input
              label={t('text-zip')}
              {...register('address.zip')}
              error={t(errors.address?.zip?.message!)}
              variant="outline"
            />

            <TextArea
              label={t('text-street-address')}
              {...register('address.street_address')}
              error={t(errors.address?.street_address?.message!)}
              variant="outline"
              className="col-span-2"
            />

            <Button className="w-full col-span-2">
              {address ? t('text-update') : t('text-save')} {t('text-address')}
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default AddressForm;
