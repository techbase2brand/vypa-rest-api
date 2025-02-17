import Card from '@/components/common/card';
// import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useState } from 'react';
import Search from '@/components/common/search';
import { adminOnly } from '@/utils/auth-utils';
import { useDeleeteAllShopMutation, useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';
import { Routes } from '@/config/routes';
import LinkButton from '@/components/ui/link-button';
import Image from 'next/image';
import filter from '@/assets/placeholders/filter.svg';
import Button from '@/components/ui/button';
import AdminLayout from '@/components/layouts/admin';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useDeleeteAllEmployeeMutation } from '@/data/employee';

type FormValues = {
  name: string;
  cretaed_by?: string;
  Employee_status?: boolean;
  company_name?: string;
  company_status?: boolean;
  shop_id?: number;
};
export default function AllShopPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [filters, setFilters] = useState<Partial<FormValues>>({});
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility
  const [showDiv, setShowDiv] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [dateFilter, setDateFilter] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);



  const { register, handleSubmit, getValues, watch, setValue, control, reset } =
    useForm<FormValues>({
      shouldUnregister: true,
    });
  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    //@ts-ignore
    name: filters.name || '',
    //@ts-ignore
    cretaed_by: filters.cretaed_by || '',
    Employee_status: filters.Employee_status,
    company_name: filters.company_name,
    company_status: filters.company_status ,
    // shop_id: filters.shop_id,
    // name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    refreshKey,
    days: dateFilter || 30,
  });
  const { mutate: deleteAllShop } = useDeleeteAllShopMutation();

  const toggleFilters = () => {
    setShowFilters(!showFilters); // Toggle the filter section visibility
  };
  function handleDateFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDateFilter(event.target.value);
  }
  const { settings, loading: loadingSettings } = useSettingsQuery({
    language: locale!,
  });
  if (loading || loadingSettings)
    return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }
  const router = useRouter();
  const handleClick = () => {
    router.push('/company/create'); // This should match the route path you want to navigate to
  };

  function onFilterSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);

    // Ensure Employee_status and company_status are numbers (if they are valid number strings)
    const updatedValues = {
      ...values,
      // shop_id: selectedCompanyId, // Add the selected shop_id to the query
    };

    // Convert Employee_status to a number if it's a valid number string (including "0")
    if (
      updatedValues.Employee_status &&
      !isNaN(Number(updatedValues.Employee_status))
    ) {
      //@ts-ignore
      updatedValues.Employee_status = Number(updatedValues.Employee_status);
    }

    // Convert company_status to a number if it's a valid number string (including "0")
    //@ts-ignore

    if (
      updatedValues.company_status &&
      //@ts-ignore
      updatedValues.company_status !== '' &&
      !isNaN(Number(updatedValues.company_status))
    ) {
      //@ts-ignore

      updatedValues.company_status = Number(updatedValues.company_status);
    }

    // Remove keys with empty or default values
    const filteredValues = Object.fromEntries(
      Object.entries(updatedValues).filter(([key, value]) => {
        return (
          value !== '' &&
          value !== 'Employee Status' &&
          value !== 'Created by' &&
          value !== 'Company Status'
        );
      }),
    );

    setFilters({ ...filteredValues });

    console.log('Filtered Values:', filteredValues);

    // Now use filteredValues in your query
  }

  const handleDeleteAllEmployeeData = () => {
    console.log('Deleting handleDeleteAllEmployeeData with IDs:', selectedRows);
    //@ts-ignore
    deleteAllShop(selectedRows, {
      onSuccess: () => {
        console.log('Employees deleted successfully');
        //@ts-ignore
        setRefreshKey((prev) => prev + 1); // Increment the key to refresh the query
      },
      //@ts-ignore
      onError: (error) => {
        console.error('Error deleting employees:', error);
      },
    });
  };

  return (
    <>
      <Card className="mb-4 flex flex-col items-center justify-between md:flex-row">
        {/* <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-shops')} />
        </div>

        <div className="flex w-full flex-col items-center ms-auto md:w-1/2 md:flex-row">
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
          />
        </div> */}
        <div className="px-4 w-full">
          {/* {/ Header Section /} */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Company List</h2>
            <div className="flex gap-4 items-center">
              <button
                onClick={toggleFilters}
                className=" flex text-black px-5 py-2 h-12 border border-border-base rounded items-center gap-2 justify-center "
              >
                Filters
                <Image src={filter} alt={'filter'} width={18} height={18} />
              </button>
              <select
                className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                style={{ width: '150px' }}
                onChange={handleDateFilterChange}
              >
                <option value="">Filter By Date</option>
                <option value="30">Last 30 days</option>
                <option value="15">Last 15 days</option>
                <option value="7">Last 7 days</option>
              </select>
              {showDiv && (
                <>
                  {/* <select className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option selected>Select...</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select> */}
                  <Button
                    onClick={handleDeleteAllEmployeeData}
                    className="bg-red-500 text-white text-sm "
                  >
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
              {/* <LinkButton
                href={Routes.shop.create}
                size="small"
                className="px-4 py-5 bg-black hover:bg-black"
              >
                {t('Add Company +')}
              </LinkButton> */}
              <Button
                onClick={handleClick}
                className="bg-black text-white px-4 py-2 rounded text-sm "
              >
                Add Company +
              </Button>
            </div>
          </div>

          {/* {/ Filters Section /} */}
          {/* Conditionally render Filters Section */}

          {showFilters && (
            // @ts-ignore
            // <EmployeesFilter/>
            <>
              <form onSubmit={handleSubmit(onFilterSubmit)} noValidate>
                <div className="border rounded p-4 shadow-sm mt-3">
                  <div className="grid grid-cols-7 gap-4 items-center">
                    {/* {/ Created By /} */}
                    {/* <div>
                      <select
                        {...register('cretaed_by')}
                        className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                      >
                        <option>Created by</option>
                        <option value={'admin'}>Admin</option>
                        <option value={'company'}>Company</option>
                      </select>
                    </div> */}

                    {/* {/ Company Status /} */}
                    <div>
                      <select
                        {...register('company_status')}
                        className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                      >
                        <option>Company Status</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>

                    {/* {/ State /} */}
                    <div>
                      <Input
                        {...register('name')}
                        variant="outline"
                        className="mb-3"
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                        <option>State</option>
                        <option>Victoria</option>
                        <option>New South Wales</option>
                        <option>Queensland</option>
                        <option>Western Australia</option>
                      </select>
                    </div>
                    <div>
                      <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                        <option>Approval</option>
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div>
                      <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                        <option>Created by</option>
                        <option>Admin</option>
                        <option>Manager</option>
                        <option>Staff</option>
                      </select>
                    </div>
                    {/* {/ Apply Filters Button /} */}
                    <Button className="bg-black text-white rounded">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </form>
            </>
          )}
          {/* {showFilters && (
            <div
              className="rounded p-4 shadow-sm mt-4"
              style={{ border: '1px solid #C1C1C1' }}
            >
              <div className="grid grid-cols-6 gap-6 items-center">
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Approval</option>
                    <option>Approved</option>
                    <option>Pending</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Created by</option>
                    <option>Admin</option>
                    <option>Manager</option>
                    <option>Staff</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Company name"
                    className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                  />
                </div>

                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Company Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                    <option>Suspended</option>
                  </select>
                </div>

                <div>
                  <select className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option>Victoria</option>
                    <option>New South Wales</option>
                    <option>Queensland</option>
                    <option>Western Australia</option>
                  </select>
                </div>
                <Button className="bg-black text-white px-4 py-2 rounded text-sm ">
                  Apply Filters
                </Button>
              </div>
            </div>
          )} */}
        </div>
      </Card>
      <ShopList
        shops={shops}
        // @ts-ignore
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        setShowDiv={setShowDiv}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        setRefreshKey={setRefreshKey}
        isMultiCommissionRate={Boolean(
          settings?.options?.isMultiCommissionRate,
        )}
      />
    </>
  );
}
AllShopPage.authenticate = {
  permissions: adminOnly,
};
AllShopPage.Layout = AdminLayout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});

