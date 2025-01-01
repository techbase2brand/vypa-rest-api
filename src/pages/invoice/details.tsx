import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import InvoiceDetails from '@/components/invoice/details';
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

export default function Details() {
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
        <div className="mb-4 md:mb-0 flex justify-between items-center w-full">
          <PageHeading title='Invoice History Detail' />
          <Button className='bg-transprint border-black-500 hover:bg-green-500' title='Download'>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="current" xmlns="http://www.w3.org/2000/svg">
<path d="M16.4699 8.61719V5.61719H8.46988V8.61719H7.46988V4.61719H17.4699V8.61719H16.4699ZM18.0849 12.1172C18.3682 12.1172 18.6059 12.0212 18.7979 11.8292C18.9899 11.6372 19.0855 11.3999 19.0849 11.1172C19.0842 10.8345 18.9885 10.5969 18.7979 10.4042C18.6072 10.2115 18.3695 10.1155 18.0849 10.1162C17.8002 10.1169 17.5629 10.2129 17.3729 10.4042C17.1829 10.5955 17.0869 10.8332 17.0849 11.1172C17.0829 11.4012 17.1789 11.6385 17.3729 11.8292C17.5669 12.0199 17.8035 12.1159 18.0849 12.1172ZM16.4699 19.0012V14.4632H8.46988V19.0012H16.4699ZM17.4699 20.0012H7.46988V16.0012H4.04688V10.6172C4.04688 10.0505 4.23921 9.57552 4.62387 9.19219C5.00854 8.80885 5.48288 8.61685 6.04688 8.61619H18.8929C19.4595 8.61619 19.9345 8.80819 20.3179 9.19219C20.7012 9.57619 20.8929 10.0509 20.8929 10.6162V16.0012H17.4699V20.0012ZM19.8929 15.0012V10.6172C19.8929 10.3339 19.7972 10.0962 19.6059 9.90419C19.4145 9.71219 19.1769 9.61619 18.8929 9.61619H6.04688C5.76354 9.61619 5.52621 9.71219 5.33487 9.90419C5.14354 10.0962 5.04754 10.3339 5.04688 10.6172V15.0012H7.46988V13.4632H17.4699V15.0012H19.8929Z" fill="current"/>
</svg>
</Button>
        </div>
 
      </Card>
      <InvoiceDetails
        coupons={coupons}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />

 

    </>
  );
}

Details.authenticate = {
  permissions: adminOnly,
};

Details.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
