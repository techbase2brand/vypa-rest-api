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
import { BalanceInput, ItemProps, SortOrder } from '@/types';
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


type FormValues = {
  name: string;
  cretaed_by?: string;
  Employee_status?: string;
  company_name?: string;
  company_status?: string;
  shop_id?: string;
};

const EmployeesFilter = ({
  initialValues,
}: {
  initialValues?: any;
  employee: any;
}) => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [type, setType] = useState('');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  console.log('tags', tags);

  const { permissions } = getAuthCredentials();
  const {
    register,
    handleSubmit,
    // formState: { errors },
    getValues,
    watch,
    setValue,
    control,
    reset,
  } = useForm<FormValues>({
    shouldUnregister: true,
  });

  

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

//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       console.log('Validation errors:', errors);
//     }
//   }, [errors]);

  const { t } = useTranslation();

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values,);
    const updatedValues = {
        ...values,
        shop_id: selectedCompanyId,
      };
    console.log('Updated Values:', updatedValues);
   
      //@ts-ignore
    //   createEmployee({
    //     ...values,
    //   });
    

    console.log('Form values cleared:', values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* <div className="flex flex-wrap pb-4  border-b border-dashed border-border-base mb-3"> */}
        {/* <div className="w-full"> */}

        <div className="border rounded p-4 shadow-sm mt-3">
          <div className="grid grid-cols-7 gap-4 items-center">
            {/* {/ Checkbox /} */}
            {/* <div>
                  <input type="checkbox" className="w-5 h-5" />
                  <label className="ml-2">All</label>
                </div> */}

            {/* {/ Approval /} */}
            <div>
              <select  {...register('Employee_status')} className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                <option>Employee Status</option>
                <option value={"1"}>Active</option>
                <option value={"0"}>Inactive</option>
              </select>
            </div>

            {/* {/ Created By /} */}
            <div>
              <select  {...register('cretaed_by')} className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                <option>Created by</option>
                <option value={"admin"}>Admin</option>
                <option value={"company"}>Company</option>
              </select>
            </div>

            {/* {/ Company Name /} */}
            <div>
              <select
                // {...register('company_name')}
                onChange={handleChange}
                className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
              >
                <option value=" ">{t('Company Name')}</option>
                {shops?.map((option) => (
                  <option key={option.id} value={option.name}>
                    {t(option.name)}
                  </option>
                ))}
              </select>
            </div>

            {/* {/ Company Status /} */}
            <div>
              <select  {...register('company_status')} className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                <option>Company Status</option>
                <option value={"1"}>Active</option>
                <option value={"0"}>Inactive</option>
              </select>
            </div>

            {/* {/ State /} */}
            <div>
              <Input
                {...register('name')}
                variant="outline"
                className="mb-3"
                placeholder="Employee Name"
              />
            </div>
            {/* {/ Apply Filters Button /} */}
            <Button className="bg-black text-white rounded">
              Apply Filters
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default EmployeesFilter;
