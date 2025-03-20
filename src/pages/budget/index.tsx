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
import { useEmployeeGroupsQuery } from '@/data/employee-group';
import { useCreateBudgetMutation } from '@/data/budget';
import UniformsList from '@/components/uniforms/uniforms-list';
import { useUniformsQuery } from '@/data/uniforms';
import { useAssignBudgetsQuery } from '@/data/assign-budget';

export default function Budget() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  // State for form inputs
  const [selectedGroups, setSelectedGroups] = useState<any[]>([]);
  const [budget, setBudget] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { uniforms, loading, paginatorInfo, error } = useUniformsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
  });
  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  // const handleSubmit = () => {
  //   console.log('Uniform name:');
  //   // Handle form submission here
  //   setShowPopup(false); // Close the popup after submitting
  // };

  // const { budgets, loading, paginatorInfo, error } = useAssignBudgetsQuery({
  //   //@ts-ignore
  //   language: locale,
  //   limit: 20,
  //   page,
  //   code: searchTerm,
  //   orderBy,
  //   sortedBy,
  // });

  // console.log("budgetsbudgetsbudgets",budgets);

  const { mutate: createBudget, isLoading: creating } =
    useCreateBudgetMutation();

  const { groups } = useEmployeeGroupsQuery({
    // language: locale,
    limit: 100,
    page,
    orderBy,
    sortedBy,
    name: searchTerm,
  });

  const handleSubmit = () => {
    const payload = {
      //@ts-ignore
      budget: parseFloat(budget), // Ensure budget is a number
      date: selectedDate,
      groups: selectedGroups.map((group: any) => group.id), // Include only the group IDs
    };
    createBudget(
      //@ts-ignore
      payload,
    );
    // You can handle form submission here, e.g., send the data to an API
    alert('Form submitted!');
    setSelectedGroups([]);
    //@ts-ignore
    setBudget('');
    setSelectedDate('');
  };

  // if (loading) return <Loader text={t('common:text-loading')} />;
  // if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }

  return (
    <>
      {/* <Card className="mb-8">
        <div className="flex flex-col items-center mb-4 md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <PageHeading title="Budget" />
          </div>
        </div>

        <div className="flex gap-4 border border-black-500 p-4 items-center justify-between w-full rounded">
          <div className="flex gap-4 w-1/1">
            <Multiselect
              placeholder="Select Employee"
              displayValue="name"
              onKeyPressFn={function noRefCheck() {}}
              onRemove={function noRefCheck() {}}
              onSearch={function noRefCheck() {}}
              onSelect={function noRefCheck() {}}
              options={groups}
              showCheckbox
            />
            <input
              type="number"
              className="ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              placeholder="$"
            />
            <input
              type="date"
              className="ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              placeholder="$"
            />
          </div>
          <div>
            <Button
              onClick={handlePopupToggle}
              className="bg-black text-sm text-white hover:bg-black-500"
            >
              Submit
            </Button>
          </div>
        </div>
      </Card> */}
      {/* </> */}
      <Card className="mb-8">
        <div className="flex flex-col items-center mb-4 md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <PageHeading title="Budget" />
          </div>
        </div>

        <div className="flex gap-4 border border-black-500 p-4 items-center justify-between w-full rounded">
          <div className="flex gap-4 w-full">
            {/* <div className='w-full'> 
          <label className="block text-sm font-medium text-gray-700 mb-2">
             Employee
              </label>
          <Multiselect
              placeholder="Select Employee"
              displayValue="name"
              onKeyPressFn={function noRefCheck() {}}
              onRemove={function noRefCheck() {}}
              onSearch={function noRefCheck() {}}
              onSelect={function noRefCheck() {}}
              options={groups}
              showCheckbox
            />
            </div> */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Groups')}
              </label>
              {/* Multiselect Input */}
              <Multiselect
                placeholder="Select Group"
                displayValue="name"
                onSelect={(selectedList) => setSelectedGroups(selectedList)}
                onRemove={(selectedList) => setSelectedGroups(selectedList)}
                options={groups || []}
                showCheckbox
              />
            </div>

            {/* Number Input */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Assign Budget')}
              </label>
              <input
                type="number"
                value={budget ?? ''}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                placeholder="Enter Budget ($)"
              />
            </div>
            {/* Date Input */}

            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('Budget Exprie date')}
              </label>
              <input
                type="date"
                value={selectedDate ?? ''}
                placeholder="Enter Budget ($)"
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ps-4 pe-4 h-12 flex items-center w-full xl:w-1/1 rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              />
            </div>
          </div>
          <div className="mt-7">
            <Button
              onClick={handleSubmit}
              className="bg-black text-sm text-white hover:bg-black-500"
            >
              Submit
            </Button>
          </div>
        </div>
      </Card>

      {/* @ts-ignore  */}
      <BudgetList
        coupons={uniforms}
        //@ts-ignore
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        //@ts-ignore
        // setUniFormId={setUniFormId}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
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
