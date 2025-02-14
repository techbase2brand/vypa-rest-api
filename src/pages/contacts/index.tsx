import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import UniformsList from '@/components/uniforms/uniforms-list';
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
import { useEffect, useState } from 'react';
import {
  useCreateUniformMutation,
  useUniformQuery,
  useUniformsQuery,
  useUpdateUnifromMutation,
} from '@/data/uniforms';
import { useEmployeeQuery } from '@/data/employee';
import ContactsList from '@/components/contacts/contacts-list';

export default function Contacts() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  const { uniforms, loading, paginatorInfo, error } = useUniformsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
  });
  console.log('uniforms', uniforms);

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
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/3">
          <PageHeading title="Contacts Lists" />
        </div>
        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
          <Search onSearch={handleSearch} placeholderText="Search..." />
        </div>
      </Card>
      {/* @ts-ignore */}
      <ContactsList
        coupons={uniforms}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        //@ts-ignore
      />
    </>
  );
}

Contacts.authenticate = {
  permissions: adminOnly,
};

Contacts.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
