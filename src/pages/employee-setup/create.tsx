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
import Link from 'next/link';
import Logo from '../../assets/placeholders/avatar.svg'
import Image from 'next/image';
import General from './general-form';
import PurchaseHistory from './purchase-history';
import Notification from './notification';
import SetLimit from './set-limit';

type TabName = 'General' | 'Shipping Address' | 'Purchase History' | 'Notification' | "Set Limit" | "Setting";
const products = [
  {
    inventoryId: '20-10-2023',
    description: '1226362373773',
    uom: 'EACH',
    quantity: 1,
    unitPrice: 23.90,
    employeeName: 'John Doe',
    embroideryDetails: 'Logo',
    frontLogo: true,
    rearLogo: false,
    name: true
  },
  {
    inventoryId: '20-10-2023',
    description: '1226362373773 ',
    uom: 'EACH',
    quantity: 2,
    unitPrice: 23.90,
    employeeName: 'Jane Smith',
    embroideryDetails: 'Custom Text',
    frontLogo: false,
    rearLogo: true,
    name: false
  },
];

export default function Categories() { 
  const [activeTab, setActiveTab] = useState<TabName>('General');

  const TabButton = ({ name }: { name: TabName }) => (
    <button
      className={`inline-block py-1 px-4 text-black font-semibold ${activeTab === name ? 'text-white bg-black border-b-2 border-black-700 rounded-tl rounded-tr' : 'text-black-500 hover:text-black-700'}`}
      onClick={() => setActiveTab(name)}
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </button>
  );


  return (
    <> 
 <div className="container mx-auto mt-4">
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
        <div className='w-[80%]'>
        <div className="-mx-3 md:flex mb-6">
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
            Contact Id
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" "/>
          </div>
          <div className="md:w-1/3 px-3">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Employee Status
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div>
         
        </div>
        <div className="-mx-3 md:flex mb-6">
        <div className="md:w-1/3 px-3">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Business Account 
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div>
          <div className="md:w-1/3 px-3 mb-6 md:mb-0">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
            Owner
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" "/>
          </div> 
        </div>
        <div className="-mx-3 md:flex mb-6">

        <div className="md:w-1/3 px-3">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Duplicate
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div>
        </div>
        </div>
      
        {/* Additional form fields and structure as per your screenshot */}
      </div>
      
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <ul className="flex border-b">
          {["General", "Shipping Address", "Purchase History", "Notification", "Set Limit", "Setting"].map((tab) => (
            <li className="mr-1" key={tab}>
              <TabButton name={tab as TabName} />
            </li>
          ))}
        </ul>
 
        <div className="pt-4">
          {activeTab === 'General' && <div>
            <General activeTab={activeTab} />
            </div>}
          {activeTab === 'Shipping Address' && <div> 
            <General activeTab={activeTab} />
            </div>}
          {activeTab === 'Purchase History' && <div>
            <PurchaseHistory products={products}/>
            </div>}
            {activeTab === 'Notification' && <div>
              <Notification />
            </div>}
            {activeTab === 'Set Limit' && <div>
              <SetLimit products={products}/>
            </div>}
            {activeTab === 'Setting' && <div>
              <General activeTab={activeTab} />
            </div>} 
        </div>
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
