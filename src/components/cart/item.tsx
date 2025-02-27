// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import Counter from '@/components/ui/counter';
// import { CloseIcon } from '@/components/icons/close-icon';
// import { fadeInOut } from '@/utils/motion/fade-in-out';
// import { useTranslation } from 'next-i18next';
// import { useCart } from '@/contexts/quick-cart/cart.context';
// import usePrice from '@/utils/use-price';
// import FileInput from '../ui/file-input';
// import Card from '../common/card';
// import { FormValues } from '../shop/approve-shop';
// import { useForm } from 'react-hook-form';
// import { useState } from 'react';
// import { useEmployeesQuery } from '@/data/employee';
// import { useShopsQuery } from '@/data/shop';
// import { getAuthCredentials } from '@/utils/auth-utils';
// import { useMeQuery } from '@/data/user';

// interface CartItemProps {
//   item: any;
// }
// const CartItem = ({ item }: CartItemProps) => {
//   const { t } = useTranslation('common');
//   const { role } = getAuthCredentials();
//   const { data: me } = useMeQuery();
//   const [selectedCompany, setSelectedCompany] = useState(null);
//   const [selectedEmp, setSelectedEmp] = useState(null);

//   console.log('selectedCompany', selectedCompany, "selectedEmp",selectedEmp);
//   const { employee, paginatorInfo, loading, error } = useEmployeesQuery({
//     //@ts-ignore
//     limit: 100,
//     //@ts-ignore
//     shop_id: selectedCompany || me?.shops?.[0]?.id,
//   });
//   const { shops } = useShopsQuery({
//     //@ts-ignore
//     limit: 100,
//   });
//   console.log('employeeemployeecart', shops, employee, me?.shops?.[0]?.id);

//   const [options, setOptions] = useState({
//     frontLogo: false,
//     rearLogo: false,
//     name: false,
//     defaultLogo: false,
//   });

//   //@ts-ignore
//   const handleChange = (event) => {
//     const selectedOption = shops.find(
//       //@ts-ignore
//       (option) => option.name === event.target.value,
//     );
//     //@ts-ignore
//     setSelectedCompany(selectedOption?.id || null);
//   };
//    //@ts-ignore
//    const handleEmpChange = (event) => {
//     const selectedOption = employee.find(
//       //@ts-ignore
//       (option) => option.name === event.target.value,
//     );
//     //@ts-ignore
//     setSelectedEmp(selectedOption?.id || null);
//   };
//   //@ts-ignore
//   const handleCheckboxChange = (option) => {
//     //@ts-ignore
//     setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
//   };
//   const { control } = useForm<FormValues>();
//   const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart } =
//     useCart();

//   const { price } = usePrice({
//     amount: item.price,
//   });
//   const { price: itemPrice } = usePrice({
//     amount: item.itemTotal,
//   });

//   function handleIncrement(e: any) {
//     e.stopPropagation();
//     addItemToCart(item, 1);
//   }

//   const handleRemoveClick = (e: any) => {
//     e.stopPropagation();
//     removeItemFromCart(item.id);
//   };
//   const outOfStock = !isInStock(item.id);
//   return (
//     <motion.div
//       layout
//       initial="from"
//       animate="to"
//       exit="from"
//       variants={fadeInOut(0.25)}
//       className="flex shadow-lg items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
//     >
//       <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
//         <Image
//           src={item?.image ?? '/'}
//           alt={item.name}
//           fill
//           sizes="(max-width: 768px) 100vw"
//           className="object-contain"
//         />
//       </div>
//       <div>
//         <h3 className="font-bold text-heading">{item.name}</h3>
//         <p className="my-2.5 font-semibold text-accent">{price}</p>
//         <span className="text-xs text-body">
//           {item.quantity} X {item.unit}
//         </span>

//         <div className="flex gap-6">
//           {role == 'super_admin' && (
//             <div className="mb-3 w-1/2">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 {t('Company Name')}
//               </label>
//               <div className="">
//                 <select
//                   // {...register('company_name')}
//                   onChange={handleChange}
//                   className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
//                 >
//                   <option value=" ">{t('Select company...')}</option>
//                   {shops?.map((option) => (
//                     <option key={option.id} value={option.name}>
//                       {t(option.name)}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           )}

//          <div className="mb-3 w-1/2">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               {t('Employee Name')}
//             </label>
//             <div className="">
//               <select
//                 // {...register('company_name')}
//                 onChange={handleEmpChange}
//                 className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
//               >
//                 <option value=" ">{t('Select Employee...')}</option>
//                 {employee?.map((option) => (
//                   <option key={option.id} value={option.name}>
//                     {t(option.name)}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center   rounded-lg ">
//         {/* Front Logo */}
//         <div className="items-center ml-6">
//           <span className="text-sm font-medium">Front Logo</span>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={options.frontLogo}
//               onChange={() => handleCheckboxChange('frontLogo')}
//               className="form-checkbox h-5 w-5 text-black"
//             />
//           </label>
//           <span className="text-sm font-semibold mt-1">$8</span>
//         </div>

