import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useEffect, useState } from 'react';
import Search from '@/components/common/search';
import { adminAndOwnerOnly, adminOnly } from '@/utils/auth-utils';
import { useInActiveShopsQuery, useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import EmployeesList from '@/components/shop/employees-list';
import Image from 'next/image';
import filter from '@/assets/placeholders/filter.svg';
import link from '@/assets/placeholders/link.svg';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import EmployeeForm from '@/components/shop/employees-form';
import Button from '@/components/ui/button';
import { getFromLocalStorage } from '@/utils/localStorageUtils';
import { useEmployeeQuery, useEmployeesQuery } from '@/data/employee';
import { useRouter } from 'next/router';

export default function Employee() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { employee, paginatorInfo, loading, error } = useEmployeesQuery({
    name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    // is_active: false,
  });
  console.log('employeesss data', employee);

  const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for editing

  useEffect(() => {
    const retrievedData = getFromLocalStorage();
    setData(retrievedData);
    //  const clearAllLocalStorage = () => {
    //   localStorage.clear();
    //   console.log('All data cleared from local storage.');
    // };
    // clearAllLocalStorage()
  }, []);

  const openOffcanvas = (employee = null) => {
    setSelectedEmployee(employee); // If editing, set the employee to edit
    setIsOffcanvasOpen(true);
  };
  // const openOffcanvas = () => setIsOffcanvasOpen(true);
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
  const handleClick = () => {
    router.push('/employee/create'); // This should match the route path you want to navigate to
  };

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
            <h2 className="text-xl font-semibold w-1/4">Employee List</h2>
            {/* <div className="flex  flex-col items-center   ms-auto md:w-1/4 md:flex-row">
              <Search onSearch={handleSearch} placeholderText={'Search'} />
            </div> */}
            <div className="flex items-center gap-4 w-full">
              <button
                onClick={toggleFilters}
                style={{ maxWidth: '100px' }}
                className="px-4 py-2 pr-4 h-12 gap-2 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              >
                Filters
                <Image src={filter} alt={'filter'} width={16} height={16} />
              </button>
              <div className="">
                <select
                  className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                  style={{ width: '150px' }}
                >
                  <option>Last 30 days</option>
                  <option>Last 15 days</option>
                  <option>Last 7 days</option>
                </select>
              </div>
              <Button
                onClick={toggleFilters}
                className="px-4 py-2 h-12 flex gap-3 items-center bg-transprint hover:bg-white rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              >
                Generate Link
                <Image src={link} alt={'filter'} width={18} height={18} />
              </Button>
              {showDiv && (
                <>
                  <select className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option selected>Select...</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                  <Button className="bg-red-500 text-white text-sm ">
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 19.4 22.169"
                      fill="currentColor"
                      width="14"
                    >
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.4"
                      >
                        <path
                          data-name="Rectangle 2"
                          d="M8.238.7h2.923a2 2 0 012 2v.769h0-6.923 0V2.7a2 2 0 012-2z"
                        ></path>
                        <path data-name="Line 1" d="M.7 3.469h18"></path>
                        <path
                          data-name="Path 77"
                          d="M14.649 21.469h-9.9a1.385 1.385 0 01-1.38-1.279L2.085 3.469h15.231L16.029 20.19a1.385 1.385 0 01-1.38 1.279z"
                        ></path>
                        <path data-name="Line 2" d="M7.623 6.238V18.7"></path>
                        <path data-name="Line 3" d="M11.777 6.238V18.7"></path>
                      </g>
                    </svg>
                    Delete
                  </Button>
                </>
              )}

              <Button
                // onClick={() => openOffcanvas()}
                onClick={handleClick}
                className="bg-black text-white px-4 py-2 rounded text-sm "
              >
                Add Employee +
              </Button>
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
                  <h2 className="text-xl font-semibold">
                    {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h2>
                  <p>
                    {selectedEmployee
                      ? 'Edit the employee details here'
                      : 'Add your necessary information from here'}
                  </p>
                </div>

                <button
                  onClick={closeOffcanvas}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              {/* @ts-ignore */}
              <EmployeeForm
                employee={selectedEmployee}
                //@ts-ignore

                closeOffcanvas={closeOffcanvas}
                setData={setData}
              />
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
                <Button className="bg-black text-white rounded">
                  Apply Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
      <EmployeesList
        // @ts-ignore
        data={employee}
        setData={setData}
        setShowDiv={setShowDiv}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        openOffcanvas={openOffcanvas}
      />
    </>
  );
}
Employee.authenticate = {
  permissions: adminAndOwnerOnly,
};
Employee.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
