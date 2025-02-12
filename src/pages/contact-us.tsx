import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import ShopList from '@/components/shop/shop-list';
import { useEffect, useMemo, useState } from 'react';
import Search from '@/components/common/search';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
} from '@/utils/auth-utils';
import { useInActiveShopsQuery, useShopsQuery } from '@/data/shop';
import { SortOrder } from '@/types';
import PageHeading from '@/components/common/page-heading';
import EmployeesList from '@/components/shop/employees-list';
import Image from 'next/image';
import filter from '@/assets/placeholders/filter.svg';
import link from '@/assets/placeholders/link.svg';
import LinkButton from '@/components/ui/link-button';
import { Routes } from '@/config/routes';
import EmployeeForm from '@/components/shop/employees-form';
import Button from '@/components/ui/button';
import { getFromLocalStorage } from '@/utils/localStorageUtils';
import {
  useDeleeteAllEmployeeMutation,
  useEmployeeQuery,
  useEmployeesQuery,
} from '@/data/employee';
import { useRouter } from 'next/router';
import EmployeesFilter from '@/components/shop/employee-filter';
import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useSettingsQuery } from '@/data/settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import { useQueryClient } from 'react-query';
import { useMeQuery } from '@/data/user';

type FormValues = {
  name: string;
  cretaed_by?: string;
  Employee_status?: boolean;
  company_name?: string;
  company_status?: boolean;
  shop_id?: number;
};
export default function ContactPage() {
  const { t } = useTranslation();
  
  //@ts-ignore
  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="px-4 w-full">
          {/* {/ Header Section /} */}
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-semibold w-1/4">Contact-Us</h2>
          </div>
        </div>
      </Card>
    </>
  );
}
ContactPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
ContactPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
