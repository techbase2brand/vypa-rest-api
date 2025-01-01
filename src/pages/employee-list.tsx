import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useState } from 'react';
import Search from '@/components/common/search';
import { adminOnly } from '@/utils/auth-utils';
import { useInActiveShopsQuery, useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import EmployeesList from '@/components/shop/employees-list';
import Image from 'next/image';
import filter from '@/assets/placeholders/filter.svg';
import link from '@/assets/placeholders/link.svg';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import EmployeeForm from '@/components/shop/employee-form';
import Button from '@/components/ui/button';

export default function NewShopPage() {
  const { t } = useTranslation();
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
  const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);
  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the filter section visibility
  };
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        {/* <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-shops')} />
        </div>
        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <Search onSearch={handleSearch} />
        </div> */}
        <div className="px-4 w-full">
          {/* {/ Header Section /} */}
          <div className="flex justify-between items-center gap-4">
          <h2 className="text-xl font-semibold">Employee List</h2>
            <div className="flex  flex-col items-center   ms-auto md:w-1/4 md:flex-row">
              <Search onSearch={handleSearch} placeholderText={'Search'} />
            </div>
            <div className="flex gap-4">
              <button
                onClick={toggleFilters}
                className="flex border border-border-base text-black px-4 py-3 rounded-full items-center gap-2 justify-center "
              >
                Filters
                <Image src={filter} alt={'filter'} width={16} height={16} />
              </button>
              <div className="">
                <select className="border border-border-base rounded-full px-2 py-3" style={{width:'150px'}}>
                  <option>Last 30 days</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <button
                onClick={toggleFilters}
                className="flex border border-border-base text-black px-4 py-3 rounded-full items-center gap-2 justify-center "
              >
                Generate Link
                <Image src={link} alt={'filter'} width={18} height={18} />
              </button>

              <button
                onClick={openOffcanvas}
                className="bg-black text-white px-4 py-2 rounded-full "
              >
                Add Employee +
              </button>
            </div>
          </div>
          {/* Modal */}
          {/* Right Side Offcanvas Menu */}
          <div
            className={`fixed inset-0 z-50 flex justify-end transition-transform ${
              isOffcanvasOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Backdrop */}
            {/* <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeOffcanvas}
        ></div> */}

            {/* Offcanvas Content */}
            <div className="bg-white w-1/2 p-6 shadow-lg h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Add New Employee</h2>
                  <p>Add your necessary information from here</p>
                </div>

                <button
                  onClick={closeOffcanvas}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <EmployeeForm />
            </div>
          </div>

          {/* {/ Filters Section /} */}
          {/* Conditionally render Filters Section */}
          {showFilters && (
            <div className="border rounded p-4 shadow-sm mt-3">
              <div className="grid grid-cols-7 gap-4 items-center">
                {/* {/ Checkbox /} */}
                {/* <div>
                  <input type="checkbox" className="w-5 h-5" />
                  <label className="ml-2">All</label>
                </div> */}

                {/* {/ Approval /} */}
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Approval</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                </div>

                {/* {/ Created By /} */}
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Created by</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Staff</option>
                  </select>
                </div>

                {/* {/ Company Name /} */}
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Company name</option>
                    <option>ABC Corp</option>
                    <option>XYZ Enterprises</option>
                    <option>Acme Inc</option>
                  </select>
                </div>

                {/* {/ Company Status /} */}
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Company Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </div>

                {/* {/ State /} */}
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Region</option>
                    <option>New South Wales</option>
                    <option>Queensland</option>
                    <option>Western Australia</option>
                  </select>
                </div>
                {/* {/ Apply Filters Button /} */}
                <Button className="bg-black text-white   rounded">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      <EmployeesList
        shops={shops}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        // @ts-ignore
        openOffcanvas={openOffcanvas}
      />
    </>
  );
}
NewShopPage.authenticate = {
  permissions: adminOnly,
};
NewShopPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
