// import { useAtom } from 'jotai';
// import { customerAtom } from '@/contexts/checkout';
// import { useModalAction } from '@/components/ui/modal/modal.context';
// import { PlusIcon } from '@/components/icons/plus-icon';
// import { useTranslation } from 'next-i18next';
// import { API_ENDPOINTS } from '@/data/client/api-endpoints';
// import { QueryClient } from 'react-query';
// import { userClient } from '@/data/client/user';
// import { useEffect } from 'react';

// interface CustomerProps {
//   label: string;
//   count?: number;
//   className?: string;
//   employeeId?:any;
// }

// const CustomerGrid = ({ label, count, className ,employeeId}: CustomerProps) => {
//   const [customer] = useAtom(customerAtom);
//   const [selectedCustomer, setCustomer] = useAtom(customerAtom);
//   const { openModal } = useModalAction();
//   const { t } = useTranslation('common');
// console.log("customer",customer);


// function onCustomerUpdate(employeeId: any) {
//   console.log("onCustomerUpdate",employeeId);
  
//   setCustomer(customer);
// }
// async function fetchAsyncOptions(inputValue: string) {
//   const queryClient = new QueryClient();
//   const data = await queryClient.fetchQuery(
//     [API_ENDPOINTS.USERS, { text: inputValue, page: 1 }],
//     () => userClient.fetchUsers({ name: inputValue, page: 1 }),
//   );
//   console.log('data?.data?', data);
//   return data?.data?.map((user: any) => ({
//     value: user.id,
//     label: user.name,
//   }));
// }

// useEffect(() => {
//   //@ts-ignore
//   onCustomerUpdate(employeeId)

// }, [])

//   function onAddOrChange() {
//     openModal('SELECT_CUSTOMER');
//   }
//   return (
//     <div className={className}>
//       <div className="mb-2 flex items-center justify-between">
//         <div className="space-s-3 md:space-s-4 flex items-center w-[200px]">
//           {count && (
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-base text-light lg:text-xl">
//               {count}
//             </span>
//           )}
//           <p className="text-md capitalize text-heading font-bold">{label}</p>
//         </div>
//         <div className="grid grid-cols-1 gap-4 w-[200px]">
//         {/* {customer?.value ? (
//           <div className="group relative shadow-sm hover:border-accent">
//             <p className="text-sm font-semibold capitalize text-heading">
//               {customer.label}
//             </p>
//           </div>
//         ) : (
//           <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
//             {t('text-no-customer')}
//           </span>
//         )} */}
//       </div>
//         <button
//           className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
//           onClick={onAddOrChange}
//         >
//           <PlusIcon className="me-0.5 h-4 w-4 stroke-2" />
//           {customer?.value ? t('text-update') : t('text-add')}
//         </button>
//       </div>

   
//     </div>
//   );
// };

// export default CustomerGrid;

import { useAtom } from 'jotai';
import { customerAtom } from '@/contexts/checkout';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { PlusIcon } from '@/components/icons/plus-icon';
import { useTranslation } from 'next-i18next';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { QueryClient } from 'react-query';
import { userClient } from '@/data/client/user';
import { useEffect } from 'react';

interface CustomerProps {
  label: string;
  count?: number;
  className?: string;
  employeeId?: any;
}

const CustomerGrid = ({ label, count, className, employeeId }: CustomerProps) => {
  const [customer, setCustomer] = useAtom(customerAtom);
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');


  // Fetch options and find the customer matching the employeeId
  async function fetchAsyncOptions(inputValue: string) {
    const queryClient = new QueryClient();
    const data = await queryClient.fetchQuery(
      [API_ENDPOINTS.USERS, { text: inputValue, page: 1 }],
      () => userClient.fetchUsers({ name: inputValue, page: 1 })
    );
    return data?.data?.map((user: any) => ({
      value: user.id,
      label: user.name,
    }));
  }

  // Match and update customer by employeeId
  async function onCustomerUpdate(employeeId: any) {

    try {
      const options = await fetchAsyncOptions('');
      const matchedCustomer = options.find((user: any) => user.value === employeeId);

      if (matchedCustomer) {
        setCustomer(matchedCustomer);
      } else {
        console.log('No matching customer found for employeeId:', employeeId);
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  }

  useEffect(() => {
    if (employeeId) {
      onCustomerUpdate(employeeId);
    }
  }, [employeeId]); // Re-run when employeeId changes

  function onAddOrChange() {
    openModal('SELECT_CUSTOMER');
  }

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <div className="space-s-3 md:space-s-4 flex items-center w-[200px]">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-md capitalize text-heading font-bold">{label}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 w-[200px]">
          {customer?.value ? (
            <div className="group relative shadow-sm hover:border-accent">
              <p className="text-sm font-semibold capitalize text-heading">
                {customer.label}
              </p>
            </div>
          ) : (
            <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
              {t('text-no-customer')}
            </span>
          )}
        </div>
        {/* <button
          className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
          onClick={onAddOrChange}
        >
          <PlusIcon className="me-0.5 h-4 w-4 stroke-2" />
          {customer?.value ? t('text-update') : t('text-add')}
        </button> */}
      </div>
    </div>
  );
};

export default CustomerGrid;

