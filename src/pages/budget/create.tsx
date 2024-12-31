import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import UniformsData from '@/components/uniforms/uniforms-data';
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

export default function Uniforms() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1); 
 
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
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title='NSW Rail Shirts' />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
        <div className='mr-3 flex items-center gap-2'>
        <input type="checkbox" id="all" name="all" value="all" />
        <label htmlFor="all"> All</label>
        </div>
          <Search
            onSearch={handleSearch}
            placeholderText='Search...'
          />
 
            <Button  
              className="h-12 md:w-auto ml-4 bg-black rounded mr-4"
            >
              <span>+ Update Cart</span>
            </Button> 
            <Button  
              className="h-12 md:w-auto bg-black rounded mr-4"
            >
              <span> Reset Qty</span>
            </Button> 
          <Button className='bg-red-500 text-white'>
          <svg className='mr-2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.4 22.169" fill="currentColor" width="14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"><path data-name="Rectangle 2" d="M8.238.7h2.923a2 2 0 012 2v.769h0-6.923 0V2.7a2 2 0 012-2z"></path><path data-name="Line 1" d="M.7 3.469h18"></path><path data-name="Path 77" d="M14.649 21.469h-9.9a1.385 1.385 0 01-1.38-1.279L2.085 3.469h15.231L16.029 20.19a1.385 1.385 0 01-1.38 1.279z"></path><path data-name="Line 2" d="M7.623 6.238V18.7"></path><path data-name="Line 3" d="M11.777 6.238V18.7"></path></g></svg>
            Delete</Button>
        </div>
      </Card>
      <UniformsData
        coupons={coupons}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />

 

    </>
  );
}

Uniforms.authenticate = {
  permissions: adminOnly,
};

Uniforms.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
