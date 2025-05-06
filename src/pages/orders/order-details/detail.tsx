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
import Product from './detailTab';
import FinancialTab from './financialTab';
import ShippingTab from './shippingTab';
import AddressTab from './addressTab';
import ShipmentTab from './shipmentsTab';
import PaymentsTab from './paymentsTabs';
import TotalTab from './totalTabs';
import Link from 'next/link';
import Logo from '../../../assets/placeholders/avatar.svg'
import Image from 'next/image';
import { forwardRef, useImperativeHandle, useRef } from 'react';

type TabName = 'details' | 'financial' | 'shipping' | 'address' | "shipment" | "payment" | "total";
const products = [
  {
    inventoryId: 'VP120185',
    description: 'BIZ COLLECTION P9901LS LADIES SONAR POLO GREY BLACK SIZE 8',
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
    inventoryId: 'VP120186',
    description: 'BIZ COLLECTION P9901LS LADIES SONAR POLO GREY BLACK SIZE 12',
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

const Categories = forwardRef(({ order }: { order: any }, ref) => {
  const detailsRef = useRef<any>({});

  const [activeTab, setActiveTab] = useState<TabName>('details');

  const TabButton = ({ name }: { name: TabName }) => (
    <button
      className={`inline-block py-1 px-4 text-black font-semibold ${activeTab === name ? 'text-white bg-black border-b-2 border-black-700 rounded-tl rounded-tr' : 'text-black-500 hover:text-black-700'}`}
      onClick={() => setActiveTab(name)}
    >
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </button>
  );


  const createdAt = order?.created_at;
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("en-GB");


  useImperativeHandle(ref, () => ({
    getDetailsData: () => {
      return {
        orderType: detailsRef.current?.orderType ? detailsRef.current?.orderType : order?.payment_status,
        customer: detailsRef.current?.customer ? detailsRef.current?.customer : order?.customer_name,
        street_address: detailsRef.current?.street_address ? detailsRef.current?.street_address : order?.billing_address?.street_address,
      };
    },
  }));

  return (
    <>
      <div className="container mx-auto mt-4">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex items-start gap-4">
          <div className='w-[80%]'>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Order Type
                </label>
                <input
                  defaultValue={order?.payment_status}
                  onChange={(e) => {
                    detailsRef.current.orderType = e.target.value;
                  }}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="order-type"
                  type="text"
                  placeholder="SO" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Customer
                </label>
                <input
                  defaultValue={order?.customer_name}
                  onChange={(e) => {
                    detailsRef.current.customer = e.target.value;
                  }}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="customer"
                  type="text"
                  placeholder="Olivia" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Ordered Oty
                </label>
                <input
                  defaultValue={order?.products?.length}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="OrderQantity"
                  type="text"
                  placeholder="1.00" />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Order Number
                </label>
                <input
                  defaultValue={order?.tracking_number}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="order-type"
                  type="text"
                  placeholder="002293" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Location
                </label>
                <input
                  value={`${order?.billing_address?.street_address || ''}`}
                  onChange={(e) => {
                    detailsRef.current.street_address = e.target.value;
                  }}
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="customer"
                  type="text"
                  placeholder="RBYTEMAIN - Primary Location"
                  readOnly
                />
              </div>

              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Discount Total
                </label>
                <input value={order?.discount} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="0.00" />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Status
                </label>
                <input value={order?.order_status} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Open" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Contact
                </label>
                <input value={order?.customer_contact} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="9898987766" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  GST Exempt Total
                </label>
                <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="0.00" />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Date
                </label>
                <input value={formattedDate} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" placeholder=" " />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Currency
                </label>
                <div className="flex gap-2">
                  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="AUD" />
                  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="1.00" />
                  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="VIEW BASE" />
                </div>
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  GST Taxable Total
                </label>
                <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="0.00" />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Requested On
                </label>
                <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="25/06/2024" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Description
                </label>
                <textarea
                  className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  defaultValue={order?.note || ''}
                />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Tax Total
                </label>
                <input value={`$ ${order?.sales_tax || ""}`} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="0.00" />
              </div>
            </div>
            <div className="-mx-3 md:flex mb-6">
              <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Customer Order
                </label>
                <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="N75" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  External Refer
                </label>
                <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="N75" />
              </div>
              <div className="md:w-1/2 px-3">
                <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Order Total
                </label>
                <input value={`$ ${order?.total || ""}`} className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="1.00" />
              </div>
            </div>
          </div>
          {/* <div className='w-[225px] pl-8 relative'>
          <label htmlFor="">Uploaded logo</label>
          <img src='https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg' className='w-[200px] h-[200px] mt-4 rounded-full object-cover' alt='logo' />
          <Link href='#' className='absolute' style={{right:'2px', bottom:'30px'}}>
           <img src="https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/download-round-icon.png" className='w-[30px] bg-gray-200 rounded-full' alt="" />
          </Link>
        </div> */}
          {/* Additional form fields and structure as per your screenshot */}
        </div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <ul className="flex border-b">
            <li className="-mb-px mr-1">
              <TabButton name="details" />
            </li>
            <li className="mr-1">
              <TabButton name="financial" />
            </li>
            <li className="mr-1">
              <TabButton name="shipping" />
            </li>
            <li className="mr-1">
              <TabButton name="address" />
            </li>
            <li className="mr-1">
              <TabButton name="shipment" />
            </li>
            <li className="mr-1">
              <TabButton name="payment" />
            </li>
            <li className="mr-1">
              <TabButton name="total" />
            </li>
          </ul>
          <div className="pt-4">
            {activeTab === 'details' && <div>
              <Product products={order?.products} />
            </div>}
            {activeTab === 'financial' && <div>
              <FinancialTab />
            </div>}
            {activeTab === 'shipping' && <div>
              <ShippingTab />
            </div>}
            {activeTab === 'address' && <div>
              <AddressTab />
            </div>}
            {activeTab === 'shipment' && <div>
              <ShipmentTab products={products} />
            </div>}
            {activeTab === 'payment' && <div>
              <PaymentsTab products={products} />
            </div>}
            {activeTab === 'total' && <div>
              <TotalTab products={products} />
            </div>}
          </div>
        </div>
      </div>
    </>
  )
});

export default Categories;

Categories.authenticate = {
  permissions: adminOnly,
};
Categories.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});