//         {/* Rear Logo */}
//         <div className="flex flex-col items-center mx-4">
//           <span className="text-sm font-medium">Rear Logo</span>
//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={options.rearLogo}
//               onChange={() => handleCheckboxChange('rearLogo')}
//               className="form-checkbox h-5 w-5 text-black"
//             />
//           </label>
//           <span className="text-sm font-semibold mt-1">$6</span>
//         </div>

//         {/* Name */}
//         <div className="flex flex-col items-center mr-6">
//           <span className="text-sm font-medium">Name</span>

//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={options.name}
//               onChange={() => handleCheckboxChange('name')}
//               className="form-checkbox h-5 w-5 text-black"
//             />
//           </label>
//           <span className="text-sm font-semibold mt-1">$5</span>
//         </div>

//         <Card className="w-40 h-40 rounded-full">
//           <FileInput name="logo" control={control} multiple={false} />
//         </Card>
//         {/* Default Logo */}
//         <div className="flex flex-col items-center mx-4">
//           <span className="text-sm font-medium">Default Logo</span>

//           <label className="flex items-center space-x-2">
//             <input
//               type="checkbox"
//               checked={options.defaultLogo}
//               onChange={() => handleCheckboxChange('defaultLogo')}
//               className="form-checkbox h-5 w-5 text-black"
//             />
//           </label>
//         </div>
//       </div>

//       <div className="flex-shrink-0 ">
//         <Counter
//           value={item.quantity}
//           onDecrement={handleRemoveClick}
//           onIncrement={handleIncrement}
//           variant="pillVertical"
//           disabled={outOfStock}
//         />
//       </div>
//       <span className="font-bold text-heading ml-10">{itemPrice}</span>

//       <button
//         className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
//         onClick={() => clearItemFromCart(item.id)}
//       >
//         <span className="sr-only">{t('text-close')}</span>
//         <CloseIcon className="h-3 w-3" />
//       </button>
//     </motion.div>
//   );
// };

// export default CartItem;

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Counter from '@/components/ui/counter';
import { CloseIcon } from '@/components/icons/close-icon';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import usePrice from '@/utils/use-price';
import FileInput from '../ui/file-input';
import Card from '../common/card';
// import { FormValues } from '../shop/approve-shop';
import { useForm } from 'react-hook-form';
import { useEmployeesQuery } from '@/data/employee';
import { useShopsQuery } from '@/data/shop';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useMeQuery } from '@/data/user';
import { useSettingsQuery } from '@/data/settings';
import { useRouter } from 'next/router';
import { siteSettings } from '@/settings/site.settings';
import TextArea from '../ui/text-area';
import { useCompanySettingsQuery } from '@/data/comapny-setting';

interface CartItemProps {
  item: any;
  onCompanyChange: any;
  selectedCompany: any;
  setSelectedCompany: any;
}
type FormValues = {
  logo: any;
};

