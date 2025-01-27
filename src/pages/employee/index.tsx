import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useEffect, useMemo, useState } from 'react';
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
import { useDeleeteAllEmployeeMutation, useEmployeeQuery, useEmployeesQuery } from '@/data/employee';
import { useRouter } from 'next/router';
import EmployeesFilter from '@/components/shop/employee-filter';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useSettingsQuery } from '@/data/settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';

type FormValues = {
  name: string;
  cretaed_by?: string;
  Employee_status?: boolean;
  company_name?: string;
  company_status?: boolean;
  shop_id?: number;
};
export default function Employee() {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [filters, setFilters] = useState<Partial<FormValues>>({});
  const [showFilters, setShowFilters] = useState(false); // State to toggle filter visibility
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null); // Store selected employee for editing
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  console.log('selectedRowsselectedRowsselectedRowsselectedRows', selectedRows);


  //@ts-ignore
  const { employee, paginatorInfo, loading, error } = useEmployeesQuery({
    //@ts-ignore
    name: filters.name || '',
    //@ts-ignore
    cretaed_by: filters.cretaed_by || '',
    Employee_status: filters.Employee_status,
    company_name: filters.company_name,
    company_status: filters.company_status,
    shop_id: filters.shop_id,
    // name: searchTerm,
    limit: 10,
    page,
    orderBy,
    sortedBy,
    // is_active: false,
  });
  const { mutate: deleteAllShop } = useDeleeteAllEmployeeMutation();
  const { register, handleSubmit, getValues, watch, setValue, control, reset } =
    useForm<FormValues>({
      shouldUnregister: true,
    });
  //@ts-ignore
  const { shops } = useShopsQuery({
    name: searchTerm,
    limit: 100,
    page,
    orderBy,
    sortedBy,
  });
  console.log('companyemp', shops);
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const shopDescriptionSuggestionLists = useMemo(() => {
    return ShopDescriptionSuggestion({ name: generateName ?? '' });
  }, [generateName]);
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
  //@ts-ignore
  const handleChange = (event) => {
    const selectedOption = shops.find(
      //@ts-ignore
      (option) => option.name === event.target.value,
    );
    //@ts-ignore
    setSelectedCompanyId(selectedOption?.id || null);
  };
  const handleClick = () => {
    router.push('/employee/create'); // This should match the route path you want to navigate to
  };

  function onFilterSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);

    // Ensure Employee_status and company_status are numbers (if they are valid number strings)
    const updatedValues = {
      ...values,
      shop_id: selectedCompanyId, // Add the selected shop_id to the query
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
    console.log('handleUpdateCompanyDataidd',selectedRows);
    //@ts-ignore
    deleteAllShop(selectedRows);
  };
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="px-4 w-full">
          {/* {/ Header Section /} */}
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-semibold w-1/4">Employee List</h2>

            <div className="flex items-center gap-4 w-full">
              <button
                onClick={toggleFilters}
                style={{ maxWidth: '100px' }}
                className="px-4 py-2 pr-4 h-12 gap-2 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              >
                Filters
                <Image src={filter} alt={'filter'} width={16} height={16} />
              </button>
              {/* <div className="">
                <select
                  className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                  style={{ width: '150px' }}
                >
                  <option>Last 30 days</option>
                  <option>Last 15 days</option>
                  <option>Last 7 days</option>
                </select>
              </div> */}
              {/* <Button
                onClick={toggleFilters}
                className="px-4 py-2 h-12 flex gap-3 items-center bg-transprint hover:bg-white rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              >
                Generate Link
                <Image src={link} alt={'filter'} width={18} height={18} />
              </Button> */}
              {showDiv && (
                <>
                  {/* <select className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
                    <option selected>Select...</option>
                    <option>Active</option>
                    <option>Inactive</option>
                  </select> */}
                  <Button onClick={handleDeleteAllEmployeeData} className="bg-red-500 text-white text-sm ">
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
                onClick={handleClick}
                className="bg-black text-white px-4 py-2 rounded text-sm "
              >
                Add Employee +
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
                    <div>
                      <select
                        {...register('Employee_status')}
                        className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                      >
                        <option>Employee Status</option>
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>
                    {/* {/ Created By /} */}
                    <div>
                      <select
                        {...register('cretaed_by')}
                        className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                      >
                        <option>Created by</option>
                        <option value={'admin'}>Admin</option>
                        <option value={'company'}>Company</option>
                      </select>
                    </div>
                    {/* {/ Company Name /} */}
                    <div>
                      <select
                        // {...register('company_name')}
                        onChange={handleChange}
                        className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                      >
                        <option value=" ">{t('Company Name')}</option>
                        {shops?.map((option) => (
                          <option key={option.id} value={option.name}>
                            {t(option.name)}
                          </option>
                        ))}
                      </select>
                    </div>

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
                        placeholder="Employee Name"
                      />
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
        </div>
      </Card>
      <EmployeesList
        // @ts-ignore
        data={employee}
        setData={setData}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
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
