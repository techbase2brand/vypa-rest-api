import OwnerLayout from '@/components/layouts/owner';
import CompanySetup from '@/components/shop/company-setup';
import Button from '@/components/ui/button';
import { adminAndOwnerOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateShopPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex justify-between pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading">
          {t('Company Setup')}
        </h1>
        <div className='flex gap-3'>
        <Button className='border text-black px-4 py-2 rounded bg-white hover:bg-transprint'>Cancel</Button>
        <Button className='text-white px-4 py-2 rounded bg-black hover:bg-black'>Save & Update</Button>
        </div>
      </div>
      <CompanySetup />
    </>
  );
}
CreateShopPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
CreateShopPage.Layout = OwnerLayout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});
