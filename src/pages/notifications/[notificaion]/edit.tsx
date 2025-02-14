import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopForm from '@/components/shop/shop-form';
import ShopLayout from '@/components/layouts/shop';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import { useShopQuery } from '@/data/shop';
import { Routes } from '@/config/routes';
import { useMeQuery } from '@/data/user';
import AdminLayout from '@/components/layouts/admin';
import EmployeesForm from '@/components/shop/employees-form';
import { useEmployeeQuery } from '@/data/employee';

export default function UpdateEmployeePage() {
  const router = useRouter();
  const { permissions } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { query } = useRouter();
  const { employee } = query;
  const { t } = useTranslation();
  console.log('query', query);

  const {
    data,
    isLoading: loading,
    error,
  } = useEmployeeQuery({
    // @ts-ignore
    slug: employee as string,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  // if (
  //   !hasAccess(adminOnly, permissions) &&
  //   !me?.shops?.map((shop) => shop.id).includes(data?.id) &&
  //   me?.managed_shop?.id != data?.id
  // ) {
  //   router.replace(Routes.dashboard);
  // }
  return (
    <>
      <div className="flex py-5 border-b border-dashed border-border-base sm:py-8">
        <h1 className="text-lg font-semibold text-heading">
          {t('Edit Notification')}
        </h1>
      </div>
      {/* @ts-ignore */}
      <NotificationForm initialValues={data} />
    </>
  );
}
UpdateEmployeePage.authenticate = {
  permissions: adminAndOwnerOnly,
};
UpdateEmployeePage.Layout = AdminLayout;

export const getServerSideProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common'])),
  },
});
