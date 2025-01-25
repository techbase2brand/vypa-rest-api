import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { SortOrder, Type } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Routes } from '@/config/routes';
import { adminOnly } from '@/utils/auth-utils';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';


type Product = {
    id: string;
    name: string;
    price: number;
    options: { frontLogo: boolean; rearLogo: boolean; nameTag: boolean };
    quantity: number;
  };
  const products: Product[] = [
    {
      id: '1',
      name: 'DNC 3710 Hi-Vis X Back',
      price: 50.00,
      options: { frontLogo: false, rearLogo: false, nameTag: false },
      quantity: 1
    },
    // Add more products as needed
  ];

export default function Categories() {
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc); 


  return (
    <>
 <div className="container mx-auto mt-4">
        <div className="flex pl-4">
        <p className='mt-1 font-medium w-[84%]'>Product</p>
        <p className='mt-1 font-medium  w-[9%]'>Quantity</p>
        <p className='mt-1 font-medium'>Subtotal</p>

        </div>
      <div className="flex flex-col">
        {products.map((product, index) => (
          <div key={product.id} className="flex flex-row justify-between items-center bg-gray-100 p-4 mb-2">
            <div className="flex flex-col">
            <div className="flex gap-4 items-center">
            <img className='w-[150px]' alt='product' src='http://localhost:3002/_next/image?url=https%3A%2F%2Fstingray-app-mkueb.ondigitalocean.app%2Fstorage%2F2557%2Fconversions%2FVypa-BreezeHi-Vis-X-Back-NSW-Rail-Shirt-Rear-Web-scaled-thumbnail.jpg&w=1920&q=75' />
                <div>
              <span className="font-bold">{product.name}</span>
              <div className='flex items-center justify-between'>
              <span className='text-[#161616]'>SKU: VIP12345</span>
              <select name="" id="" className='border-[#f3f4f6]' style={{ backgroundColor:'transparent' }}>
                <option value="">Employee Name</option>
                <option value="">Chacha</option>
              </select> 
              </div>
              <div className='flex gap-3'>
              <textarea name="" id="" placeholder='Staff Name/Embroidery Details' className='border shadow rounded w-full text-sm'></textarea>
            <p className='flex'> <span className='font-bold mr-3'> Price</span> ${(product.price * product.quantity).toFixed(2)}</p>
              </div>
              </div>

              </div>
            </div>
            <div className="flex flex-row justify-between items-center w-1/3">
              <div className='text-center'>
               <p> Front Logo</p> 
                <input type="checkbox" checked={product.options.frontLogo} />
                <p className='mt-1 font-medium'>($8)</p>
              </div>
              <div className='text-center'>
               <p> Rear Logo</p> 
                <input type="checkbox" checked={product.options.frontLogo} />
                <p className='mt-1 font-medium'>($8)</p>
              </div> 
              <div className='text-center'>
               <p> Name</p> 
                <input type="checkbox" checked={product.options.frontLogo} />
                <p className='mt-1 font-medium'>($8)</p>
              </div>  
            </div>
            <div className="w-[120px] flex justify-between items-center bg-[#fff]" style={{ padding:'10px 15px' }}>
              <button>-</button>
              <span>{product.quantity}</span>
              <button>+</button>
            </div>
              <b>${(product.price * product.quantity).toFixed(2)}</b>
          </div>
        ))}
      </div>
      <div className="flex justify-end p-4">
        <button className="bg-transprint text-black p-2 pl-4 pr-4 border border-black rounded mr-2">Continue To Shopping</button>
        <button className="bg-black text-white p-2 pl-4 pr-4 rounded">Update Cart</button>
      </div>
    </div>
    </>
  );
}

Categories.authenticate = {
  permissions: adminOnly,
};
Categories.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
