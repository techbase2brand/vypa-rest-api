import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import AttributeList from '@/components/attribute/attribute-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { useState } from 'react';
import { adminOnly } from '@/utils/auth-utils';
import Search from '@/components/common/search';
import { useRouter } from 'next/router';
import { useAttributesQuery } from '@/data/attributes';
import PageHeading from '@/components/common/page-heading';
import Button from '@/components/ui/button';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';

export default function AttributePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const { attributes, loading, error } = useAttributesQuery({
    orderBy,
    sortedBy,
    language: locale,
    name: searchTerm,
  });

  const handleClick = () => {
    router.push('/attributes/create');
  };

  const handleExportOrder = async () => {
    console.log('Export.....');
  };

  const handleSearch = ({ searchText }: { searchText: string }) => {
    setSearchTerm(searchText);
  };

  // 6. Loading and error states
  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  // 7. Render
  return (
    <>
      <Card className="mb-8">
        <div className="md:w-1/4">
          <PageHeading title={t('common:sidebar-nav-item-attributes')} />
        </div>

        <div className="flex mb-8 mt-5 justify-between">
          <div className="flex gap-6">
            <button
              onClick={handleExportOrder}
              className={classNames(
                'flex w-full items-center border border-black space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                'text-body',
              )}
            >
              <DownloadIcon className="w-5 shrink-0" />
              <span className="whitespace-nowrap">{t('Export')}</span>
            </button>
            <button
              onClick={handleExportOrder}
              className={classNames(
                'flex w-full items-center border border-black space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                'text-body',
              )}
            >
              <DownloadIcon className="w-5 shrink-0" />
              <span className="whitespace-nowrap">{t('Import')}</span>
            </button>
          </div>
          <Button
            onClick={handleClick}
            className="bg-black text-white px-4 py-2 rounded text-sm"
          >
            Add Attribute +
          </Button>
        </div>

        <div>
          <Search
            onSearch={handleSearch}
            placeholderText={t('search by attributes')}
          />
        </div>
      </Card>
      <AttributeList
        attributes={attributes}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

AttributePage.authenticate = {
  permissions: adminOnly,
};

AttributePage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
