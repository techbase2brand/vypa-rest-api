// import Alert from '@/components/ui/alert';
// import Button from '@/components/ui/button';
// import Input from '@/components/ui/input';
// import PasswordInput from '@/components/ui/password-input';
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { Routes } from '@/config/routes';
// import { useTranslation } from 'next-i18next';
// import { yupResolver } from '@hookform/resolvers/yup';
// import * as yup from 'yup';
// import Link from '@/components/ui/link';
// import {
//   allowedRoles,
//   hasAccess,
//   setAuthCredentials,
// } from '@/utils/auth-utils';
// import { Permission } from '@/types';
// import { useRegisterMutation } from '@/data/user';

// type FormValues = {
//   name: string;
//   email: string;
//   password: string;
//   permission: Permission;
// };
// const registrationFormSchema = yup.object().shape({
//   name: yup.string().required('form:error-name-required'),
//   email: yup
//     .string()
//     .email('form:error-email-format')
//     .required('form:error-email-required'),
//   password: yup.string().required('form:error-password-required'),
//   permission: yup.string().default('store_owner').oneOf(['store_owner']),
// });
// const RegistrationForm = () => {
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const { mutate: registerUser, isLoading: loading } = useRegisterMutation();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setError,
//   } = useForm({
//     resolver: yupResolver(registrationFormSchema),
//     defaultValues: {
//       permission: Permission.StoreOwner,
//     },
//   });
//   const router = useRouter();
//   const { t } = useTranslation();

//   async function onSubmit({ name, email, password, permission }: FormValues) {
//     registerUser(
//       {
//         name,
//         email,
//         password,
//         //@ts-ignore
//         permission,
//       },

//       {
//         onSuccess: (data) => {
//           if (data?.token) {
//             if (hasAccess(allowedRoles, data?.permissions)) {
//               setAuthCredentials(data?.token, data?.permissions, data?.role);
//               router.push(Routes.dashboard);
//               return;
//             }
//             setErrorMessage('form:error-enough-permission');
//           } else {
//             setErrorMessage('form:error-credential-wrong');
//           }
//         },
//         onError: (error: any) => {
//           Object.keys(error?.response?.data).forEach((field: any) => {
//             setError(field, {
//               type: 'manual',
//               message: error?.response?.data[field],
//             });
//           });
//         },
//       },
//     );
//   }

//   return (
//     <>
//       <form
//         onSubmit={handleSubmit(
//           //@ts-ignore
//           onSubmit,
//         )}
//         noValidate
//       >
//         <Input
//           label={t('form:input-label-name')}
//           {...register('name')}
//           variant="outline"
//           className="mb-4"
//           error={t(errors?.name?.message!)}
//         />
//         <Input
//           label={t('form:input-label-email')}
//           {...register('email')}
//           type="email"
//           variant="outline"
//           className="mb-4"
//           error={t(errors?.email?.message!)}
//         />
//         <PasswordInput
//           label={t('form:input-label-password')}
//           {...register('password')}
//           error={t(errors?.password?.message!)}
//           variant="outline"
//           className="mb-4"
//         />
//         <Button className="w-full" loading={loading} disabled={loading}>
//           {t('form:text-register')}
//         </Button>

//         {errorMessage ? (
//           <Alert
//             message={t(errorMessage)}
//             variant="error"
//             closeable={true}
//             className="mt-5"
//             onClose={() => setErrorMessage(null)}
//           />
//         ) : null}
//       </form>
//       <div className="relative flex flex-col items-center justify-center mt-8 mb-6 text-sm text-heading sm:mt-11 sm:mb-8">
//         <hr className="w-full" />
//         <span className="start-2/4 -ms-4 absolute -top-2.5 bg-light px-2">
//           {t('common:text-or')}
//         </span>
//       </div>
//       <div className="text-sm text-center text-body sm:text-base">
//         {t('form:text-already-account')}{' '}
//         <Link
//           href={Routes.login}
//           className="font-semibold underline transition-colors duration-200 ms-1 text-accent hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
//         >
//           {t('form:button-label-login')}
//         </Link>
//       </div>
//     </>
//   );
// };

// export default RegistrationForm;

