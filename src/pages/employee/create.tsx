import AdminLayout from '@/components/layouts/admin';
import OwnerLayout from '@/components/layouts/owner';
import EmployeeForm from '@/components/shop/employees-form';
import { adminAndOwnerOnly, adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateEmployeePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('Create Employee')}
        </h1>
      </div>
       {/* @ts-ignore */}
      <EmployeeForm />
      {/* <ShopForm /> */}
    </>
  );
}
CreateEmployeePage.authenticate = {
  permissions: adminOnly,
};
CreateEmployeePage.Layout = AdminLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
