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
  NotificationInput,
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
import Multiselect from 'multiselect-react-dropdown';
import { useCategoriesQuery } from '@/data/category';
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
  time_duration: any;
  category?: any;
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
  ship_address?: string;
  shipping_name?: string;
  shipping_last_name?: string;
  shipping_email?: string;
  shipping_phone_number?: string;
  address: EmpAddressInput;
  notifications: NotificationInput;
  purchase_limit_updates?: any;
  orders_update?: any;
  announcements?: any;
  cradit_card_option?: any;
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
  const { locale } = useRouter();

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
  console.log('initialValues', role);
  const { categories } = useCategoriesQuery({
    limit: 20,
    page,
    type,
    name: searchTerm,
    orderBy,
    sortedBy,
    parent: null,
    language: locale,
  });
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

  const { tags } = useTagsQuery({
    limit: 10,
    orderBy,
    sortedBy,
    name: searchTerm,
    page,
    // language: locale,
    type,
  });

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
    shouldUnregister: false,
    defaultValues: initialValues
      ? {
          ...initialValues,
          address: {
            country: initialValues?.address?.country,
            city: initialValues?.address?.city,
            state: initialValues?.address?.state,
            zip: initialValues?.address?.zip,
            street_address1: initialValues?.address?.street_address1,
            street_address2: initialValues?.address?.street_address2,
          },
          logo:
            initialValues?.logo?.thumbnail ||
            initialValues?.logo?.original ||
            null,
          //@ts-ignore
          company_name:
            shops.find((shop) => shop?.id === initialValues?.shop_id)?.name ||
            '',
          joining_date: initialValues?.joining_date?.split(' ')[0] || '',
          date_of_birth: initialValues?.date_of_birth?.split(' ')[0] || '',
          contact_no: String(initialValues?.contact_no || ''),
          // Flattening shipping_address fields here
          shipping_name: initialValues?.shipping_address?.shipping_name || '',
          shipping_last_name:
            initialValues?.shipping_address?.shipping_last_name || '',
          shipping_email: initialValues?.shipping_address?.shipping_email || '',
          ship_address: initialValues?.shipping_address?.ship_address || '',
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
        shipping_zip: initialValues?.shipping_address?.shipping_zip,
        ship_address: initialValues?.shipping_address?.ship_address,
        shipping_name: initialValues.shipping_address?.shipping_name,
        shipping_last_name: initialValues?.shipping_address?.shipping_last_name,
        shipping_email: initialValues?.shipping_address?.shipping_email,
        shipping_country: initialValues?.shipping_address?.shipping_country,
        shipping_city: initialValues?.shipping_address?.shipping_city,

        shipping_state: initialValues?.shipping_address?.shipping_state,

        shipping_phone_number:
          initialValues?.shipping_address?.shipping_phone_number,
      });
    }
  }, [initialValues, reset, activeTab]);
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
        'ship_address',
        initialValues?.shipping_address?.ship_address || '',
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

  const handleTabSwitch = (name: TabName) => {
    const transformedTab = activeTab.replace(/\s+/g, '_'); // Transform current tab name
    const currentTabData = getValues(); // Capture all form data, including nested fields

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
      ...(formData.Shipping_Address || values),
      ...(formData.Notification || values),
      ...(formData.Set_Limit || values),
      ...(formData.Shipping_Address || values),
      [transformedTab]: values,
      contact_info: fields,
      shop_id: selectedCompanyId || initialValues?.shop_id,
      password_confirmation: values.password,
    };
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
  const selectedState1 = watch('address.state');
  const [selectedState, setSelectedState] = useState(
     '',
  );
  console.log(
    'initialValues?.address?.state',
    initialValues
  );
  useEffect(() => {
    // Update selectedState when initialValues change
    if (initialValues?.address?.state) {
      setSelectedState(initialValues.address.state);
    }
  }, [initialValues?.address?.state]);
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

  const [selectedShipCountry, setSelectedShipCountry] = useState(
    initialValues?.shipping_address?.shipping_country || 'AU',
  );
  const [selectedShipState, setSelectedShipState] = useState(
  initialValues?.shipping_address?.shipping_state ||'',
  );
  const [selectedShipCity, setSelectedShipCity] = useState(
    initialValues?.shipping_address?.shipping_city || '',
  );

  useEffect(() => {
    if (selectedShipCountry) {
      const stateList = State.getStatesOfCountry(selectedShipCountry);
      // @ts-ignore
      setStates(stateList);
    }
    if (selectedShipState) {
      const cityList = City.getCitiesOfState(
        selectedShipCountry,
        selectedShipState,
      );
      // @ts-ignore
      setCities(cityList);
    }
  }, [selectedShipCountry, selectedShipState]);


  
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
  const handleCountryshipChange = (e: any) => {
    const countryCode = e.target.value;
    setSelectedShipCountry(countryCode);
    if (countryCode) {
      clearErrors('address.country'); // Clear the error if a valid country is selected
    }
    setSelectedShipState('');
    setSelectedShipCity('');
    const stateList = State.getStatesOfCountry(countryCode);
    // @ts-ignore
    setStates(stateList);
    setCities([]); // Clear cities when changing country
  };

  // Fetch cities when a state is selected
  console.log('selected', selectedState);

  const handleStateshipChange = (e: any) => {
    console.log('handleStateChange', e.target.value);
    const stateCode = e.target.value;
    console.log('stateCodestateCode', stateCode);

    setSelectedShipState(stateCode);
    if (stateCode) {
      clearErrors('address.state'); // Clear the error if a valid country is selected
    }
    setSelectedShipCity('');
    const cityList = City.getCitiesOfState(selectedCountry, stateCode);
    // @ts-ignore
    setCities(cityList);
  };

  const handleCityshipChange = (e: any) => {
    const cityCode = e.target.value;
    if (cityCode) {
      clearErrors('address.city'); // Clear the error if a valid country is selected
    }
    setSelectedShipCity(e.target.value);
  };

  return (
    <>
      {initialValues && (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-start gap-4">
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
            <div className="-mx-3 md:flex mb-6"></div>
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
                          // required
                          // error={t(errors?.assign_budget?.message!)}
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
                          // required
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
                          // required
                        >
                          <option value="">Select City</option>
                          {cities?.map((city) => (
                            // @ts-ignore
                            <option key={city.name} value={city.name}>
                              {/* @ts-ignore */}
                              {city?.name}
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

                {/* <Button
                  type="submit"
                  loading={creating || updating}
                  disabled={creating || updating}
                  // onClick={onSubmit}
                >
                  {initialValues
                    ? t('form:button-label-update')
                    : t('form:button-label-save')}
                </Button> */}
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
                      {...register('ship_address')}
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
                      value={selectedShipCountry}
                      {...register('shipping_country')}
                      onChange={handleCountryshipChange}
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
                      value={selectedShipState}
                      {...register('shipping_state')}
                      onChange={handleStateshipChange}
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
                      value={selectedShipCity}
                      {...register('shipping_city')}
                      onChange={handleCityshipChange}
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

                {/* <Button
                  type="submit"
                  loading={creating || updating}
                  disabled={creating || updating}
                  // onClick={onSubmit}
                >
                  {initialValues
                    ? t('form:button-label-update')
                    : t('form:button-label-save')}
                </Button> */}
              </div>
            )}
            {activeTab === 'Purchase History' && (
              <div>
                {' '}
                <PurchaseHistory products={productsArray} />{' '}
              </div>
            )}
            {/* {activeTab === 'Notification' && (
              <div>
                <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr className="border-b border-[#ccc]">
                        <th scope="col" className="py-3 px-6">
                          <p>Purchase Limit Updates</p>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since
                          </p>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="toogle__btn">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b border-[#ccc]">
                        <th scope="col" className="py-3 px-6">
                          <p>Orders Update </p>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since
                          </p>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="toogle__btn">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b border-[#ccc]">
                        <th scope="col" className="py-3 px-6">
                          <p>Announcements</p>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since
                          </p>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="toogle__btn">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </th>
                      </tr>
                      <tr className="border-b border-[#ccc]">
                        <th scope="col" className="py-3 px-6">
                          <p>
                            Lorem Ipsum is simply dummy text of the printing
                          </p>
                          <p>
                            Lorem Ipsum has been the industry's standard dummy
                            text ever since
                          </p>
                        </th>
                        <th scope="col" className="py-3 px-6">
                          <div className="toogle__btn">
                            <label className="inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                value=""
                                className="sr-only peer"
                              />
                              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                            </label>
                          </div>
                        </th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            )} */}
            {activeTab === 'Notification' && (
              <div>
                <div className="border-b border-[#ccc]">
                  <div className="py-3 px-6 flex justify-between items-center">
                    <div>
                      <p>Purchase Limit Updates</p>
                      <p>
                        Lorem Ipsum has been the industry's standard dummy text
                        ever since
                      </p>
                    </div>
                    <div className="toggle__btn">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('purchase_limit_updates')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#ccc]">
                  <div className="py-3 px-6 flex justify-between items-center">
                    <div>
                      <p>Orders Update</p>
                      <p>
                        Lorem Ipsum has been the industry's standard dummy text
                        ever since
                      </p>
                    </div>
                    <div className="toggle__btn">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('orders_update')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#ccc]">
                  <div className="py-3 px-6 flex justify-between items-center">
                    <div>
                      <p>Announcements</p>
                      <p>
                        Lorem Ipsum has been the industry's standard dummy text
                        ever since
                      </p>
                    </div>
                    <div className="toggle__btn">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          {...register('announcements')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Set Limit' && (
              <div>
                <>
                  <form action="">
                    <div className="grid grid-cols-4 gap-4 items-center mt-4 mb-4">
                      <div className="-mx-3 md:flex mb-6">
                        <Input
                          label={t('Available Balance')}
                          {...register('assign_budget')}
                          variant="outline"
                          placeholder="$100"
                          className="mb-3"
                          // required
                          // error={t(errors?.assign_budget?.message!)}
                        />
                      </div>
                      <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-full px-3 mb-6 md:mb-0">
                          <Input
                            label={t('Budget Expire Time Limit')}
                            type="date"
                            {...register('expiry_date')}
                            variant="outline"
                            className="mb-3"
                            // required
                            // error={t(errors?.assign_budget?.message!)}
                          />
                        </div>
                      </div>
                      <div className="-mx-3 md:flex mb-6">
                        <Input
                          label={t('Assign Budget')}
                          {...register('assign_budget')}
                          variant="outline"
                          placeholder="$100"
                          className="mb-3"
                          // required
                          // error={t(errors?.assign_budget?.message!)}
                        />
                      </div>
                    </div>
                  </form>
                </>
                {/* {' '}
                <SetLimit products={productsArray} /> */}
              </div>
            )}
            {activeTab === 'Setting' && (
              <div>
                <div className="setting">
                  <div className="flex justify-between items-center">
                    <h2 className="font-bold text-xl mb-4">
                      Time Base Purchase Limit
                    </h2>
                  </div>
                  <div className="toogle__btn">
                    <label htmlFor="" className="block mb-3">
                      Credit Card Option Visibility
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        {...register('cradit_card_option')}
                        className="sr-only peer"
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                    </label>
                    {/* <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
                </label> */}
                  </div>
                  <div className="grid grid-cols-2 gap-20">
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label
                          className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="order-type"
                        >
                          Set Order Limit Based On
                        </label>
                        <select
                          className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          id="order-type"
                          {...register('category')}
                        >
                          <option value="">Category</option>
                          {categories?.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <Input
                          type="date"
                          label={t('Time Duration')}
                          {...register('time_duration')}
                          variant="outline"
                          className="mb-3"
                        />
                      </div>
                    </div>
                  </div>
                  <h2 className="font-bold text-xl mb-4">
                    Category Visibility
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label
                          className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="order-type"
                        >
                          Category
                        </label>
                        <Multiselect
                          placeholder="Select..."
                          displayValue="key"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={function noRefCheck() {}}
                          onSearch={function noRefCheck() {}}
                          onSelect={function noRefCheck() {}}
                          options={[
                            {
                              cat: 'NSW Rail Clothing',
                              key: 'Color',
                            },
                            {
                              cat: 'VIC Rail Clothing',
                              key: 'Size',
                            },
                            {
                              cat: 'General Workwear',
                              key: 'Material',
                            },
                          ]}
                          showCheckbox
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label
                          className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="order-type"
                        >
                          Sub Category (optional)
                        </label>
                        <Multiselect
                          placeholder="Select..."
                          displayValue="key"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={function noRefCheck() {}}
                          onSearch={function noRefCheck() {}}
                          onSelect={function noRefCheck() {}}
                          options={[
                            {
                              cat: 'NSW Rail Clothing',
                              key: 'Color',
                            },
                            {
                              cat: 'VIC Rail Clothing',
                              key: 'Size',
                            },
                            {
                              cat: 'General Workwear',
                              key: 'Material',
                            },
                          ]}
                          showCheckbox
                        />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label
                          className="block tracking-wide text-gray-700 text-xs font-bold mb-2"
                          htmlFor="order-type"
                        >
                          Product
                        </label>
                        <Multiselect
                          placeholder="Select..."
                          displayValue="key"
                          onKeyPressFn={function noRefCheck() {}}
                          onRemove={function noRefCheck() {}}
                          onSearch={function noRefCheck() {}}
                          onSelect={function noRefCheck() {}}
                          options={[
                            {
                              cat: 'NSW Rail Clothing',
                              key: 'Color',
                            },
                            {
                              cat: 'VIC Rail Clothing',
                              key: 'Size',
                            },
                            {
                              cat: 'General Workwear',
                              key: 'Material',
                            },
                          ]}
                          showCheckbox
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