const CartItem = ({
  item,
  onCompanyChange,
  selectedCompany,
  setSelectedCompany,
}: CartItemProps) => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { role } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { control } = useForm<FormValues>();
  const { settings } = useSettingsQuery({
    //@ts-ignore
    language: locale!,
  });
  // const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState<
    { name: string; cost: number }[]
  >([]);
  const [fileUrl, setFileUrl] = useState<null>(null);
  const [defaultLogoChecked, setDefaultLogoChecked] = useState(true);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [textAreaValue, setTextAreaValue] = useState('');

  const { companySetting } = useCompanySettingsQuery({
    //@ts-ignore
    language: locale!,
    //@ts-ignore
    shop_id: selectedCompany?.id || me?.shops?.[0]?.id || me?.managed_shop?.id,
  });
  //@ts-ignore
  console.log(
    'companySettingcompanySettingcompanySetting',
    companySetting,
    //@ts-ignore
    selectedCompany.id,
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(event.target.value);
  };
  console.log('item>>>>', item);

  //@ts-ignore
  const { employee } =
    role !== 'employee'
      ? useEmployeesQuery({
          //@ts-ignore
          limit: 100,
          //@ts-ignore
          shop_id: selectedCompany?.id || me?.shops?.[0]?.id,
        })
      : {};

  console.log('employeeemployeeemployee..', employee);
  //@ts-ignore
  const { shops } =
    role !== 'employee'
      ? useShopsQuery({
          //@ts-ignore
          limit: 100,
        })
      : {};

  const {
    isInStock,
    clearItemFromCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItem,
  } = useCart();

  // Handle Company Selection
  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = shops?.find(
      //@ts-ignore
      (shop) => shop?.name === event.target.value,
    );
    //@ts-ignore
    setSelectedCompany(selectedOption ? selectedOption.id : null);
  };

  // Handle Employee Selection
  const handleEmployeeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const selectedOption = employee?.find(
      //@ts-ignore
      (emp) => emp?.name === event.target.value,
    );
    //@ts-ignore
    setSelectedEmployee(selectedOption ? selectedOption.owner_id : null);
  };

  const handleLogoChange = (url: string) => {
    //@ts-ignore
    setLogoUrl(url?.original); // Store the logo URL
    //@ts-ignore
  };

  const [fileUploaded, setFileUploaded] = useState(false);
  const handleCheckboxChange = (name: string, cost: number) => {
    setSelectedOptions((prev) => {
      if (name === 'Default Logo') {
        // If "Default Logo" is selected, clear all other options and select only this
        setDefaultLogoChecked(true);
        return [{ name, cost }];
      }

      // If selecting a non-"Default Logo" option, uncheck "Default Logo"
      setDefaultLogoChecked(false);

      const updatedOptions = prev.some((option) => option.name === name)
        ? prev.filter((option) => option.name !== name) // Remove if it exists
        : [...prev, { name, cost }]; // Add if it doesn’t exist

      return updatedOptions;
    });
  };

  const handleDefaultLogoChange = () => {
    setDefaultLogoChecked((prevChecked) => {
      if (!prevChecked) {
        // If "Default Logo" is being checked, clear all other options
        setSelectedOptions([{ name: 'Default Logo', cost: 0 }]);
      } else {
        // If "Default Logo" is being unchecked, clear it from the options
        setSelectedOptions([]);
      }
      return !prevChecked;
    });
  };

  useEffect(() => {
    if (!defaultLogoChecked) {
      setFileUploaded(true); // Show upload image when "Default Logo" is unchecked
    } else {
      setFileUploaded(false); // Hide upload image when "Default Logo" is checked
    }
  }, [defaultLogoChecked]);
  const { price } = usePrice({
    amount: item.price,
  });
 
  const { price: itemPrice } = usePrice({
    amount: (item.itemTotal ?? 0) + (item.total_logo_cost ?? 0), // Use parentheses for proper grouping
  });

  const totalCost = selectedOptions.reduce(
    (sum, option) => sum + option.cost,
    0,
  );
  console.log('itemPrice', itemPrice);

  //@ts-ignore
  // Add item price and total logo cost
  const totalPrice = (
    (item.itemTotal ?? 0) + // Default to 0 if undefined
    (item.total_logo_cost ?? 0)
  ).toFixed(2);
  const formattedPrice = `$${totalPrice}`;
  function handleIncrement(e: any) {
    e.stopPropagation();
    addItemToCart(item, 1);
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const updateCartData = () => {
    const updatedItem = {
      ...item,
      //@ts-ignore
      shop_id:
        selectedCompany?.id || me?.shops?.[0]?.id || me?.managed_shop?.id,
      owner_id: selectedCompany?.owner_id || me?.shops?.[0]?.owner_id,
      employee: selectedEmployee || me?.id,
      selectlogo: selectedOptions,
      //@ts-ignore
      logoUrl: companySetting?.[0]?.logo?.original || logoUrl,
      total_logo_cost: totalCost,
      employee_details: textAreaValue,
    };
    //@ts-ignore
    updateCartItem(item.id, updatedItem);
  };

  useEffect(() => {
    if (
      //@ts-ignore
      selectedCompany ||
      selectedEmployee ||
      textAreaValue ||
      selectedOptions.length > 0
    ) {
      updateCartData();
    }
  }, [
    //@ts-ignore
    selectedCompany,
    selectedEmployee,
    selectedOptions,
    logoUrl,
    textAreaValue,
  ]); // Include updateCartData in deps if needed

  const outOfStock = !isInStock(item.id);
  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex shadow-lg items-center border-b border-solid border-border-200 border-opacity-75 px-4 py-4 text-sm sm:px-6"
    >
      <div className="relative mx-4 flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden bg-gray-100 sm:h-16 sm:w-16">
        <Image
          src={item?.image ?? '/'}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw"
          className="object-contain"
        />
      </div>
      <div>
        <h3 className="font-bold text-heading">{item?.name}</h3>
        <p className="my-2.5 font-semibold text-accent">{price}</p>
        <span className="text-xs text-body">
          {item?.quantity} X {item?.unit}
        </span>

        <div className="flex gap-6">
          {role === 'super_admin' && (
            <div className="mb-3 w-1/2 ">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Company Name')}
              </label>
              <select
                onChange={onCompanyChange} // Parent function ko call karega
                //@ts-ignore
                value={selectedCompany.id}
                // onChange={handleCompanyChange}
                // value={selectedCompany}
                className="px-4 w-full rounded border border-border-base focus:border-accent h-10"
              >
                <option value="">{t('Select company...')}</option>
                {/* @ts-ignore */}
                {shops?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {t(option.name)}
                  </option>
                ))}
              </select>
            </div>
          )}
          {role !== 'employee' && (
            <div className="mb-3 w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Employee Name')}
              </label>
              <select
                onChange={handleEmployeeChange}
                className="px-4 w-full rounded border border-border-base focus:border-accent h-10"
              >
                <option value="">{t('Select Employee...')}</option>
                {/* @ts-ignore */}
                {employee?.map((option) => (
                  <option key={option.id} value={option.name}>
                    {t(option.name)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* @ts-ignore */}
        <TextArea
          label={t('Staff Name/Embroidery Details ')}
          variant="outline"
          className="col-span-2"
          value={textAreaValue}
          onChange={handleChange}
        />
      </div>
      {/* <div className="flex items-center ml-6 gap-4">
        {[
          { name: 'Front Logo', cost: 8 },
          { name: 'Rear Logo', cost: 6 },
          { name: 'Name', cost: 5 },
          { name: 'Default Logo', cost: 4 },
        ].map((option) => (
          <div key={option.name} className="flex flex-col items-center">
            <span className="text-sm font-medium">{option.name}</span>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                onChange={() => handleCheckboxChange(option.name, option.cost)}
                className="form-checkbox h-5 w-5 text-black"
              />
            </label>
            <span className="text-sm font-semibold mt-1">${option.cost}</span>
          </div>
        ))}
      </div> */}
      <div className="flex items-centers ml-6 gap-4">
        {[
          {
            name: 'Front Logo',
            //@ts-ignore
            cost: Number(companySetting[0]?.front_logo) || 0,
          },
          {
            name: 'Rear Logo',
            //@ts-ignore
            cost: Number(companySetting[0]?.rear_logo) || 0,
          },
          //@ts-ignore
          { name: 'Name', cost: Number(companySetting[0]?.name) || 0 },
          { name: 'Default Logo' },
        ].map((option) => (
          <div key={option.name} className="flex flex-col items-center">
            <span className="text-sm text-center font-medium">
              {option.name}
            </span>
            <label className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                checked={
                  option.name === 'Default Logo'
                    ? defaultLogoChecked
                    : selectedOptions.some(
                        (selectedOption) => selectedOption.name === option.name,
                      )
                }
                onChange={() =>
                  option.name === 'Default Logo'
                    ? handleDefaultLogoChange()
                    : //@ts-ignore
                      handleCheckboxChange(option.name, option?.cost)
                }
                className="form-checkbox h-5 w-5 text-black"
              />
            </label>
            <span className="text-sm font-semibold mt-1">
              {option?.cost ? `$${option?.cost}` : ''}
            </span>
          </div>
        ))}
      </div>

      {fileUploaded ? (
        <form className="cart___item__image">
          <Card className="w-20 h-20 rounded-full">
            {/* @ts-ignore */}
            <FileInput
              name="logo"
              control={control}
              multiple={false}
              handleLogoChange={handleLogoChange}
            />
          </Card>
        </form>
      ) : (
        <div className="mx-6">
          {/* @ts-ignore */}
          <Image
            //@ts-ignore
            src={companySetting?.[0]?.logo?.original}
            width={50}
            height={50}
          />
        </div>
      )}

      {/* 
      <form>
        <Card className="w-40 h-40 rounded-full">
         
          <FileInput name="logo" control={control} multiple={false} />
        </Card>
      </form> */}

      <div className="flex-shrink-0 ">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div>
      <span className="font-bold text-heading ml-3">{itemPrice}</span>
      {/* <div className="ml-6">
        <span className="block text-sm font-medium">Selected Company:</span>
        <p className="text-sm">{selectedCompany || 'None'}</p>
        <span className="block text-sm font-medium mt-2">
          Selected Employee:
        </span>
        <p className="text-sm">{selectedEmployee || 'None'}</p>
        <span className="block text-sm font-medium mt-2">Total Cost:</span>
        <p className="text-sm font-semibold">${totalCost}</p>
      </div> */}
      <button
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-muted transition-all duration-200 -me-2 ms-3 hover:bg-gray-100 hover:text-red-600 focus:bg-gray-100 focus:text-red-600 focus:outline-none"
        onClick={() => clearItemFromCart(item.id)}
      >
        <span className="sr-only">{t('text-close')}</span>
        <CloseIcon className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default CartItem;
