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
import { useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import { useRouter } from 'next/router';
import { useSettingsQuery } from '@/data/settings';

export default function AllShopPage() {
  const { t } = useTranslation();
  const { locale } = useRouter();
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
  });
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Company List</h2>
            <div className="flex gap-10  w-50%">
              <div className="">
                <select className="border rounded-full px-2  w-200">
                  <option>last 30 days</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>
              <button className="bg-black text-white px-4 py-2 rounded-full ">
                Add Company +
              </button>
            </div>
          </div>

          {/* {/ Filters Section /} */}
          <div className="border rounded p-4 shadow-sm">
            <div className="grid grid-cols-7 gap-4 items-center">
              {/* {/ Checkbox /} */}
              <div>
                <input type="checkbox" className="w-5 h-5" />
                <label className="ml-2">All</label>
              </div>

              {/* {/ Approval /} */}
              <div>
                <select className="w-full border rounded px-2 py-1">
                  <option>Approval</option>
                  <option>Approved</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>

              {/* {/ Created By /} */}
              <div>
                <select className="w-full border rounded px-2 py-1">
                  <option>Created by</option>
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Staff</option>
                </select>
              </div>

              {/* {/ Company Name /} */}
              <div>
                <select className="w-full border rounded px-2 py-1">
                  <option>Company name</option>
                  <option>ABC Corp</option>
                  <option>XYZ Enterprises</option>
                  <option>Acme Inc</option>
                </select>
              </div>

              {/* {/ Company Status /} */}
              <div>
                <select className="w-full border rounded px-2 py-1">
                  <option>Company Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </div>

              {/* {/ State /} */}
              <div>
                <select className="w-full border rounded px-2 py-1">
                  <option>Victoria</option>
                  <option>New South Wales</option>
                  <option>Queensland</option>
                  <option>Western Australia</option>
                </select>
              </div>
              {/* {/ Apply Filters Button /} */}
              <button className="bg-black text-white px-4 py-2 rounded">
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </Card>
      <ShopList
        shops={shops}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
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
AllShopPage.Layout = Layout;

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
