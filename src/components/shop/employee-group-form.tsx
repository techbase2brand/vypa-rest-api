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

type Option = {
  id: number;
  name: string;
  isChecked: boolean;
};

const EmployeeGroupForm = ({ initialValues }: { initialValues?: Shop }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  const [selection, setSelection] = useState<string>('Manual');

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



  
  const [checkboxOptions, setCheckboxOptions] = useState<Option[]>([
    { id: 1, name: 'David', isChecked: false },
    { id: 2, name: 'John Smith', isChecked: false },
    { id: 3, name: 'Olivia', isChecked: false },
    { id: 4, name: 'Faddi', isChecked: false },
    { id: 5, name: 'Lilly', isChecked: false },
    { id: 6, name: 'Jackson', isChecked: false }
  ]);

  const handleCheckboxChange = (id: number) => {
    const newCheckboxOptions = checkboxOptions.map((option: Option) => {
      if (option.id === id) {
        return { ...option, isChecked: !option.isChecked };
      }
      return option;
    });
    setCheckboxOptions(newCheckboxOptions);
  };

  const handleRemoveName = (id: number) => {
    const newCheckboxOptions = checkboxOptions.map((option: Option) => {
      if (option.id === id) {
        return { ...option, isChecked: false };
      }
      return option;
    });
    setCheckboxOptions(newCheckboxOptions);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="w-full mb-5">
        
            <Input
              label={t('Group Name')}
              {...register('name')}
              variant="outline"
              placeholder='Enter group name'
              className="mb-2 w-full"
            /> 
        </div>
        <label className='flex text-body-dark font-semibold text-sm leading-none mb-3'>Select Group Type</label>
        <div className="flex gap-4 mb-4">
        <label className="mb-1 flex gap-1 items-center">
          <input
            type="radio"
            className="checked:bg-emerald-400 checked:hover:bg-emerald-400 checked:active:bg-emerald-400 checked:focus:bg-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            name="selection"
            value="Manual"
            checked={selection === 'Manual'}
            onChange={() => setSelection('Manual')}
          />
          <span>Manual</span>
        </label>
        <label className="mb-1 flex gap-1 items-center">
          <input
            type="radio"
            className="checked:bg-emerald-400 checked:hover:bg-emerald-400 checked:active:bg-emerald-400 checked:focus:bg-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
            name="selection"
            value="Tag Based"
            checked={selection === 'Tag Based'}
            onChange={() => setSelection('Tag Based')}
          />
          <span>Tag Based</span>
        </label>
      </div> 
      <div id="contentArea" className="mb-3">
        {selection === 'Manual' && (
          <label className="flex text-body-dark font-semibold text-sm leading-none">
            Select Employee for Group
          </label>
        )}
        {selection === 'Tag Based' && (
          <label className="flex text-body-dark font-semibold text-sm leading-none">
            Select  Tag  for Group
          </label>
        )}
      </div>
      <div className='flex gap-4 border p-2 mb-4 rounded'>
        {checkboxOptions.filter((option: Option) => option.isChecked).map((option: Option) => (
          <span key={option.id} className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
            {option.name} <a href="#" onClick={(e) => { e.preventDefault(); handleRemoveName(option.id); }} style={{ cursor: 'pointer',marginLeft:'5px' }}> X</a>
          </span>
        ))}
      </div>
      <div className='border p-3 rounded'>
      {checkboxOptions.map((option: Option) => (
        <label key={option.id} className="flex gap-1 items-center border-b pb-2 pt-2">
          <input
            type="checkbox"
            checked={option.isChecked}
            onChange={() => handleCheckboxChange(option.id)}
            className="checked:bg-emerald-400 checked:hover:bg-emerald-400 checked:active:bg-emerald-400 checked:focus:bg-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
          />
          <span>{option.name}</span>
        </label>
      ))}
    
    </div> 

    <div className="flex justify-between mt-8">
      <Button className='bg-transprint hover:bg-white-500' style={{color:'red', border:'1px solid red', width:'48%'}} >Cancle</Button>
      <Button className='bg-black text-white' style={{width:'48%'}}>Save & Continue</Button>
    </div>
      </form>
    </>
  );
};

export default EmployeeGroupForm;
