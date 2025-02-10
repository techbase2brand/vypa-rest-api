import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { EditIcon } from '@/components/icons/edit';
import * as socialIcons from '@/components/icons/social';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import {
  useCreateShopMutation,
  useShopsQuery,
  useUpdateShopMutation,
} from '@/data/shop';
import {
  BalanceInput,
  EmpAddressInput,
  ItemProps,
  SortOrder,
  UserAddressInput,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
// import { getFormattedImage } from '@/utils/get-formatted-image';
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
// import { shopValidationSchema } from './shop-validation-schema';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';
import {
  getFromLocalStorage,
  saveToLocalStorage,
  updateLocalStorageItem,
} from '@/utils/localStorageUtils';
import {
  useCreateEmployeeMutation,
  useEmployeeQuery,
  useUpdateEmployeeMutation,
} from '@/data/employee';
import * as yup from 'yup';
import PasswordInput from '../ui/password-input';
import { useTagsQuery } from '@/data/tag';
import { Country, State, City } from 'country-state-city';
import PurchaseHistory from '@/pages/employee-setup/purchase-history';
import Notification from '@/pages/employee-setup/notification';
import SetLimit from '@/pages/employee-setup/set-limit';
import General from '@/pages/employee-setup/general-form';
import { useMeQuery } from '@/data/user';
const productsArray = [
  {
    inventoryId: 'INV-001',
    description: 'Blue Polo Shirt',
    uom: 'PCS',
    quantity: 10,
    unitPrice: 20.5,
    employeeName: 'John Doe',
    embroideryDetails: 'Front and Rear Logos',
    frontLogo: true,
    rearLogo: true,
    name: true,
  },
];

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
interface IImage {
  thumbnail: string; // Thumbnail URL
  original: string; // Original image URL
  id: number; // Image ID
  file_name: string; // File name of the image
}
type FormValues = {
  name: string;
  Employee_email: string;
  gender?: string;
  company_name?: string;
  shop_id?: string;
  password?: string;
  confirmpassword?: string;
  logo: string | null;
  cover_image: IImage | null;
  contact_no?: any;
  joining_date?: any;
  date_of_birth?: any;
  job_title?: string;
  tag?: string;
  assign_budget?: number;
  expiry_date?: number;

  // country?: string;
  // state?: string;
  // city?: string;
  // zip?: string;
  last_name?: string;
  web?: string;
  // street_address1?: string;
  // street_address2?: string;
  contact_info?: string;
  //shipping address
  shipping_country?: string;
  shipping_state?: string;
  shipping_city?: string;
  shipping_zip?: string;
  shipping_address?: string;
  shipping_name?: string;
  shipping_last_name?: string;
  shipping_email?: string;
  shipping_phone_number?: string;
  address: EmpAddressInput;
};

const contactInfo = [
  { id: 1, label: 'Business 1' },
  { id: 2, label: 'Business 2' },
  { id: 3, label: 'Business 3' },
  { id: 4, label: 'Cell' },
  { id: 5, label: 'Assistant' },
  { id: 6, label: 'Fax' },
  { id: 7, label: 'Home' },
  { id: 8, label: 'Home Fax' },
];

type TabName =
  | 'General'
  | 'Shipping Address'
  | 'Purchase History'
  | 'Notification'
  | 'Set Limit'
  | 'Setting';

const employeeFormSchema = yup.object().shape({
  // Company Details
  name: yup.string().required('Employee Name is required'), // Matches the validation doc
  Employee_email: yup
    .string()
    .email('Invalid Email address')
    .required('Email Address is required'), // Matches the validation doc
  contact_no: yup
    .string()
    .matches(/^\d+$/, 'Business Phone No. must be numeric') // Accepts only numeric
    .required('Business Phone No. is required'), // Matches the validation doc

  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(20, 'Password must not exceed 20 characters'),
  // .matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).*$/,
  //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  // ),

  confirmpassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password')], 'Passwords do not match'), // Must match the password
  assign_budget: yup.string().required('Please Assign budget'),
});

const EmployeesForm = ({
  initialValues,
  employee,
}: {
  initialValues?: any;
  employee: any;
}) => {
  const router = useRouter();
  const { item } = router.query;

  const employeeFormEditSchema = yup.object().shape({
    name: yup.string().notRequired(),
    Employee_email: yup.string().notRequired(),
    // .email('Invalid Email address')
    // .required('Email Address is required'),
    contact_no: yup.string().notRequired(),
    // .matches(/^\d+$/, 'Business Phone No. must be numeric')
    // .required('Business Phone No. is required'),
    password: yup.string().notRequired(),
    // .min(8, 'Password must be at least 8 characters')
    // .max(20, 'Password must not exceed 20 characters'),
    confirmpassword: yup
      .string()
      .notRequired()
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  });

  const { role } = getAuthCredentials();
  const { data: me } = useMeQuery();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [type, setType] = useState('');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>('General');

  const [fields, setFields] = useState(
    initialValues?.contact_info || [{ id: 1, tag: '', contactInfo: '' }],
  );
  const [formData, setFormData] = useState<any>({});
  const addField = () => {
    setFields([...fields, { id: fields.length + 1, tag: '', contactInfo: '' }]);
  };
  console.log('initialValues', role, me?.shops[0]?.id);

  ///@ts-ignore
  const removeField = (id) => {
    ///@ts-ignore

    setFields(fields.filter((field) => field.id !== id));
  };
  //@ts-ignore
  const handleFieldChange = (id, fieldName, value) => {
    //@ts-ignore
    setFields((prev) =>
      //@ts-ignore
      prev.map((field) =>
        field.id === id ? { ...field, [fieldName]: value } : field,
      ),
    );
  };

  const TabButton = ({ name }: { name: TabName }) => (
    <button
      className={`inline-block py-1 px-4 text-black font-semibold ${activeTab === name ? 'text-white bg-black border-b-2 border-black-700 rounded-tl rounded-tr' : 'text-black-500 hover:text-black-700'}`}
      onClick={() => setActiveTab(name)}
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </button>
  );
  //@ts-ignore
  const handleChange = (event) => {
    const selectedOption = shops.find(
      //@ts-ignore
      (option) => option.name === event.target.value,
    );
    //@ts-ignore
    setSelectedCompanyId(selectedOption?.id || null);
  };
  const [location] = useAtom(locationAtom);
  const { mutate: createEmployee, isLoading: creating } =
    useCreateEmployeeMutation();
  const { mutate: updateEmployee, isLoading: updating } =
    useUpdateEmployeeMutation();

  function getFormattedImage(image: IImage | null) {
    if (!image || !image.thumbnail) {
      return null; // Safe fallback
    }
    // Use `thumbnail` or `original` based on your requirements
    return image.thumbnail; // Return the thumbnail URL
  }
  //@ts-ignore
  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    name: searchTerm,
    limit: 100,
    page,
    orderBy,
    sortedBy,
  });
  //@ts-ignore

  const {
    tags,
    //@ts-ignore

    // loading: loading,
    //@ts-ignore
    // paginatorInfo,
    //@ts-ignore
  } = useTagsQuery({
    limit: 10,
    orderBy,
    sortedBy,
    name: searchTerm,
    page,
    // language: locale,
    type,
  });
  console.log('initialValuesinitialValues', initialValues);

  const { permissions } = getAuthCredentials();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
    reset,
    clearErrors,
  } = useForm<FormValues>({
    shouldUnregister: true,
    defaultValues: initialValues
      ? {
          ...initialValues,
          address: {
            country: initialValues.address.country,
            city: initialValues.address.city,
            state: initialValues.address.state,
            zip: initialValues.address.zip,
            street_address1: initialValues.address.street_address1,
            street_address2: initialValues.address.street_address2,
          },
          logo:
            initialValues?.logo?.thumbnail ||
            initialValues?.logo?.original ||
            null,
          //@ts-ignore
          company_name:
            shops.find((shop) => shop.id === initialValues?.shop_id)?.name ||
            '',
          joining_date: initialValues?.joining_date?.split(' ')[0] || '',
          date_of_birth: initialValues?.date_of_birth?.split(' ')[0] || '',
          contact_no: String(initialValues?.contact_no || ''),
          // Flattening shipping_address fields here
          shipping_name: initialValues?.shipping_address?.shipping_name || '',
          shipping_last_name:
            initialValues?.shipping_address?.shipping_last_name || '',
          shipping_email: initialValues?.shipping_address?.shipping_email || '',
          shipping_address:
            initialValues?.shipping_address?.shipping_address || '',
          shipping_country:
            initialValues?.shipping_address?.shipping_country || '',
          shipping_state: initialValues?.shipping_address?.shipping_state || '',
          shipping_city: initialValues?.shipping_address?.shipping_city || '',
          shipping_zip: initialValues?.shipping_address?.shipping_zip || '',
          shipping_phone_number:
            initialValues?.shipping_address?.shipping_phone_number || '',
        }
      : {},
    // @ts-ignore
    resolver: yupResolver(
      initialValues ? employeeFormEditSchema : employeeFormSchema,
    ),
  });

  const opentagModal = () => {
    setIsModalOpen(true);
  };
  // console.log('Logo:', initialValues?.logo);
  // console.log('Cover Image:', initialValues?.cover_image);

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

  const { t } = useTranslation();

  const tabs = initialValues
    ? [
        'General',
        'Shipping Address',
        'Purchase History',
        'Notification',
        'Set Limit',
        'Setting',
      ]
    : ['General'];

  useEffect(() => {
    if (initialValues) {
      reset({
        ...initialValues,
        logo:
          initialValues?.logo?.thumbnail ||
          initialValues?.logo?.original ||
          null,
        company_name:
          shops.find((shop) => shop.id === initialValues?.shop_id)?.name || '',
        joining_date: initialValues?.joining_date?.split(' ')[0] || '',
        date_of_birth: initialValues?.date_of_birth?.split(' ')[0] || '',
        contact_no: String(initialValues?.contact_no || ''),
      });
    }
  }, [initialValues, reset]);
  useEffect(() => {
    if (initialValues?.shipping_address) {
      // Set each value from shipping_address to the form fields
      setValue(
        'shipping_name',
        initialValues?.shipping_address?.shipping_name || '',
      );
      setValue(
        'shipping_last_name',
        initialValues?.shipping_address?.shipping_last_name || '',
      );
      setValue(
        'shipping_email',
        initialValues?.shipping_address?.shipping_email || '',
      );
      setValue(
        'shipping_address',
        initialValues?.shipping_address?.shipping_address || '',
      );
      setValue(
        'shipping_country',
        initialValues?.shipping_address?.shipping_country || '',
      );
      setValue(
        'shipping_state',
        initialValues?.shipping_address?.shipping_state || '',
      );
      setValue(
        'shipping_city',
        initialValues?.shipping_address?.shipping_city || '',
      );
      setValue(
        'shipping_zip',
        initialValues?.shipping_address?.shipping_zip || '',
      );
      setValue(
        'shipping_phone_number',
        initialValues?.shipping_address?.shipping_phone_number || '',
      );
    }
  }, [initialValues, setValue]);

  // Handle Tab Switching
  // const handleTabSwitch = (name: TabName) => {
  //   const currentTabData = getValues(); // Capture data from the current tab
  //   //@ts-ignore
  //   setFormData((prev) => ({
  //     ...prev,
  //     [activeTab]: currentTabData, // Store current tab data in centralized state
  //   }));
  //   setActiveTab(name); // Switch to the new tab
  // };
  const handleTabSwitch = (name: TabName) => {
    const transformedTab = activeTab.replace(/\s+/g, '_'); // Transform current tab name
    const currentTabData = getValues(); // Capture all form data, including nested fields
    console.log('currentTabDatacurrentTabData', currentTabData);

    //@ts-ignore
    setFormData((prev) => ({
      ...prev,
      [transformedTab]: {
        ...prev[transformedTab], // Preserve any existing data for the tab
        ...currentTabData, // Update with current form data
      },
    }));
    setActiveTab(name); // Switch to the new tab
  };
  // Pre-fill form fields when switching tabs
  useEffect(() => {
    const transformedTab = activeTab.replace(/\s+/g, '_'); // Transform tab name
    const currentTabData = formData[transformedTab] || {}; // Retrieve saved data for the tab
    reset(currentTabData); // Pre-fill form fields for the current tab
  }, [activeTab, reset, formData]);
  console.log('formData', formData, activeTab);

  function onSubmit(values: FormValues) {
    const transformedTab = activeTab.toLowerCase().replace(/\s+/g, '_');
    console.log('onSubmit clicked', values, selectedCompanyId);
    console.log('Form Submitted', fields);
    // Add the `password_confirmation` field dynamically
    const updatedValues = {
      ...values,
      contact_info: fields,
      shop_id:
        selectedCompanyId || initialValues?.shop_id || me?.shops?.[0]?.id,
      password_confirmation: values.password,
    };
    const editValues = {
      ...(formData.General || values),
      [transformedTab]: values,
      contact_info: fields,
      shop_id: selectedCompanyId || initialValues?.shop_id,
      password_confirmation: values.password,
    };
    console.log('Updated Values:', updatedValues);
    if (initialValues) {
      const { ...restAddress } = updatedValues;
      //@ts-ignore
      updateEmployee({
        id: initialValues?.id as string,
        ...editValues,
      });
    } else {
      //@ts-ignore
      createEmployee({
        ...updatedValues,
      });
    }

    console.log('Form values cleared:', values);
  }

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(
    initialValues?.address?.country || 'AU',
  );
  const [selectedState, setSelectedState] = useState(
    initialValues?.address?.state || '',
  );
  const [selectedCity, setSelectedCity] = useState(
    initialValues?.address?.city || '',
  );

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

  // Fetch countries on component mount
  useEffect(() => {
    const countryList = Country.getAllCountries();
    // @ts-ignore
    setCountries(countryList);
    const stateList = State.getStatesOfCountry('AU');
    // @ts-ignore
    setStates(stateList);
  }, []);

  // Fetch states when a country is selected
  const handleCountryChange = (e: any) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    if (countryCode) {
      clearErrors('address.country'); // Clear the error if a valid country is selected
    }
    setSelectedState('');
    setSelectedCity('');
    const stateList = State.getStatesOfCountry(countryCode);
    // @ts-ignore
    setStates(stateList);
    setCities([]); // Clear cities when changing country
  };

  // Fetch cities when a state is selected
  console.log('selected', selectedState);

  const handleStateChange = (e: any) => {
    console.log('handleStateChange', e.target.value);
    const stateCode = e.target.value;
    console.log('stateCodestateCode', stateCode);

    setSelectedState(stateCode);
    if (stateCode) {
      clearErrors('address.state'); // Clear the error if a valid country is selected
    }
    setSelectedCity('');
    const cityList = City.getCitiesOfState(selectedCountry, stateCode);
    // @ts-ignore
    setCities(cityList);
  };

  const handleCityChange = (e: any) => {
    console.log('handleCityChange', e);
    const cityCode = e.target.value;
    if (cityCode) {
      clearErrors('address.city'); // Clear the error if a valid country is selected
    }
    setSelectedCity(e.target.value);
  };

  return (
    <>
      {initialValues && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-start gap-4">
          {/* <div className='w-[250px] pl-8 relative border-r border-[#ccc] mr-5 pr-5'> 
          <img src='https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg' className='w-[200px] h-[200px] mt-4 rounded-full object-cover' alt='logo' />
          <Link href='#' className='absolute' style={{right:'15px', bottom:'30px'}}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="17.4361" cy="17.4312" r="16.5689" fill="#21BA21"/>
          <path d="M9.64062 21.9799V25.2283H12.889L22.4695 15.6478L19.2211 12.3994L9.64062 21.9799ZM24.9815 13.1357C25.0618 13.0556 25.1255 12.9604 25.169 12.8556C25.2125 12.7508 25.2348 12.6385 25.2348 12.525C25.2348 12.4116 25.2125 12.2992 25.169 12.1944C25.1255 12.0897 25.0618 11.9945 24.9815 11.9143L22.9546 9.88736C22.8744 9.80705 22.7792 9.74335 22.6744 9.69988C22.5696 9.65641 22.4573 9.63403 22.3439 9.63403C22.2304 9.63403 22.1181 9.65641 22.0133 9.69988C21.9085 9.74335 21.8133 9.80705 21.7332 9.88736L20.148 11.4726L23.3963 14.7209L24.9815 13.1357Z" fill="white"/>
          </svg> 
          </Link>
        </div> */}

          <div className="w-[80%]">
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="order-type"
                >
                  Contact Id
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="order-type"
                  type="text"
                  placeholder=" "
                />
              </div>
              <div className="md:w-1/3 px-3">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="customer"
                >
                  Employee Status
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="customer"
                  type="text"
                  placeholder=" "
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/3 px-3">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="customer"
                >
                  Business Account
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="customer"
                  type="text"
                  placeholder=" "
                />
              </div>
              <div className="md:w-1/3 px-3 mb-6 md:mb-0">
                <label
                  className="block  tracking-wide text-gray-700 text-xs font-bold mb-2"
                  htmlFor="order-type"
                >
                  Owner
                </label>
                <input
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="order-type"
                  type="text"
                  placeholder=" "
                />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              {/* <div className="md:w-1/3 px-3">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Duplicate
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div> */}
            </div>
          </div>
        </div>
      )}
      <ul className="flex border-b mt-3">
        {tabs?.map((tab) => (
          <li className="mr-1" key={tab}>
            <button
              className={`inline-block py-1 px-4 text-black font-semibold ${
                activeTab === tab
                  ? 'text-white bg-black border-b-2 border-black-700 rounded-tl rounded-tr'
                  : 'text-black-500 hover:text-black-700'
              }`}
              onClick={() => handleTabSwitch(tab as TabName)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          {/* {initialValues ?  <ul className="flex border-b">
            {['General', 'Shipping Address', 'Purchase History'].map((tab) => (
              <li className="mr-1" key={tab}>
                <TabButton name={tab as TabName} />
              </li>
            ))}
          </ul>:
          <ul className="flex border-b">
          {['General'].map((tab) => (
            <li className="mr-1" key={tab}>
              <TabButton name={tab as TabName} />
            </li>
          ))}
        </ul>
          } */}

          {/* Tab Navigation */}

          <div className="pt-4">
            {activeTab === 'General' && (
              <div>
                <div className="flex flex-wrap pb-4  border-b border-dashed border-border-base mb-3">
                  <div className="w-full flex gap-10">
                    <div className="w-1/2">
                      <Input
                        label={t('Name')}
                        {...register('name')}
                        variant="outline"
                        className="mb-3"
                        error={t(errors.name?.message!)}
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <Input
                        label={t('Last Name')}
                        {...register('last_name')}
                        variant="outline"
                        className="mb-3"
                        // error={t(errors.name?.message!)}
                        // required
                      />
                      {/* <Input
                label={t('Email')}
                type="email"
                {...register('Employee_email')}
                variant="outline"
                className="mb-5"
                error={t(errors.Employee_email?.message!)}
                required
              /> */}
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-4">
                  <div className="w-full pb-4 mb-5 border-b border-dashed border-border-base">
                    <div className="w-full flex gap-10">
                      {role == 'super_admin' && (
                        <div className="mb-3 w-1/2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('Company Name')}
                          </label>
                          <div className="">
                            <select
                              {...register('company_name')}
                              onChange={handleChange}
                              className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                            >
                              <option value=" ">
                                {t('Select company...')}
                              </option>
                              {shops?.map((option) => (
                                <option key={option.id} value={option.name}>
                                  {t(option.name)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}
                      <div className="mb-3 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('Gender')}
                        </label>
                        <div className="">
                          <select
                            {...register('gender')}
                            className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                          >
                            <option value=" ">{t('Select gender...')}</option>
                            <option value="male">{t('Male')}</option>
                            <option value="female">{t('Female')}</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2">
                        <PhoneNumberInput
                          label={t('Contact No')}
                          // required
                          {...register('contact_no')}
                          control={control}
                          error={t(errors.contact_no?.message!)}
                          required
                          // error={t(errors.primary_contact_detail?.contact_no?.message!)}
                        />
                      </div>
                      <div className="mb-3 w-1/2">
                        <Input
                          type="date"
                          label={t('Joining Date')}
                          {...register('joining_date')}
                          variant="outline"
                          className="mb-3"
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-10">
                      <div className="w-1/2">
                        <Input
                          label={t('Email')}
                          type="email"
                          {...register('Employee_email')}
                          variant="outline"
                          className="mb-5"
                          error={t(errors.Employee_email?.message!)}
                          required
                        />
                      </div>
                      <div className="w-1/2">
                        <Input
                          label={t('Website')}
                          {...register('web')}
                          variant="outline"
                          className="mb-3"
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2">
                        <PasswordInput
                          label={t('Password')}
                          type="password"
                          {...register('password', {
                            minLength: {
                              value: 8,
                              message: t(
                                'Password must be at least 8 characters',
                              ),
                            },
                          })}
                          variant="outline"
                          className="mb-3"
                          error={t(errors?.password?.message!)}
                          required={!initialValues}
                        />
                      </div>

                      <div className="mb-3 w-1/2">
                        <PasswordInput
                          label={t('Confirm Password')}
                          type="password"
                          {...register('confirmpassword', {
                            required: t('Confirm Password is required'),
                            validate: (value) =>
                              value === getValues('password') ||
                              t('Passwords do not match'),
                          })}
                          variant="outline"
                          className="mb-5"
                          error={t(errors?.confirmpassword?.message!)}
                          required={!initialValues}
                        />
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2">
                        <Input
                          label={t('Job Title')}
                          {...register('job_title')}
                          variant="outline"
                          className="mb-3"
                        />
                      </div>
                      <div className="mb-3 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t('Tag')}
                        </label>
                        <div className="mb-4">
                          <select
                            {...register('tag')}
                            // onChange={handleChange}
                            className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                          >
                            <option value=" ">{t('Select Tag...')}</option>
                            {tags?.map((option) => (
                              <option key={option.id} value={option.name}>
                                {t(option.name)}
                              </option>
                            ))}
                          </select>

                          {/* <div className="mb-5 text-end">
                  <Button
                    onClick={opentagModal}
                  >
                    Add New Tag
                  </Button>
                </div> */}
                        </div>
                      </div>
                    </div>

                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2">
                        <Input
                          type="date"
                          label={t('Date Of Birth')}
                          {...register('date_of_birth')}
                          variant="outline"
                          className="mb-3"
                        />
                      </div>

                      <div className="mb-3 w-1/2">
                        <Input
                          label={t('Assign Budget')}
                          {...register('assign_budget')}
                          variant="outline"
                          className="mb-3"
                          required
                          error={t(errors?.assign_budget?.message!)}
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2"></div>
                      <div className="mb-3 w-1/2">
                        <Input
                          label={t('Expire Budget Date')}
                          type="date"
                          {...register('expiry_date')}
                          variant="outline"
                          className="mb-3"
                          required
                          error={t(errors?.assign_budget?.message!)}
                        />
                      </div>
                    </div>
                    <div className="w-full flex gap-10">
                      <div className="mb-3 w-1/2"></div>
                      <div className=" mb-3 w-1/2">
                        {/* @ts-ignore */}
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex w-full gap-4 mb-4"
                          >
                            <div className="w-1/2">
                              <select
                                className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                                value={field.tag}
                                onChange={(e) =>
                                  handleFieldChange(
                                    field.id,
                                    'tag',
                                    e.target.value,
                                  )
                                }
                              >
                                <option value="">{t('Select Tag...')}</option>
                                {contactInfo.map((option) => (
                                  <option key={option.id} value={option.label}>
                                    {option.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="w-1/2">
                              <input
                                type="text"
                                className="border border-border-base rounded w-full px-4 h-12"
                                placeholder="Enter contact info"
                                value={field.contactInfo}
                                onChange={(e) =>
                                  handleFieldChange(
                                    field.id,
                                    'contactInfo',
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            {fields.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeField(field.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                              >
                                -
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={addField}
                          className="bg-green-500 text-white px-4 py-2 rounded"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className=" w-3/6 pb-8 mb-5 border-b border-dashed border-border-base">
                      <Description
                        title={t('Employee Address')}
                        // details={t('form:shop-basic-info-help-text')}
                        className="w-full px-0 pb-5 sm:w-4/12  sm:pe-4 md:w-full md:pe-5"
                      />
                      <Input
                        label={t('Address Line 1')}
                        {...register('address.street_address1')}
                        variant="outline"
                        className="mb-5"
                        // error={t(errors.address?.street_address?.message!)}
                        // required
                      />
                      <Input
                        label={t('Address Line 2')}
                        {...register('address.street_address2')}
                        variant="outline"
                        className="mb-5"
                        // error={t(errors.address?.street_address?.message!)}
                        // required
                      />
                      <div className="mb-5">
                        <label
                          htmlFor="userType"
                          className="block text-sm text-black font-medium"
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
                            <option
                              // @ts-ignore
                              key={country.isoCode}
                              // @ts-ignore
                              value={country.isoCode}
                            >
                              {/* @ts-ignore */}
                              {country.name}
                            </option>
                          ))}
                        </select>

                        <p className="my-2 text-xs text-red-500 text-start">
                          {/* {errors.country?.message!} */}
                        </p>
                      </div>

                      <div className="mb-5">
                        <label
                          htmlFor="userType"
                          className="block text-sm text-black font-medium"
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
                          {states?.map((state) => (
                            // @ts-ignore
                            <option key={state.isoCode} value={state.isoCode}>
                              {/* @ts-ignore */}
                              {state.name}
                            </option>
                          ))}
                        </select>
                        <p className="my-2 text-xs text-red-500 text-start">
                          {/* {errors.state?.message!} */}
                        </p>
                      </div>

                      <div className="mb-5">
                        <label
                          htmlFor="userType"
                          className="block text-sm text-black font-medium"
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
                          {/* {errors.city?.message!} */}
                        </p>
                      </div>

                      <Input
                        label={t('Post Code')}
                        {...register('address.zip')}
                        variant="outline"
                        className="mb-5"
                        // error={t(errors.zip?.message!)}
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* <General activeTab={activeTab} /> */}
              </div>
            )}
            {activeTab === 'Shipping Address' && (
              <div>
                <div className="w-full flex gap-10">
                  <div className="w-1/2">
                    <Input
                      label={t('First Name')}
                      {...register('shipping_name')}
                      variant="outline"
                      className="mb-3"
                      // error={t(errors.name?.message!)}
                      // required
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      label={t('Last Name')}
                      {...register('shipping_last_name')}
                      variant="outline"
                      className="mb-3"
                      // error={t(errors.name?.message!)}
                      // required
                    />
                  </div>
                </div>

                <div className="w-full flex gap-10">
                  <div className="w-1/2">
                    <Input
                      label={t('Email')}
                      type="email"
                      {...register('shipping_email')}
                      variant="outline"
                      className="mb-5"
                      // error={t(errors.Employee_email?.message!)}
                      // required
                    />
                  </div>
                  <div className="w-1/2">
                    <Input
                      label={t('Address')}
                      {...register('shipping_address')}
                      variant="outline"
                      className="mb-5"
                      // error={t(errors.address?.street_address?.message!)}
                      // required
                    />
                  </div>
                </div>

                <div className="w-full flex gap-10">
                  <div className="mb-5 w-1/2">
                    <label
                      htmlFor="userType"
                      className="block text-sm text-black font-medium"
                    >
                      Country
                    </label>
                    <select
                      value={selectedCountry}
                      {...register('shipping_country')}
                      onChange={handleCountryChange}
                      className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      required
                    >
                      <option value="">Select Country</option>
                      {countries.map((country) => (
                        // @ts-ignore
                        <option
                          // @ts-ignore
                          key={country.isoCode}
                          // @ts-ignore
                          value={country.isoCode}
                        >
                          {/* @ts-ignore */}
                          {country.name}
                        </option>
                      ))}
                    </select>

                    <p className="my-2 text-xs text-red-500 text-start">
                      {/* {errors.country?.message!} */}
                    </p>
                  </div>
                  <div className="mb-3 w-1/2">
                    <PhoneNumberInput
                      label={t('Contact No')}
                      // required
                      {...register('shipping_phone_number')}
                      control={control}
                      // error={t(errors.contact_no?.message!)}
                      // required
                      // error={t(errors.primary_contact_detail?.contact_no?.message!)}
                    />
                  </div>
                </div>

                <div className="w-full flex gap-10">
                  <div className="mb-5 w-1/2">
                    <label
                      htmlFor="userType"
                      className="block text-sm text-black font-medium"
                    >
                      State
                    </label>
                    <select
                      value={selectedState}
                      {...register('shipping_state')}
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
                      {/* {errors.state?.message!} */}
                    </p>
                  </div>

                  <div className="mb-5 w-1/2">
                    <label
                      htmlFor="userType"
                      className="block text-sm text-black font-medium"
                    >
                      City
                    </label>
                    <select
                      value={selectedCity}
                      {...register('shipping_city')}
                      onChange={handleCityChange}
                      className="my-2 block p-3 w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      // required
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
                      {/* {errors.city?.message!} */}
                    </p>
                  </div>
                </div>
                <Input
                  label={t('Post Code')}
                  {...register('shipping_zip')}
                  variant="outline"
                  className="mb-5"
                  // error={t(errors.zip?.message!)}
                  // required
                />
              </div>
            )}
            {activeTab === 'Purchase History' && (
              <div>
                {' '}
                <PurchaseHistory products={productsArray} />{' '}
              </div>
            )}
            {activeTab === 'Notification' && (
              <div>
                {' '}
                <Notification />
              </div>
            )}
            {activeTab === 'Set Limit' && (
              <div>
                {' '}
                <SetLimit products={productsArray} />
              </div>
            )}
            {activeTab === 'Setting' && (
              <div>
                {' '}
                <General activeTab={activeTab} />
              </div>
            )}
          </div>
        </div>

        <StickyFooterPanel className="z-0">
          <div className="mb-5 text-end">
            <Button
              type="submit"
              loading={creating || updating}
              disabled={creating || updating}
              // onClick={onSubmit}
            >
              {initialValues
                ? t('form:button-label-update')
                : t('form:button-label-save')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
};

export default EmployeesForm;