import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { EditIcon } from '@/components/icons/edit';
import * as socialIcons from '@/components/icons/social';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import { useCreateShopMutation, useUpdateShopMutation } from '@/data/shop';
import { useRegisterMutation } from '@/data/user';
import {
  BalanceInput,
  IImage,
  ItemProps,
  Shop,
  ShopSettings,
  ShopSocialInput,
  UserAddressInput,
  BusinessContactdetailInput,
  LoginDetailsInput,
  PrimaryContactdetailInput,
  Attachment,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import { getFormattedImage } from '@/utils/get-formatted-image';
import { getIcon } from '@/utils/get-icon';
import { yupResolver } from '@hookform/resolvers/yup';
import { join, split } from 'lodash';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import OpenAIButton from '../openAI/openAI.button';
import { useAtom } from 'jotai';
import { locationAtom } from '@/utils/use-location';
import { useModalAction } from '../ui/modal/modal.context';
import { shopValidationSchema } from '../shop/shop-validation-schema';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';
import { Country, State, City } from 'country-state-city';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import { toast } from 'react-toastify';
import * as yup from 'yup';

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex items-center justify-center w-4 h-4">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  reference: string;
  slug: string;
  description: string;
  cover_image: any;
  logo: any;
  balance: BalanceInput;
  address: UserAddressInput;
  businessContactdetail: BusinessContactdetailInput;
  loginDetails: LoginDetailsInput;
  primary_contact_detail: PrimaryContactdetailInput;
  settings: ShopSettings;
  isShopUnderMaintenance?: boolean;
};
const registrationFormSchema = yup.object().shape({
  // Company Details
  name: yup.string().required('Company Name is required'), // Matches the validation doc

  address: yup.object().shape({
    street_address: yup.string().required('Company Address is required'), // Matches the validation doc
    country: yup.string().required('Country is required'), // Matches the validation doc
    state: yup.string().required('State is required'), // Matches the validation doc
    city: yup.string().required('City is required'), // Matches the validation doc
    zip: yup
      .string()
      .matches(/^\d{4,10}$/, 'Invalid Post Code') // Numeric, 4–10 digits
      .required('Post Code is required'), // Matches the validation doc
  }),

  // Business Contact Details
  businessContactdetail: yup.object().shape({
    business_phone: yup
      .string()
      .matches(/^\d+$/, 'Business Phone No. must be numeric') // Accepts only numeric
      .required('Business Phone No. is required'), // Matches the validation doc

    fax: yup
      .string()
      .nullable()
      .matches(/^\+?[0-9]*$/, 'Invalid Fax number'), // Optional, numeric/standard format

    email: yup
      .string()
      .email('Invalid Email address')
      .required('Email Address is required'), // Matches the validation doc

    website: yup.string().url('Invalid Website URL'), // Optional, must be a valid URL
  }),

  // Primary Contact Details
  primary_contact_detail: yup.object().shape({
    firstname: yup
      .string()
      .matches(
        /^[a-zA-Z\s]{2,}$/,
        'First Name must contain at least 2 letters and no special characters',
      ) // At least 2 characters, no special characters
      .required('First Name is required'), // Matches the validation doc

    lastname: yup
      .string()
      .matches(
        /^[a-zA-Z\s]{2,}$/,
        'Last Name must contain at least 2 letters and no special characters',
      ) // At least 2 characters, no special characters
      .required('Last Name is required'), // Matches the validation doc

    email: yup
      .string()
      .email('Invalid Email address')
      .required('Email is required'), // Matches the validation doc

    mobile: yup
      .string()
      .matches(/^\+?[0-9]{9,15}$/, 'Invalid Mobile No.') // Starts with a valid country code, 9–15 digits
      .required('Mobile No. is required'), // Matches the validation doc
  }),

  // Login Details
  loginDetails: yup.object().shape({
    'username or email': yup
      .string()
      .required('Username or E-mail is required') // Required field
      .test(
        'usernameOrEmail',
        'Invalid Username or Email',
        (value) =>
          /^[a-zA-Z0-9_]+$/.test(value) || // Alphanumeric with underscores
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), // Valid email format
      ),

    password: yup
      .string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters')
      .max(20, 'Password must not exceed 20 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      ),

    confirmpassword: yup
      .string()
      .required('Confirm Password is required')
      .oneOf([yup.ref('password')], 'Passwords do not match'), // Must match the password
  }),
});
const RegistrationForm = ({ initialValues }: { initialValues?: Shop }) => {
  const [userType, setUserType] = useState(''); // State to track user selection

  const handleSelectChange = (event: any) => {
    setUserType(event.target.value); // Update state when user selects an option
  };
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: registerUser, isLoading: loading } = useRegisterMutation();
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  const { permissions } = getAuthCredentials();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
    setError,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
            logo: getFormattedImage(initialValues?.logo as IImage),
            cover_image: getFormattedImage(
              initialValues?.cover_image as IImage,
            ),
          },
        }
      : {}),
    // @ts-ignore
    resolver: yupResolver(registrationFormSchema),
    // resolver: yupResolver(shopValidationSchema),
  });
  const router = useRouter();

  const { openModal } = useModalAction();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const shopDescriptionSuggestionLists = useMemo(() => {
    return ShopDescriptionSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);
  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'description',
      suggestion: shopDescriptionSuggestionLists as ItemProps[],
    });
  }, [generateName]);

  const slugAutoSuggest = formatSlug(watch('name'));

  const startDate = useWatch({
    name: 'settings.shopMaintenance.start',
    control,
  });
  const untilDate = useWatch({
    name: 'settings.shopMaintenance.until',
    control,
  });

  const { t } = useTranslation();

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    (router?.query?.action === 'edit' || router?.pathname === '/[shop]/edit') &&
    router?.locale === Config.defaultLanguage;

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    // Add the `password_confirmation` field dynamically
    const updatedValues = {
      ...values,
      loginDetails: {
        ...values.loginDetails,
        password_confirmation: values.loginDetails.password, // Set password_confirmation to match password
      },
    };
    console.log('Updated Values:', updatedValues);
    if (initialValues) {
      const { ...restAddress } = updatedValues.address;
      updateShop({
        id: initialValues?.id as string,
        ...updatedValues,
        address: restAddress,
        balance: {
          id: initialValues.balance?.id,
          ...updatedValues.balance,
        },
      });
    } else {
      createShop({
        ...updatedValues,
        balance: {
          ...updatedValues.balance,
        },
      });
    }
  }
  // async function onSubmit(values: FormValues) {
  //   router.push('/thanks');
  //   // registerUser(
  //   //   {
  //   //     // @ts-ignore
  //   //     values,
  //   //   },

  //   //   {
  //   //     onSuccess: (data) => {
  //   //       if (data?.token) {
  //   //         if (hasAccess(allowedRoles, data?.permissions)) {
  //   //           setAuthCredentials(data?.token, data?.permissions, data?.role);
  //   //           // router.push(Routes.dashboard);
  //   //           toast.success(t('Register sucessfully'));
  //   //           return;
  //   //         }
  //   //         setErrorMessage('form:error-enough-permission');
  //   //       } else {
  //   //         setErrorMessage('form:error-credential-wrong');
  //   //       }
  //   //     },
  //   //     onError: (error: any) => {
  //   //       Object.keys(error?.response?.data).forEach((field: any) => {
  //   //         setError(field, {
  //   //           type: 'manual',
  //   //           message: error?.response?.data[field],
  //   //         });
  //   //       });
  //   //     },
  //   //   },
  //   // );
  // }
  const isGoogleMapActive = options?.useGoogleMap;
  const askForAQuote = watch('settings.askForAQuote.enable');

  const coverImageInformation = (
    <span>
      {t('form:shop-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1170 x 435{t('common:text-px')}</span>
    </span>
  );

  let sameDay = useMemo(() => {
    return isSameDay(new Date(untilDate), new Date(startDate));
  }, [untilDate, startDate]);

  const filterUntilTime = (date: Date) => {
    if (sameDay) {
      const isPastTime =
        addMinutes(new Date(startDate), 15).getTime() > date.getTime();
      return !isPastTime;
    }
    return true;
  };

  const filterStartTime = (date: Date) => {
    let today = isToday(new Date(startDate));
    if (today) {
      const isPastTime = new Date(startDate).getTime() > date.getTime();
      return !isPastTime;
    }
    return true;
  };
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // Fetch countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    // @ts-ignore
    setCountries(countryList);
  }, []);

  // Fetch states when a country is selected
  const handleCountryChange = (e: any) => {
    console.log('handleCountryChange', e);

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

    setSelectedCity(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* <Card className="w-full sm:w-8/12 md:w-60 rounded">
            <FileInput
              name="logo"
              control={control}
              multiple={false}
              error={t(errors.logo?.message!)}
            />
          </Card> */}
        <div className="mt-10">
          <label
            htmlFor="userType"
            className="block text-md text-black font-medium"
          >
            Select User Type
          </label>
          <select
            id="userType"
            name="userType"
            className="my-5 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            value={userType}
            onChange={handleSelectChange}
          >
            <option value="">Select an option</option>
            <option value="company">Company</option>
            <option value="employee">Employee</option>
          </select>

          {/* Conditionally render the input based on user selection */}
          {userType === 'employee' && (
            <div className="my-5">
              <Input
                label={t('Reference Id')}
                {...register('reference')}
                variant="outline"
                className="mb-5"
                // error={t(errors.name?.message!)}
                // required
              />
            </div>
          )}
        </div>

        {userType !== 'employee' && (
          <div>
            <div className=" w-full gap-4">
              <div className="w-full pb-6 my-5 border-b border-dashed border-border-base  ">
                <Description
                  title={t('Business Detail')}
                  className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5 text-2xl"
                />

                <Input
                  label={t('Company Name')}
                  {...register('name')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.name?.message!)}
                  required
                />
                <Input
                  label={t('Company Address')}
                  {...register('address.street_address')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.address?.street_address?.message!)}
                  required
                />
                {/* <div className="flex gap-10">
              <div className="w-3/6      ">
                <Input
                  label={t('form:input-label-country')}
                  {...register('address.country')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.address?.country?.message!)}
                  required
                />
                <Input
                  label={t('form:input-label-state')}
                  {...register('address.state')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.address?.state?.message!)}
                  required
                />
              </div>
              <div className="w-3/6     ">
                <Input
                  label={t('form:input-label-city')}
                  {...register('address.city')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.address?.city?.message!)}
                  required
                />

                <Input
                  label={t('Post Code')}
                  {...register('address.zip')}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.address?.zip?.message!)}
                  required
                />
              </div>
            </div> */}
                <div className="flex gap-10">
                  <div className="w-3/6">
                    <div className="mb-5">
                      <label
                        htmlFor="userType"
                        className="block text-md text-black font-medium"
                      >
                        Country<span className="ml-0.5 text-red-500">*</span>
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
                        className="block text-md text-black font-medium"
                      >
                        State<span className="ml-0.5 text-red-500">*</span>
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
                  </div>
                  <div className="w-3/6">
                    <div className="mb-5">
                      <label
                        htmlFor="userType"
                        className="block text-md text-black font-medium"
                      >
                        City<span className="ml-0.5 text-red-500">*</span>
                      </label>
                      <select
                        value={selectedCity}
                        {...register('address.city')}
                        onChange={handleCityChange}
                        className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                        required
                      >
                        <option value="">Select City</option>
                        {cities.map((city) => (
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
                    <div className="mt-9">
                      <Input
                        label={t('Post Code')}
                        {...register('address.zip')}
                        variant="outline"
                        className="mb-0"
                        error={t(errors.address?.zip?.message!)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full pb-4  border-b border-gray-300 border-dashed  ">
                <Description
                  title={t('Business Contact details')}
                  className="w-full px-0   sm:w-4/12  mt-4 pb-4 sm:pe-4 md:w-full md:pe-5"
                />
                <div className="flex gap-10">
                  <div className="w-3/6   ">
                    <PhoneNumberInput
                      label={t('Business Phone No')}
                      required
                      {...register('businessContactdetail.business_phone')}
                      control={control}
                      error={t(
                        errors.businessContactdetail?.business_phone?.message!,
                      )}
                    />
                    <PhoneNumberInput
                      label={t('Mobile No')}
                      // required
                      {...register('businessContactdetail.mobile')}
                      control={control}
                      // error={t(errors.businessContactdetail?.mobile?.message!)}
                    />
                  </div>
                  <div className="w-3/6 ">
                    <Input
                      label={t('Fax')}
                      {...register('businessContactdetail.fax')}
                      variant="outline"
                      className="mb-5"
                      // error={t(errors.businessContactdetail?.fax?.message!)}
                      // required
                    />
                    <Input
                      label={t('Email')}
                      type="email"
                      {...register('businessContactdetail.email')}
                      variant="outline"
                      className="mb-5"
                      error={t(errors.businessContactdetail?.email?.message!)}
                      required
                    />
                  </div>
                </div>
                <Input
                  label={t('form:input-label-website')}
                  {...register('businessContactdetail.website')}
                  variant="outline"
                  className="mb-5"
                  // error={t(errors.businessContactdetail?.website?.message!)}
                  // required
                />
              </div>
            </div>

            <div className="  w-full gap-4">
              <div className="w-1/1 pb-4 mt-4  border-b border-dashed border-border-base">
                <Description
                  title={t('Primary Contact Detail')}
                  className="w-full px-0   sm:w-4/12  mt-4 pb-4 sm:pe-4 md:w-full md:pe-5"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('First Name')}
                    {...register('primary_contact_detail.firstname')}
                    variant="outline"
                    className="mb-2"
                    error={t(
                      errors.primary_contact_detail?.firstname?.message!,
                    )}
                    required
                  />
                  <Input
                    label={t('Last Name')}
                    {...register('primary_contact_detail.lastname')}
                    variant="outline"
                    className="mb-2"
                    required
                    error={t(errors.primary_contact_detail?.lastname?.message!)}
                  />

                  <Input
                    label={t('Job Title')}
                    {...register('primary_contact_detail.jobtitle')}
                    variant="outline"
                    className="mb-2"
                    // error={t(errors.primary_contact_detail?.jobtitle?.message!)}
                    // required
                  />
                  <Input
                    label={t('Email')}
                    {...register('primary_contact_detail.email')}
                    variant="outline"
                    className="mb-2"
                    error={t(errors.primary_contact_detail?.email?.message!)}
                    required
                  />
                  <PhoneNumberInput
                    label={t('Contact No')}
                    // required
                    {...register('primary_contact_detail.contact_no')}
                    control={control}
                    // error={t(errors.primary_contact_detail?.contact_no?.message!)}
                  />
                  <PhoneNumberInput
                    label={t('Mobile')}
                    required
                    {...register('primary_contact_detail.mobile')}
                    control={control}
                    error={t(errors.primary_contact_detail?.mobile?.message!)}
                  />
                </div>
              </div>
              <div className="w-3/1 pb-4 mb-4  border-b border-dashed border-border-base">
                <Description
                  title={t('Login Detail')}
                  className="w-full px-0   sm:w-4/12  mt-4 pb-4 sm:pe-4 md:w-full md:pe-5"
                />
                <Input
                  label={t('Username or Email')}
                  {...register('loginDetails.username or email')}
                  variant="outline"
                  className="mb-5"
                  // error={t(errors.loginDetails?.username!)}
                  // required
                />
                <Input
                  label={t('Password')}
                  type="password"
                  {...register('loginDetails.password', {
                    required: t('Password is required'),
                    minLength: {
                      value: 6,
                      message: t('Password must be at least 6 characters'),
                    },
                  })}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.loginDetails?.password?.message!)}
                  required
                />

                <Input
                  label={t('Confirm Password')}
                  type="password"
                  {...register('loginDetails.confirmpassword', {
                    required: t('Confirm Password is required'),
                    validate: (value) =>
                      value === getValues('loginDetails.password') ||
                      t('Passwords do not match'),
                  })}
                  variant="outline"
                  className="mb-5"
                  error={t(errors.loginDetails?.confirmpassword?.message!)}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* <StickyFooterPanel className="z-0"> */}
        <div className="mb-5  text-end">
          <Button
            className="w-28 bg-black"
            loading={loading}
            disabled={loading}
          >
            {t('form:text-register')}
          </Button>
        </div>
        {/* </StickyFooterPanel> */}
      </form>
    </>
  );
};

export default RegistrationForm;
