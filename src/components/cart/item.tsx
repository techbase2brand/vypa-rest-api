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
import { FormValues } from '../shop/approve-shop';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useEmployeesQuery } from '@/data/employee';
import { useShopsQuery } from '@/data/shop';

interface CartItemProps {
  item: any;
}

const CartItem = ({ item }: CartItemProps) => {
  const { t } = useTranslation('common');

  // const { employee, paginatorInfo, loading, error } = useEmployeesQuery({
  //   //@ts-ignore
  //   limit: 100,
  
  // });
  // const { shops,  } = useShopsQuery({
  //   //@ts-ignore
  //   limit: 100,
  // });
  // console.log("employeeemployeecart",shops);
  
  const [options, setOptions] = useState({
    frontLogo: false,
    rearLogo: false,
    name: false,
    defaultLogo: false,
  });
  const [selectedCompany, setSelectedCompany] = useState(null);

  // const handleSelect = (company) => {
  //   setSelectedCompany(company);
  // };
  //@ts-ignore
  const handleCheckboxChange = (option) => {
    //@ts-ignore
    setOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };
  const { control } = useForm<FormValues>();
  const { isInStock, clearItemFromCart, addItemToCart, removeItemFromCart } =
    useCart();

  const { price } = usePrice({
    amount: item.price,
  });
  const { price: itemPrice } = usePrice({
    amount: item.itemTotal,
  });

  function handleIncrement(e: any) {
    e.stopPropagation();
    addItemToCart(item, 1);
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };
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
      {/* <div className="flex-shrink-0">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div> */}

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
        <h3 className="font-bold text-heading">{item.name}</h3>
        <p className="my-2.5 font-semibold text-accent">{price}</p>
        <span className="text-xs text-body">
          {item.quantity} X {item.unit}
        </span>

        <div className='flex'>
          <select
            name=""
            id=""
            className="border-[#f3f4f6]"
            style={{ backgroundColor: 'transparent' }}
          >
            <option value="">Company Name</option>
            <option value="company1">company1</option>
            <option value="company2">company2</option>
          </select>
          <select
            name=""
            id=""
            className="border-[#f3f4f6]"
            style={{ backgroundColor: 'transparent' }}
          >
            <option value="">Employee Name</option>
            <option value="Employee1">Employee1</option>
            <option value="Employee2">Employee2</option>
          </select>
        </div>
      </div>

      <div className="flex items-center   rounded-lg ">
        {/* Front Logo */}
        <div className="items-center ml-6">
          <span className="text-sm font-medium">Front Logo</span>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.frontLogo}
              onChange={() => handleCheckboxChange('frontLogo')}
              className="form-checkbox h-5 w-5 text-black"
            />
          </label>
          <span className="text-sm font-semibold mt-1">$8</span>
        </div>

        {/* Rear Logo */}
        <div className="flex flex-col items-center mx-4">
          <span className="text-sm font-medium">Rear Logo</span>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.rearLogo}
              onChange={() => handleCheckboxChange('rearLogo')}
              className="form-checkbox h-5 w-5 text-black"
            />
          </label>
          <span className="text-sm font-semibold mt-1">$6</span>
        </div>

        {/* Name */}
        <div className="flex flex-col items-center mr-6">
          <span className="text-sm font-medium">Name</span>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.name}
              onChange={() => handleCheckboxChange('name')}
              className="form-checkbox h-5 w-5 text-black"
            />
          </label>
          <span className="text-sm font-semibold mt-1">$5</span>
        </div>

        <Card className="w-40 h-40 rounded-full">
          <FileInput name="logo" control={control} multiple={false} />
        </Card>
        {/* Default Logo */}
        <div className="flex flex-col items-center mx-4">
          <span className="text-sm font-medium">Default Logo</span>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={options.defaultLogo}
              onChange={() => handleCheckboxChange('defaultLogo')}
              className="form-checkbox h-5 w-5 text-black"
            />
          </label>
        </div>
      </div>

      <div className="flex-shrink-0 ">
        <Counter
          value={item.quantity}
          onDecrement={handleRemoveClick}
          onIncrement={handleIncrement}
          variant="pillVertical"
          disabled={outOfStock}
        />
      </div>
      <span className="font-bold text-heading ml-10">{itemPrice}</span>

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
