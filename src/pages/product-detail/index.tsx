import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin'; 
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils'; 
import ProductDetail from './detail'; 
import PageHeading from '@/components/common/page-heading';
import { useRouter } from 'next/router';
import CartCounterButton from '@/components/cart/cart-counter-button';
import { useUI } from '@/contexts/ui.context';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Cart from '@/components/cart/cart';
import Drawer from '@/components/ui/drawer';

export default function RefundsPage() { 
  const router = useRouter();
  const { item } = router.query;
  //@ts-ignore
  const parsedItem = item ? JSON.parse(item) : null;
  const { displayCartSidebar, closeCartSidebar } = useUI();
  
  const { t } = useTranslation(); 
  const productImages = [
    parsedItem?.image?.original,
    parsedItem?.image?.original,
    parsedItem?.image?.original,
    parsedItem?.image?.original,
    parsedItem?.image?.original,
    ];

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <PageHeading title={t('Products Detail')} />
        </div> 
      </Card>
    {/* Mobile cart Drawer */}
    <CartCounterButton />
      
      <Drawer
        open={displayCartSidebar}
        onClose={closeCartSidebar}
        variant="right"
      >
        <DrawerWrapper hideTopBar={true}>
          <Cart />
        </DrawerWrapper>
      </Drawer>
      <ProductDetail
      images={productImages}
      //@ts-ignore
      ProductData={parsedItem}
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
