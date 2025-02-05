import { RadioGroup } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import CashOnDelivery from '@/components/checkout/payment/cash-on-delivery';
import { useAtom } from 'jotai';
import { paymentGatewayAtom, PaymentMethodName } from '@/contexts/checkout';
import cn from 'classnames';
import CashPayment from './cash';
import remove from '@/assets/placeholders/delete.svg';
import Payment from '@/assets/placeholders/payment.svg';
import Image from 'next/image';
import Link from 'next/link';

interface PaymentMethodInformation {
  name: string;
  value: PaymentMethodName;
  icon: string;
  component: React.FunctionComponent;
}

// Payment Methods Mapping Object

const AVAILABLE_PAYMENT_METHODS_MAP: Record<
  PaymentMethodName,
  PaymentMethodInformation
> = {
  CASH: {
    name: 'common:payment-cash',
    value: 'CASH',
    icon: '',
    component: CashPayment,
  },
  CASH_ON_DELIVERY: {
    name: 'common:text-cash-on-delivery',
    value: 'CASH_ON_DELIVERY',
    icon: '',
    component: CashOnDelivery,
  },
};

const PaymentGrid: React.FC<{ className?: string }> = ({ className }) => {
  const [gateway, setGateway] = useAtom<PaymentMethodName>(paymentGatewayAtom);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t } = useTranslation('common');
  const PaymentMethod = AVAILABLE_PAYMENT_METHODS_MAP[gateway];
  const Component = PaymentMethod?.component ?? CashOnDelivery;
  return (
    <div className={className}>
      {errorMessage ? (
        <Alert
          message={t(`common:${errorMessage}`)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}

      {/* <RadioGroup value={gateway} onChange={setGateway}>
        <RadioGroup.Label className="mb-5 block text-base font-semibold text-heading">
          {t('text-choose-payment')}
        </RadioGroup.Label>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {Object.values(AVAILABLE_PAYMENT_METHODS_MAP).map(
            ({ name, icon, value }) => (
              <RadioGroup.Option value={value} key={value}>
                {({ checked }) => (
                  <div
                    className={cn(
                      'relative flex h-full w-full cursor-pointer items-center justify-center rounded border py-3 text-center',
                      checked
                        ? 'shadow-600 border-accent bg-light'
                        : 'border-gray-200 bg-light'
                    )}
                  >
                    {icon ? (
                      <>
                        <img src={icon} alt={t(name)} className="h-[30px]" />
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-heading">
                        {t(name)}
                      </span>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            )
          )}
        </div>
      </RadioGroup> */}


      <div className="payment-method"> 
        <div className="flex gap-10">
        <div className='flex gap-3 items-center'>
      <input className="accent-green" id='Credit' name='payment' type="radio" value='card' checked />
      <label htmlFor="Credit" className='text-sm'> Credit Card </label> 
      </div>
      <div className='flex gap-3 items-center'>
      <input className="accent-green" id='Purchase' name='payment' value='order' type="radio"   />
      <label htmlFor="Purchase" className='text-sm'>Purchase Order</label> 
      </div>
      <div className='flex gap-3 items-center'>
      <input className="accent-green" id='Quotation' name='payment' value='Quotation' type="radio"   />
      <label htmlFor="Quotation" className='text-sm'>Quotation</label> 
      </div>
      </div>
      <div className="card-listing border-t border-b border-gray-500 pb-3 mb-3 pt-3 mt-3">
        <p className='text-xs mt-1 mb-3'>Pay securely using your credit card.</p>
        <div className="flex gap-4 items-center">
      <input className="accent-green" id='bank' name='bank' value='bank' type="radio"   />
      <label htmlFor="bank"> 
      <svg width="24" height="24" viewBox="0 0 39 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M36.0605 0.408203H3.17976C1.62028 0.408203 0.351562 1.67692 0.351562 3.2364V23.6497C0.351562 25.2092 1.62028 26.4779 3.17976 26.4779H36.0606C37.62 26.4779 38.8887 25.2092 38.8887 23.6497V3.2364C38.8887 1.67692 37.62 0.408203 36.0605 0.408203ZM37.229 23.6497C37.229 24.294 36.7048 24.8183 36.0605 24.8183H3.17976C2.53546 24.8183 2.01122 24.2941 2.01122 23.6497V3.2364C2.01122 2.5921 2.53539 2.06786 3.17976 2.06786H36.0605C36.7048 2.06786 37.229 2.59203 37.229 3.2364V23.6497Z" fill="black"/>
      <path d="M8.59146 17.3789H4.77124C4.31285 17.3789 3.94141 17.7504 3.94141 18.2087C3.94141 18.667 4.31293 19.0386 4.77124 19.0386H8.59146C9.04984 19.0386 9.42129 18.667 9.42129 18.2087C9.42129 17.7504 9.04977 17.3789 8.59146 17.3789Z" fill="black"/>
      <path d="M16.0251 17.3789H12.2048C11.7464 17.3789 11.375 17.7504 11.375 18.2087C11.375 18.667 11.7465 19.0386 12.2048 19.0386H16.0251C16.4834 19.0386 16.8549 18.667 16.8549 18.2087C16.8549 17.7504 16.4834 17.3789 16.0251 17.3789Z" fill="black"/>
      <path d="M23.4626 17.3789H19.6423C19.1839 17.3789 18.8125 17.7504 18.8125 18.2087C18.8125 18.667 19.184 19.0386 19.6423 19.0386H23.4626C23.9209 19.0386 24.2924 18.667 24.2924 18.2087C24.2924 17.7504 23.9209 17.3789 23.4626 17.3789Z" fill="black"/>
      <path d="M30.8961 17.3789H27.0759C26.6175 17.3789 26.2461 17.7504 26.2461 18.2087C26.2461 18.667 26.6176 19.0386 27.0759 19.0386H30.8961C31.3544 19.0386 31.726 18.667 31.726 18.2087C31.726 17.7504 31.3545 17.3789 30.8961 17.3789Z" fill="black"/>
      <path d="M18.4094 21.0625H4.77124C4.31285 21.0625 3.94141 21.434 3.94141 21.8923C3.94141 22.3506 4.31293 22.7222 4.77124 22.7222H18.4094C18.8678 22.7222 19.2392 22.3506 19.2392 21.8923C19.2392 21.434 18.8678 21.0625 18.4094 21.0625Z" fill="black"/>
      <path d="M9.74253 8.20703H4.77124C4.31285 8.20703 3.94141 8.57855 3.94141 9.03686V12.6311C3.94141 13.0895 4.31293 13.461 4.77124 13.461H9.74253C10.2009 13.461 10.5724 13.0894 10.5724 12.6311V9.03686C10.5724 8.57848 10.2008 8.20703 9.74253 8.20703ZM8.9127 11.8013H5.60106V9.86669H8.91263L8.9127 11.8013Z" fill="black"/>
      <path d="M34.4729 5.27148H25.4626C25.0043 5.27148 24.6328 5.64301 24.6328 6.10131C24.6328 6.55962 25.0043 6.93114 25.4626 6.93114H34.4729C34.9311 6.93114 35.3027 6.55962 35.3027 6.10131C35.3027 5.64301 34.9313 5.27148 34.4729 5.27148Z" fill="black"/>
      </svg>
      </label> 
          <div className='mr-10'>
            <p>Bank of Queensland</p>
            <p className='text-xs text-gray-400'>43** **** **** 4333</p>
          </div>
          <Link href="#">
          <Image src={remove} alt='delete' />
          </Link>
      </div>
      </div>
      <div className="payment-form mt-4 w-[50%]">
      <div className="w-full mb-2 relative">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            Card Number
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="1234  1234  1234  1234"/>
          <Image src={Payment} alt='delete' className='absolute' style={{ width: '90px', right: '7px', top: '36px'}} />
          </div>
          <div className="w-full mb-2">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            Card Name
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="card name"/>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <div className="w-full mb-2">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            Expiration
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="date" placeholder=" "/>
          </div>
          
          <div className="w-full mb-2">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            CVC
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="CVC "/>
          </div>
          </div>
          <div className="w-full mb-2">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            Country
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="country"/>
          </div>
          <div className="w-full">
            <label className="block  tracking-wide text-gray-700 text-xs font-bold mb-2">
            PO Number (Optional)
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder="1234  1234  1234  1234"/>
          </div>
          <div className="flex gap-3 items-center justify-end mt-4 mb-3">
        <button className="bg-transprint text-sm text-black p-2 pl-4 pr-4 border border-black rounded">Cancel</button>
        <button className="bg-black text-sm text-white p-2 pl-4 pr-4 border border-black rounded">Add New Payment</button>
      </div>
      </div>
      </div>
      <div>
        <Component />
      </div>
    </div>
  );
};

export default PaymentGrid;
