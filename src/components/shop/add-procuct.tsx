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
import { shopValidationSchema } from './shop-validation-schema';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';

// const socialIcon = [
//   {
//     value: 'FacebookIcon',
//     label: 'Facebook',
//   },
//   {
//     value: 'InstagramIcon',
//     label: 'Instagram',
//   },
//   {
//     value: 'TwitterIcon',
//     label: 'Twitter',
//   },
//   {
//     value: 'YouTubeIcon',
//     label: 'Youtube',
//   },
// ];

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
  gender?: string;
  password?: string;
  cover_image: any;
  logo: any;
  contact_no?: any;
  joining_date?: any;
  job_title?: string;
  tag?: string;
};
const AddProduct = ({ initialValues }: { initialValues?: Shop }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  // const { permissions } = getAuthCredentials();
  // let permission = hasAccess(adminAndOwnerOnly, permissions);
  console.log('initialValues', initialValues);

  const { permissions } = getAuthCredentials();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
            joining_date: '2024-12-31',
            logo: getFormattedImage(initialValues?.logo as IImage),
            cover_image: getFormattedImage(
              initialValues?.cover_image as IImage,
            ),
          },
        }
      : {}),
    // @ts-ignore
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

  const today = new Date();

  const { t } = useTranslation();
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'settings.socials',
  // });

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    (router?.query?.action === 'edit' || router?.pathname === '/[shop]/edit') &&
    router?.locale === Config.defaultLanguage;

  // function onSubmit(values: FormValues) {
  //   console.log('onSubmitclicked', values.loginDetails);
  //   const updatedValues = {
  //     ...values,
  //     loginDetails: {
  //       ...values.loginDetails,
  //       password_confirmation: values.loginDetails.password, // Set password_confirmation to match password
  //     },
  //   };
  //   if (initialValues) {
  //     const { ...restAddress } = values.address;
  //     updateShop({
  //       id: initialValues?.id as string,
  //       ...values,
  //       address: restAddress,
  //       // settings,
  //       balance: {
  //         id: initialValues.balance?.id,
  //         ...values.balance,
  //       },
  //     });
  //   } else {
  //     createShop({
  //       ...updatedValues,
  //     balance: {
  //       ...updatedValues.balance,
  //     },
  //     });
  //   }
  // }
  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    // Add the `password_confirmation` field dynamically
    const updatedValues = {
      ...values,
    };
    console.log('Updated Values:', updatedValues);
    if (initialValues) {
      const { ...restAddress } = updatedValues;
      updateShop({
        id: initialValues?.id as string,
        ...updatedValues,
      });
    } else {
      createShop({
        ...updatedValues,
      });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex justify-between items-center">
          <b className='text-green bold' style={{color:'#21BA21',fontSize:'20px'}}>Basic Info</b>
          <div className='flex items-center gap-3' style={{lineHeight:'0px'}}>Does this product have variants?  
          <div className="relative inline-block w-11 h-5">
          <input   id="switch-component-greens" type="checkbox" className="peer appearance-none w-11 h-5 bg-red-500 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300" />
          <label htmlFor="switch-component-greens" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer">
          </label>
        </div> 
          </div>

        </div>
       
        
         
  
        <div className="flex w-full gap-4">
          <div className=" w-full pb-8 my-5 border-b border-dashed border-border-base sm:my-8"> 
            <div className="mb-2">
          <Input
              label='Product Title/Name'
              {...register('name')}
              variant="outline"
              className="mb-5"
              placeholder='Product Title/Name'
            />  
            </div>
            <div className="mb-2">
            <label className='flex text-body-dark font-semibold text-sm leading-none mb-3' htmlFor="">Product Description</label>
            <textarea className="resize rounded-md w-full" placeholder='Product Description'></textarea>
            </div>
            <div className="mb-4"> 
            <label className='flex text-body-dark font-semibold text-sm leading-none mb-3' htmlFor="">Product Image</label>
          <div className="grid grid-cols-2 gap-3 justify-between">
            <FileInput
              name="product"
              control={control}
              multiple={false}
              error={t(errors.logo?.message!)} 
            />  
             <FileInput
              name="product"
              control={control}
              multiple={false}
              error={t(errors.logo?.message!)}
            />  
            </div>
              </div>
              <div className="mb-2">
              <Input
              label='Product SKU'
              {...register('name')}
              variant="outline" 
              placeholder='Product SKU'
            />  
              </div>

              <div className="mb-2 flex justify-between gap-4"> 
                <div className='w-full'>
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Color
                </label>
                <div className="">
                <select className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Color</option>
                    <option value="female">{t('Female')}</option>
                  </select>
                </div>
                </div>

                <div className='w-full'>

                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Size
                </label>
                <div className="">
                <select className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Size</option>
                    <option value="female">{t('Female')}</option>
                  </select>
                </div>
                </div>

                <div className='w-full'>
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Gender
                </label>
                <div className="">
                  <select className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Gender</option>
                    <option value="female">{t('Female')}</option>
                  </select>
                </div>
                </div> 
              </div>

              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700">
                  {t('Gender')}
                </label>
                <div className="">
                  <select
                    {...register('gender')}
                    className="border rounded px-2 w-full"
                  >
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
                // error={t(errors.primary_contact_detail?.contact_no?.message!)}
              />

              <Input
                label={t('Password')}
                type="password"
                {...register('password', {
                  minLength: {
                    value: 8,
                    message: t('Password must be at least 8 characters'),
                  },
                })}
                variant="outline"
                className="mb-5"
              />
              <Input
                type="date"
                label={t('Job Title')}
                {...register('joining_date')}
                variant="outline"
                className="mb-5"
              />
              <Input
                label={t('Job Title')}
                {...register('job_title')}
                variant="outline"
                className="mb-5"
              />

              <Input
                label={t('Tag')}
                {...register('tag')}
                variant="outline"
                className="mb-5"
              /> 
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

export default AddProduct;
