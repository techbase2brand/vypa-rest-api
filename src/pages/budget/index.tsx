import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import BudgetList from '@/components/budget/budget-list';
import Layout from '@/components/layouts/admin';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { useCouponsQuery } from '@/data/coupon';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Multiselect from 'multiselect-react-dropdown';


export default function Budget() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
 
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

 

  const handleSubmit = () => {
    console.log('Uniform name:');
    // Handle form submission here
    setShowPopup(false); // Close the popup after submitting
  };

  const { coupons, loading, paginatorInfo, error } = useCouponsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      <Card className="mb-8">
        <div className="flex flex-col items-center mb-4 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/3">
          <PageHeading title='Budget' />
        </div>

        <div className="flex gap-4 flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
       
          <Search
            onSearch={handleSearch}
            placeholderText='Search...'
          />  

          <input type="text" className='ps-4 pe-4 h-12 flex items-center w-full xl:w-1/2 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent' placeholder='Spand Balance' />
          <Button className='bg-black text-white hover:bg-green-500'>
            Filter</Button>
            <Button className='bg-transprint border border-black-500 text-black hover:bg-white-600'>
            <svg className="mr-1" fill="#000" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z"></path><path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"></path></svg>
            Reset</Button>
        </div>
        </div>
         

        <div className="flex gap-4 border border-black-500 p-4 items-center justify-between w-full rounded">
        <div className='flex gap-4 w-1/1'>
                 <Multiselect
                 placeholder='Select Employee'
          displayValue="key"
          onKeyPressFn={function noRefCheck(){}}
          onRemove={function noRefCheck(){}}
          onSearch={function noRefCheck(){}}
          onSelect={function noRefCheck(){}}
          options={[
            {
              cat: 'Group 1',
              key: 'John'
            },
            {
              cat: 'Group 2',
              key: 'Lily'
            },
            {
              cat: 'Group 3',
              key: 'Isla'
            }
          ]}
          showCheckbox
        /> 
       <input type="text" className='ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent' placeholder='Set Budget' />
       <select id="day" name="day" className='ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent'>
        <option value="" selected>Day</option>
        <option value="monday">Monday</option>
        <option value="tuesday">Tuesday</option>
        <option value="wednesday">Wednesday</option>
        <option value="thursday">Thursday</option>
        <option value="friday">Friday</option>
        <option value="saturday">Saturday</option>
        <option value="sunday">Sunday</option>
    </select>
    <select id="week" name="week" className='ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent'>
        <option value="" selected>Week</option>
        <option value="week1">Week 1</option>
        <option value="week2">Week 2</option>
        <option value="week3">Week 3</option>
        <option value="week4">Week 4</option>
    </select>
    <select id="month" name="month" className='ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent'>
        <option value="" selected>Month</option>
        <option value="january">January</option>
        <option value="february">February</option>
        <option value="march">March</option>
        <option value="april">April</option>
        <option value="may">May</option>
        <option value="june">June</option>
        <option value="july">July</option>
        <option value="august">August</option>
        <option value="september">September</option>
        <option value="october">October</option>
        <option value="november">November</option>
        <option value="december">December</option>
    </select>
      
       </div>
          <div>
       <Button onClick={handlePopupToggle} className='bg-black text-white hover:bg-green-500'>
         Submit</Button>
         </div>
     </div>
      </Card>
      <BudgetList
        coupons={coupons}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />

{showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3 text-center">

            <div className="flex justify-center relative">
            <svg width="65" height="65" viewBox="0 0 65 65" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M32.5 0C14.5631 0 0 14.5631 0 32.5C0 50.4369 14.5631 65 32.5 65C50.4369 65 65 50.4369 65 32.5C65 14.5631 50.4369 0 32.5 0ZM32.5 3.09524C48.7283 3.09524 61.9048 16.2717 61.9048 32.5C61.9048 48.7283 48.7283 61.9048 32.5 61.9048C16.2717 61.9048 3.09524 48.7283 3.09524 32.5C3.09524 16.2717 16.2717 3.09524 32.5 3.09524Z" fill="#E13232"/>
            <path d="M32.5015 51.0713C34.2109 51.0713 35.5967 49.6856 35.5967 47.9761C35.5967 46.2666 34.2109 44.8809 32.5015 44.8809C30.792 44.8809 29.4062 46.2666 29.4062 47.9761C29.4062 49.6856 30.792 51.0713 32.5015 51.0713Z" fill="#E13232"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.9531 17.0242V38.6908C30.9531 39.5451 31.6465 40.2385 32.5007 40.2385C33.355 40.2385 34.0484 39.5451 34.0484 38.6908V17.0242C34.0484 16.1699 33.355 15.4766 32.5007 15.4766C31.6465 15.4766 30.9531 16.1699 30.9531 17.0242Z" fill="#E13232"/>
            </svg>

            <a   onClick={handlePopupToggle} className='cursor-pointer' style={{position:'absolute', top:'-10px', right:'0px'}}>X</a>
            </div>
              <h2 className='text-center text-xl font-bold mb-4 mt-4'>Are you Sure?</h2>
            <label htmlFor="" className='flex justify-center text-body-dark font-semibold text-xl leading-none mb-4'>Do you really want to add $500.</label>
            
            <div className="flex gap-5 mt-5 justify-center">
            <Button
                onClick={handlePopupToggle}
                className="bg-transprint border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-white-600"
              >
                No
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Yes
              </Button>
           
            </div>
          </div>
        </div>
      )}

    </>
  );
}

Budget.authenticate = {
  permissions: adminOnly,
};

Budget.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
