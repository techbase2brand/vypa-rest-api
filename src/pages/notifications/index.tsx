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
import NotificationList from '@/components/notifications/notifications-list';
import { useNotificationsQuery } from '@/data/notification';

export default function Notifications() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);

  // const { uniforms, loading, paginatorInfo, error } = useUniformsQuery({
  //   language: locale,
  //   limit: 20,
  //   page,
  //   code: searchTerm,
  //   orderBy,
  //   sortedBy,
  // });


  const { notifications, loading, paginatorInfo, error } = useNotificationsQuery({
    //@ts-ignore
    language: locale,
    limit: 20,
    page,
    search: searchTerm,
    orderBy,
    sortedBy,
  });

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }
  const handleClick = () => {
    router.push('/notifications/create'); // This should match the route path you want to navigate to
  };
  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/3">
          <PageHeading title="Notifications Lists" />
        </div>
        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
          <Search onSearch={handleSearch} placeholderText="Search..." />
        </div>
        <Button
          onClick={handleClick}
          className="bg-black text-white px-4 py-2 rounded text-sm ml-10"
        >
          Add Notification +
        </Button>
      </Card>
      {/* @ts-ignore */}
      <NotificationList
      //@ts-ignore
        notifications={notifications}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
        //@ts-ignore
      />
    </>
  );
}

Notifications.authenticate = {
  permissions: adminOnly,
};

Notifications.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
