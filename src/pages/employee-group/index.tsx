import OwnerLayout from '@/components/layouts/owner';
import EmployeeGroupListing from '@/components/shop/employee-group-list';
import Button from '@/components/ui/button';
import { adminAndOwnerOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useOrdersQuery } from '@/data/order';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { SortOrder } from '@/types';
import EmployeeGroupForm from '@/components/shop/employee-group-form';
import { useEmployeeGroupsQuery } from '@/data/employee-group';
import { useMeQuery } from '@/data/user';

export default function EmployeeGroup() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);

  const { data: me } = useMeQuery();

  const { groups, loading, paginatorInfo, error } = useEmployeeGroupsQuery({
    // language: locale,
    limit: 20,
    page,
    orderBy,
    sortedBy,
    name: searchTerm,
    //@ts-ignore
    shop_id: me?.shops?.[0]?.id,
  });

  console.log("groups", groups, me);

  function handlePagination(current: any) {
    setPage(current);
  }
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);

  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);

  const handleNavigate = () => {
    router.push('/employee-group/create')
  }
  return (
    <>
      <div className="flex justify-between pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('Employee Group')}
        </h1>
        <div className="flex gap-3">
          <Button
            className="text-white px-4 py-2 rounded bg-black hover:bg-black"
            onClick={handleNavigate}
          >
            Add Group +
          </Button>
        </div>
      </div>
      <EmployeeGroupListing
        // @ts-ignore
        orders={groups}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
      {isOffcanvasOpen && (
        <div
          className={`fixed inset-0 z-50 flex justify-end transition-transform ${isOffcanvasOpen ? 'translate-x-0' : 'translate-x-full'
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
                <h2 className="text-xl font-semibold">Add Group</h2>
                <p>Add your necessary information from here</p>
              </div>

              <button
                onClick={closeOffcanvas}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>
            <EmployeeGroupForm />
          </div>
        </div>
      )}
    </>
  );
}
EmployeeGroup.authenticate = {
  permissions: adminAndOwnerOnly,
};
EmployeeGroup.Layout = OwnerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
