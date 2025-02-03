import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import ProductDetail from '../product-detail/detail';
import PageHeading from '@/components/common/page-heading';
import { useRouter } from 'next/router';
import CartCounterButton from '@/components/cart/cart-counter-button';
import { useUI } from '@/contexts/ui.context';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import Cart from '@/components/cart/cart';
import Drawer from '@/components/ui/drawer';
import { useRefundReasonQuery } from '@/data/refund-reason';
import { Config } from '@/config';

export default function RefundsPage() {
  const router = useRouter();
  const { query, locale } = useRouter();
  const { slug } = router.query;
  console.log('queryquery', slug);
  const { refundReason, loading, error } = useRefundReasonQuery({
    slug: slug as string,
    language:
      query?.action!?.toString() === 'edit' ? locale! : Config.defaultLanguage,
  });
  console.log('refundReason', refundReason);

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/2">
          <PageHeading title={'Return Management Detail'} />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-lg">
        {/* Invoice Number */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">Invoice Number</h3>
          <p className="text-sm text-gray-600">#020323004</p>
        </div>

        {/* Order Date */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">Order Date</h3>
          <p className="text-sm text-gray-600">20/10/2024</p>
        </div>

        {/* Goods Issue */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">Goods Issue</h3>
          <p className="text-sm text-gray-600">Faulty</p>
        </div>

        {/* Invoicing Date */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">Invoicing Date</h3>
          <p className="text-sm text-gray-600">Price Adjustment</p>
        </div>

        {/* Item Codes and Quantity */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">
            Item Codes and Quantity
          </h3>
          <p className="text-sm text-gray-600">1 X GPC025</p>
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-black">Comments</h3>
          <p className="text-sm text-gray-600">
            Dummy text is text that is used in the publishing industry or by web
            designers to occupy the space
          </p>
        </div>
      </div>
      {/* <div>gkjndkf</div> */}
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