// export default function CompanyList() {
//   return (
//     <div className="p-4">
//       {/* {/ Header Section /} */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold">Company List</h2>
//         <div>
//           <button className="bg-black text-white px-4 py-2 rounded">Add Company +</button>
//         </div>
//       </div>

//       {/* {/ Filters Section /} */}
//       <div className="border rounded p-4 shadow-sm">
//         <div className="grid grid-cols-6 gap-4 items-center">
//           {/* {/ Checkbox /} */}
//           <div>
//             <input type="checkbox" className="w-5 h-5" />
//             <label className="ml-2">All</label>
//           </div>

//           {/* {/ Approval /} */}
//           <div>
//             <select className="w-full border rounded px-2 py-1">
//               <option>Approval</option>
//               <option>Approved</option>
//               <option>Pending</option>
//               <option>Rejected</option>
//             </select>
//           </div>

//           {/* {/ Created By /} */}
//           <div>
//             <select className="w-full border rounded px-2 py-1">
//               <option>Created by</option>
//               <option>Admin</option>
//               <option>Manager</option>
//               <option>Staff</option>
//             </select>
//           </div>

//           {/* {/ Company Name /} */}
//           <div>
//             <select className="w-full border rounded px-2 py-1">
//               <option>Company name</option>
//               <option>ABC Corp</option>
//               <option>XYZ Enterprises</option>
//               <option>Acme Inc</option>
//             </select>
//           </div>

//           {/* {/ Company Status /} */}
//           <div>
//             <select className="w-full border rounded px-2 py-1">
//               <option>Company Status</option>
//               <option>Active</option>
//               <option>Inactive</option>
//               <option>Suspended</option>
//             </select>
//           </div>

//           {/* {/ State /} */}
//           <div>
//             <select className="w-full border rounded px-2 py-1">
//               <option>Victoria</option>
//               <option>New South Wales</option>
//               <option>Queensland</option>
//               <option>Western Australia</option>
//             </select>
//           </div>
//         </div>

//         {/* {/ Apply Filters Button /} */}
//         <div className="mt-4 text-right">
//           <button className="bg-black text-white px-4 py-2 rounded">Apply Filters</button>
//         </div>
//       </div>
//     </div>
//   );
// }
