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
  job_title?: string;
  tag?: string;
};

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
  console.log('itemrr', initialValues);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [type, setType] = useState('');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
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
      console.warn('Invalid image format:', image);
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
  console.log('companyemp', shops);

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
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
    reset,
  } = useForm<FormValues>({
    shouldUnregister: true,
    // ...(initialValues
    //   ? {
    // defaultValues: {
    //   ...initialValues,
    //   logo: initialValues?.logo
    //     ? getFormattedImage(initialValues.logo as IImage)
    //     : null,
    //   cover_image: initialValues?.cover_image
    //     ? getFormattedImage(initialValues.cover_image as IImage)
    //     : null,
    //   // logo: getFormattedImage(initialValues?.logo as IImage),
    //   // cover_image: getFormattedImage(initialValues?.cover_image as IImage),
    // },
    //     defaultValues: {
    //       ...initialValues,
    //       contact_no: initialValues?.contact_no
    //         ? String(initialValues.contact_no)
    //         : '',
    //       logo: initialValues?.logo
    //         ? getFormattedImage(initialValues.logo as IImage)
    //         : null,
    //       cover_image: initialValues?.cover_image
    //         ? getFormattedImage(initialValues.cover_image as IImage)
    //         : null,
    //     },
    //   }
    // : {}),
    defaultValues: initialValues
      ? {
          ...initialValues,
          logo:
            initialValues?.logo?.thumbnail ||
            initialValues?.logo?.original ||
            null,
          //@ts-ignore
          company_name:
            shops.find((shop) => shop.id === initialValues?.shop_id)?.name ||
            '',
          joining_date: initialValues?.joining_date?.split(' ')[0] || '',
          contact_no: String(initialValues?.contact_no || ''),
        }
      : {},
    // @ts-ignore
    resolver: yupResolver(employeeFormSchema),
  });

  console.log('Initial Values:', selectedCompanyId);
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

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values, selectedCompanyId);
    // Add the `password_confirmation` field dynamically
    const updatedValues = {
      ...values,
      shop_id: selectedCompanyId || initialValues?.shop_id,
      password_confirmation: values.password,
    };
    console.log('Updated Values:', updatedValues);
    if (initialValues) {
      const { ...restAddress } = updatedValues;
      //@ts-ignore
      updateEmployee({
        id: initialValues?.id as string,
        ...updatedValues,
      });
    } else {
      //@ts-ignore
      createEmployee({
        ...updatedValues,
      });
    }

    console.log('Form values cleared:', values);
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-4  border-b border-dashed border-border-base mb-3">
          <div className="w-full">
            <Input
              label={t('Employee Name')}
              {...register('name')}
              variant="outline"
              className="mb-3"
              error={t(errors.name?.message!)}
              required
            />
            <Input
              label={t('Email')}
              type="email"
              {...register('Employee_email')}
              variant="outline"
              className="mb-5"
              error={t(errors.Employee_email?.message!)}
              required
            />
            {/* <FileInput
              name="logo"
              control={control}
              multiple={false}
              // error={t(errors?.logo?.message!)}
            /> */}
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div className="w-full pb-4 mb-5 border-b border-dashed border-border-base">
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Company Name')}
              </label>
              <div className="">
                <select
                  {...register('company_name')}
                  onChange={handleChange}
                  className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                >
                  <option value=" ">{t('Select company...')}</option>
                  {shops?.map((option) => (
                    <option key={option.id} value={option.name}>
                      {t(option.name)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-3">
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
            <PhoneNumberInput
              label={t('Contact No')}
              // required
              {...register('contact_no')}
              control={control}
              error={t(errors.contact_no?.message!)}
              required
              // error={t(errors.primary_contact_detail?.contact_no?.message!)}
            />

            <PasswordInput
              label={t('Password')}
              type="password"
              {...register('password', {
                minLength: {
                  value: 8,
                  message: t('Password must be at least 8 characters'),
                },
              })}
              variant="outline"
              className="mb-3"
              error={t(errors?.password?.message!)}
              required
            />
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
              required
            />
            <Input
              type="date"
              label={t('Joining Date')}
              {...register('joining_date')}
              variant="outline"
              className="mb-3"
            />
            <Input
              label={t('Job Title')}
              {...register('job_title')}
              variant="outline"
              className="mb-3"
            />

            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Tag')}
              </label>
              <div className="">
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
              </div>
            </div>
            {/* <Input
              label={t('Tag')}
              {...register('tag')}
              variant="outline"
              className="mb-5"
            /> */}
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
