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
import { useInActiveShopsQuery, useShopsQuery } from '@/data/shop';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';
import Multiselect from 'multiselect-react-dropdown';
import VariantTable from './variant-table';
import { SortOrder } from '@/types';
 
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
  // name: string;
  // gender?: string;
  // password?: string;
  // cover_image: any;
  logo: any;
  // contact_no?: any;
  // joining_date?: any;
  // job_title?: string;
  // tag?: string;
  name: string;
  description: string;
  productImages: FileList | null;
  sku: string;
  color: string;
  size: string;
  gender: string;
  brand: string;
  category: string;
  subCategory: string;
  price: number;
  salePrice: number;
  quantity: number;
  tag: string;
  variants: {
    key: string;
  }[];
  colors: {
    key: string;
  }[];
  sizes: {
    key: string;
  }[];
  materials: {
    key: string;
  }[];

};
const AddProduct = ({ initialValues }: { initialValues?: Shop }) => {


    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [orderBy, setOrder] = useState('created_at');
    const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
    const { shops, paginatorInfo, loading, error } = useShopsQuery({
      name: searchTerm,
      limit: 10,
      page,
      orderBy,
      sortedBy,
      is_active: false,
    });

  const [activeTab, setActiveTab] = useState(1); 
  const [isChecked, setIsChecked] = useState(false); // State for checkbox

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
            // joining_date: '2024-12-31',
            logo: getFormattedImage(initialValues?.logo as IImage),
            // cover_image: getFormattedImage(
            //   initialValues?.cover_image as IImage,
            // ),
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
  function handlePagination(current: any) {
    setPage(current);
  }
 

  // Handle checkbox toggle
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if (!isChecked) {
      // When checkbox is checked, activate Combination tab
      setActiveTab(2);
    } else {
      // When checkbox is unchecked, activate Basic Info tab
      setActiveTab(1);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="  justify-between items-center">  
          <div className="border-b border-gray-200 dark:border-neutral-700 flex justify-between items-center">
        <nav className="flex gap-4" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          <button
            type="button"
            className={`hs-tab-active:font-bold hs-tab-active:border-green-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2    hs-tab-active:text-green-600 text-sm whitespace-nowrap text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500 ${activeTab === 1 ? 'font-semibold-600 border-green-600 text-green-600' : ''}`}
            onClick={() => setActiveTab(1)}
            id="tabs-with-underline-item-1"
            aria-selected={activeTab === 1 ? 'true' : 'false'}
            aria-controls="tabs-with-underline-1"
            role="tab"
            style={{color:'#000',fontSize:'18px'}}
          >
            Basic Info
          </button>
          {isChecked && (
          <button
            type="button"
            className={`hs-tab-active:font-bold hs-tab-active:border-green-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2    hs-tab-active:text-green-600 text-sm whitespace-nowrap text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500 ${activeTab === 2 ? 'font-semibold-600 border-green-600 text-green-600' : ''}`}
            onClick={() => setActiveTab(2)}
            id="tabs-with-underline-item-2"
            aria-selected={activeTab === 2 ? 'true' : 'false'}
            aria-controls="tabs-with-underline-2"
            role="tab"
            style={{color:'#000',fontSize:'18px'}}
          >
            Combination
          </button> 
           )}
        </nav>


        <div className='flex items-center gap-3' style={{lineHeight:'0px'}}>Does this product have variants?  

        <label className="switch">
 <input type="checkbox" id="togBtn" checked={isChecked}
          onChange={handleCheckboxChange} />
 <div className="slider round"> 
  <span className="on">ON</span>
  <span className="off">OFF</span> 
 </div>
</label>

          {/* <div className="relative inline-block w-11 h-5">
          <input checked={isChecked}
          onChange={handleCheckboxChange}
            id="switch-component-greens" type="checkbox" className="peer appearance-none w-11 h-5 bg-red-500 rounded-full checked:bg-green-600 cursor-pointer transition-colors duration-300" />
          <label htmlFor="switch-component-greens" className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer">
          </label>
        </div>  */}
          </div>
      </div>

      <div className="mt-3">
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-1"
          className={activeTab === 1 ? '' : 'hidden'}
        >
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
              <div className="mb-4">
              <Input
              label='Product SKU'
              {...register('sku')}
              variant="outline"
              className="mb-0"
              placeholder='Product SKU'
            />  
              </div>

              <div className="mb-4 flex justify-between gap-4"> 
                <div className='w-full'>
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Color
                </label>
                <div className="">
                <select  {...register('color')} className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Color</option>
                    <option value="Orange">Orange Navy</option>
                    <option value="Yellow">Yellow Navy</option>
                  </select>
                </div>
                </div>

                <div className='w-full'>

                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Size
                </label>
                <div className="">
                <select {...register('size')} className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Size</option>
                    <option value="female">Size Small   $50.00</option>
                    <option value="female">Size Medium   $52.00</option>
                    <option value="female">Size Large   $54.00</option>
                    <option value="female">Size XL   $57.00</option>
                    <option value="female">Size 2XL   $60.00</option>
                    <option value="female">Size 3XL   $62.00</option>
                    <option value="female">Size 4XL   $64.00</option>
                    <option value="female">Size 5XL   $67.00</option>
                    <option value="female">Size 7XL   $70.00</option>
                  </select>
                </div>
                </div>

                <div className='w-full'>
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Gender
                </label>
                <div className="">
                  <select {...register('gender')} className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12">
                    <option value=" " selected>Select Gender</option>
                    <option value="Womwn">Women</option>
                    <option value="Men">Men</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
                </div> 
              </div>

              <div className="mb-4">
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Select Brand
                </label>
                <div className="">
                  <select
                    {...register('brand')}
                    className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                  >
                    <option value="">Select Brand</option>
                    <option value="xy">{t('xy')}</option>
                    <option value="abc">{t('abc')}</option>

                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Category
                </label>
                <div className="">
                  <select
                    {...register('category')}
                    className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                  >
                    <option value=" " selected>Select Category</option>
                    <option value="female">NSW Rail Clothing</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
                Sub Category
                </label>
                <div className="">
                  <select
                    {...register('subCategory')}
                    className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                  >
                    <option value=" " selected>Select Sub Category</option>
                    <option value="NSW Rail Shirts">NSW Rail Shirts</option>
                    <option value="abcd"> abcd </option>

                  </select>
                </div>
              </div>
              <div className="mb-4">
              <Input
              label='Product Price'
              {...register('price')}
              variant="outline"
              className="mb-0"
              placeholder='$0'
            />  
              </div>
              <div className="mb-4">
              <Input
              label='Sale Price'
              {...register('salePrice')}
              variant="outline"
              className="mb-0"
              placeholder='$0'
            />  
              </div>

              <div className="mb-4">
              <Input
              label='Product Quantity'
              {...register('quantity')}
              variant="outline"
              className="mb-0"
              placeholder='0'
            />  
              </div>

              <div className="mb-4">
              <Input
              label='Tag'
              {...register('tag')}
              variant="outline"
              className="mb-0"
              placeholder='Women Uniform'
            />  
              </div>
 
          </div>
        </div>
        </div>




        <div
          id="tabs-with-underline-2"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
          className={activeTab === 2 ? '' : 'hidden'}
        >
<div className="grid grid-cols-2 gap-3 mb-4">

         <Multiselect
         placeholder='Select...'
  displayValue="key"
  onKeyPressFn={function noRefCheck(){}}
  onRemove={function noRefCheck(){}}
  onSearch={function noRefCheck(){}}
  onSelect={function noRefCheck(){}}
  options={[
    {
      cat: 'Group 1',
      key: 'Color'
    },
    {
      cat: 'Group 2',
      key: 'Size'
    },
    {
      cat: 'Group 3',
      key: 'Material'
    }
  ]}
  showCheckbox
/>



<Multiselect
         placeholder='Select Color'
  displayValue="key"
  onKeyPressFn={function noRefCheck(){}}
  onRemove={function noRefCheck(){}}
  onSearch={function noRefCheck(){}}
  onSelect={function noRefCheck(){}}
  options={[
    {
      cat: 'Red 1',
      key: 'Red'
    },
    {
      cat: 'Green 2',
      key: 'Green'
    }
  ]}
  showCheckbox
/>

<Multiselect
         placeholder='Select Size'
  displayValue="key"
  onKeyPressFn={function noRefCheck(){}}
  onRemove={function noRefCheck(){}}
  onSearch={function noRefCheck(){}}
  onSelect={function noRefCheck(){}}
  options={[
    {
      cat: 'Small 1',
      key: 'Small'
    },
    {
      cat: 'Medium 2',
      key: 'Medium'
    },
    {
      cat: 'Large 3',
      key: 'Large'
    } 
  ]}
  showCheckbox
/>

<Multiselect
         placeholder='Select Material'
  displayValue="key"
  onKeyPressFn={function noRefCheck(){}}
  onRemove={function noRefCheck(){}}
  onSearch={function noRefCheck(){}}
  onSelect={function noRefCheck(){}}
  options={[ 
    {
      cat: 'ABC',
      key: 'ABC'
    }
  ]}
  showCheckbox
/>
        </div> 

        <div className="text-right mb-5">
          <Button className='mr-3 bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black  items-center pl-8 pr-8'>Generate Variants</Button>
          <Button className='bg-transprent border border-red-600 text-red-600 hover:bg-transprint-700  hover:bg-white hover:text-black  items-center pl-8 pr-8'>Clear Variants</Button>
        </div>

        <div className='mt-5'>
          <VariantTable 
        shops={shops}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        // @ts-ignore
         />
        </div>

        </div> 
      </div>  
        </div>
       
        
         
  
     
<div className="grid grid-cols-2 gap-3 justify-between">
<Button className='bg-transprent border border-red-600 text-red-600 hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 items-center pl-8 pr-8'>Cancel</Button>
<Button className='bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 items-center pl-8 pr-8'>Add product</Button>
</div>
     
      </form>
    </>
  );
};

export default AddProduct;
