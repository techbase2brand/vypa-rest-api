import Layout from '@/components/layouts/admin';
import CreateOrUpdateRefundPolicyForm from '@/components/refund-policy/refund-policy-form';
import CreateOrUpdateRefundReasonForm from '@/components/refund-reason/refund-reason-form';
import { adminOnly } from '@/utils/auth-utils';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function CreateRefundPolicyPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className=" justify-center border-b border-dashed border-border-base pb-5 md:pb-7">
        <h1 className="text-lg font-semibold text-heading  text-center">
          {t('Return Management Authorization')}
        </h1>
        <p className='text-center'>Online RMA Form</p>
        <h1 className="text-md font-semibold text-heading">
          {t('Need an item return')}
        </h1>
        <p className='text-sm'>Fill out this form to the best of your knowledge. Please see our <a className='text-blue-500 mr-1'>return policy</a>return policy before completing form</p>
      </div>
      <CreateOrUpdateRefundReasonForm />
    </>
  );
}
CreateRefundPolicyPage.authenticate = {
  permissions: adminOnly,
};
CreateRefundPolicyPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['form', 'common'])),
  },
});
