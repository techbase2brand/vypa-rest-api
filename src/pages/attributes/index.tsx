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
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const { locale } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const { attributes, loading, error } = useAttributesQuery({
    orderBy,
    sortedBy,
    language: locale,
    name: searchTerm,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;
  const router = useRouter();
  const handleClick = () => {
    router.push('/attributes/create'); // This should match the route path you want to navigate to
  };

  async function handleExportOrder() {
    console.log('Export.....');
    // const { data } = await refetch();

    // if (data) {
    //   const a = document.createElement('a');
    //   a.href = data;
    //   a.setAttribute('download', 'export-order');
    //   a.click();
    // }
  }
  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }
  return (
    <>
      <Card className="mb-8  ">
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
          <div className="flex gap-6">
            {/* <Button className="bg-red-500 text-white text-sm ">
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 19.4 22.169"
                fill="currentColor"
                width="14"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.4"
                >
                  <path
                    data-name="Rectangle 2"
                    d="M8.238.7h2.923a2 2 0 012 2v.769h0-6.923 0V2.7a2 2 0 012-2z"
                  ></path>
                  <path data-name="Line 1" d="M.7 3.469h18"></path>
                  <path
                    data-name="Path 77"
                    d="M14.649 21.469h-9.9a1.385 1.385 0 01-1.38-1.279L2.085 3.469h15.231L16.029 20.19a1.385 1.385 0 01-1.38 1.279z"
                  ></path>
                  <path data-name="Line 2" d="M7.623 6.238V18.7"></path>
                  <path data-name="Line 3" d="M11.777 6.238V18.7"></path>
                </g>
              </svg>
              Delete
            </Button> */}
            <Button
              onClick={handleClick}
              className="bg-black text-white px-4 py-2 rounded text-sm "
            >
              Add Attribute +
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-10 items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/2">
          <Search
            onSearch={handleSearch}
            placeholderText={t('search by attributes')}
          />
          {/* <div className="flex gap-6">
            <Button
              onClick={handleClick}
              className="bg-black text-white px-4 py-2 rounded text-sm "
            >
              Filter
            </Button>
            <Button
              onClick={handleClick}
              className="bg-white text-black px-4 py-2 border border-black rounded text-sm "
            >
              Reset
            </Button>
          </div> */}
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
