import Details from './detail';
import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import { useState } from 'react';
import { SortOrder, Type } from '@/types';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { adminOnly } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import PageHeading from '@/components/common/page-heading';
export default function Categories() {
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title='Order Detail' />
          </div> 
          <div className="flex gap-3 items-center">
        <button className="bg-transprint text-black p-2 pl-4 pr-4 border border-black rounded">Cancel</button>
        <button className="bg-black text-white p-2 pl-4 pr-4 border border-black rounded">Save & Update</button>
      </div>
        </div>
      </Card>
      {/* @ts-ignore */}
      <Details  
      />
    </>
  );
}

Categories.authenticate = {
  permissions: adminOnly,
};
Categories.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
