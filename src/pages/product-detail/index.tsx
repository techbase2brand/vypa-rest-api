import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin'; 
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils'; 
import ProductDetail from './detail'; 
import PageHeading from '@/components/common/page-heading';

export default function RefundsPage() { 
  const { t } = useTranslation(); 
  const productImages = [
    'https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=e21b31e3bddc474a0a13b376d367e2ce',
    'https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1=1260',
    'https://images.unsplash.com/photo-1519302959554-a75be0afc82a?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjE0NTg5fQ&s=e21b31e3bddc474a0a13b376d367e2ce',
    'https://images.pexels.com/photos/1539225/pexels-photo-1539225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1=1260',
    'https://images.pexels.com/photos/3511104/pexels-photo-3511104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1=1260'
  ];

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <PageHeading title={t('Products Detail')} />
        </div> 
      </Card>

      <ProductDetail
      images={productImages}
      
      />
    </>
  );
}
RefundsPage.authenticate = {
  permissions: adminOnly,
};
RefundsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
