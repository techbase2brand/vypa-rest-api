import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import InvoiceList from '@/components/invoice/invoice-list';
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

export default function Invoice() {
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
        <div className="flex flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <PageHeading title="Invoice" />
          </div>

          <div className="flex gap-4 flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
            {/* <div className='flex gap-2 items-center'>
            <input type="checkbox" name='all' id='all' />
            <label htmlFor="all">All</label>
          </div> */}
            <Search onSearch={handleSearch} placeholderText="Search..." />
            <select
              name=""
              id=""
              className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
            >
              <option>Last 30 Days</option>
              <option>Last 15 Days</option>
              <option>Last 7 Days</option>
            </select>
            {/* <Button className='bg-black text-white hover:bg-black-600'>
            Filter</Button>  */}
          </div>
        </div>
      </Card>
      <InvoiceList
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
              <svg
                width="65"
                height="65"
                viewBox="0 0 65 65"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M32.5 0C14.5631 0 0 14.5631 0 32.5C0 50.4369 14.5631 65 32.5 65C50.4369 65 65 50.4369 65 32.5C65 14.5631 50.4369 0 32.5 0ZM32.5 3.09524C48.7283 3.09524 61.9048 16.2717 61.9048 32.5C61.9048 48.7283 48.7283 61.9048 32.5 61.9048C16.2717 61.9048 3.09524 48.7283 3.09524 32.5C3.09524 16.2717 16.2717 3.09524 32.5 3.09524Z"
                  fill="#E13232"
                />
                <path
                  d="M32.5015 51.0713C34.2109 51.0713 35.5967 49.6856 35.5967 47.9761C35.5967 46.2666 34.2109 44.8809 32.5015 44.8809C30.792 44.8809 29.4062 46.2666 29.4062 47.9761C29.4062 49.6856 30.792 51.0713 32.5015 51.0713Z"
                  fill="#E13232"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M30.9531 17.0242V38.6908C30.9531 39.5451 31.6465 40.2385 32.5007 40.2385C33.355 40.2385 34.0484 39.5451 34.0484 38.6908V17.0242C34.0484 16.1699 33.355 15.4766 32.5007 15.4766C31.6465 15.4766 30.9531 16.1699 30.9531 17.0242Z"
                  fill="#E13232"
                />
              </svg>

              <a
                onClick={handlePopupToggle}
                className="cursor-pointer"
                style={{ position: 'absolute', top: '-10px', right: '0px' }}
              >
                X
              </a>
            </div>
            <h2 className="text-center text-xl font-bold mb-4 mt-4">
              Are you Sure?
            </h2>
            <label
              htmlFor=""
              className="flex justify-center text-body-dark font-semibold text-xl leading-none mb-4"
            >
              Do you really want to add $500.
            </label>

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

Invoice.authenticate = {
  permissions: adminOnly,
};

Invoice.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
