import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminAndOwnerOnly } from '@/utils/auth-utils';
import ContactForm from '@/components/shop/contact-from';
import PageHeading from '@/components/common/page-heading';
import { useMeQuery } from '@/data/user';
import Image from 'next/image';
import vypa_map from '@/assets/placeholders/vypa-map.webp';
import CompanySettingForm from '@/components/shop/company-setting-form';

export default function CompanySettingPage() {
  const { t } = useTranslation();
  const { data: me } = useMeQuery();

  return (
    <>
      <Card className="mb-8">
        {/* {/ Header Section /} */}
        <div className="md:w-1/4">
          <PageHeading title={t('Comapny-Setting')} />
        </div>
      </Card>
      {/* @ts-ignore */}
      <div className="flex gap-10 w-full">
        <div className="w-1/2">
          <CompanySettingForm  />
        </div>
      </div>
    </>
  );
}
CompanySettingPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
CompanySettingPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
