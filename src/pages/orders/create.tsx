import Cart from '@/components/cart/cart';
import CartCounterButton from '@/components/cart/cart-counter-button';
import Card from '@/components/common/card';
import Search from '@/components/common/search';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import Layout from '@/components/layouts/admin';
import ProductCard from '@/components/product/card';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import Drawer from '@/components/ui/drawer';
import DrawerWrapper from '@/components/ui/drawer-wrapper';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import NotFound from '@/components/ui/not-found';
import Pagination from '@/components/ui/pagination';
import { useUI } from '@/contexts/ui.context';
import { useProductsQuery } from '@/data/product';
import { Category, Product, ProductStatus, Type } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import FilterAccordion from './filter';
import Button from '@/components/ui/button';

export default function ProductsPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const { displayCartSidebar, closeCartSidebar } = useUI();
  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  const { products, loading, paginatorInfo, error } = useProductsQuery({
    limit: 18,
    language: locale,
    status: ProductStatus.Publish,
    name: searchTerm,
    page,
    type,
    categories: category,
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  // const { products } = data;
  return (
    <>
      <Card className="mb-2 flex flex-col">
        <div className="flex w-full flex-col justify-between items-center md:flex-row">
          <div className="mb-4 md:mb-0">
            <PageHeading title={t('form:input-label-create-order')} />
          </div>
          <div className="relative inline-block text-left">
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">NSW Rail Shirts</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select> 
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">VIC Rail Clothing</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select> 
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">General Workwear</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select> 
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">Fire Retardant</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select> 
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">Work Boots</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select> 
            <select name="" id="" className="filter_plp">
              <option value="">Select option</option>
              <option value="">PPE - Workplace Safety</option>
              <option value="">NSW Rail Jumpers</option>
              <option value="">NSW Rail Vests</option>
              <option value="">NSW Rail Jackets</option>
              <option value="">NSW Rail Coveralls</option> 
            </select>
        </div>

          {/* <div className="flex w-full flex-col items-center ms-auto md:w-2/4">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div> */}

          {/* <button
            className="mt-5 flex items-center whitespace-nowrap text-base font-semibold text-accent md:mt-0 md:ms-5"
            onClick={toggleVisible}
          >
            {t('common:text-filter')}{' '}
            {visible ? (
              <ArrowUp className="ms-2" />
            ) : (
              <ArrowDown className="ms-2" />
            )}
          </button> */}
        </div>

        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="mt-5 flex w-full flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
            <CategoryTypeFilter
              type={type}
              onCategoryFilter={(category: Category) => {
                setCategory(category?.slug!);
                setPage(1);
              }}
              onTypeFilter={(type: Type) => {
                setType(type?.slug!);
                setPage(1);
              }}
              className="w-full"
              enableCategory
              enableType
            />
          </div>
        </div>
      </Card>

      {/* <Card> */}
      <div className="flex space-x-5" style={{alignItems:'flex-start'}}> 
      <div className="w-80 mx-auto space-y-4 bg-white">
      <FilterAccordion title="Brand">
        <label className="block"><input type="checkbox" className="mr-2" />Brand 1</label>
        <label className="block"><input type="checkbox" className="mr-2" />Brand 2</label>
        <label className="block"><input type="checkbox" className="mr-2" />Brand 3</label>
      </FilterAccordion>
      
      <FilterAccordion title="Size">
        <label className="block"><input type="checkbox" className="mr-2" />Small</label>
        <label className="block"><input type="checkbox" className="mr-2" />Medium</label>
        <label className="block"><input type="checkbox" className="mr-2" />Large</label>
      </FilterAccordion>

      <FilterAccordion title="Color">
        <label className="block"><input type="checkbox" className="mr-2" /> 
        Red</label>
        <label className="block"><input type="checkbox" className="mr-2" />Blue</label>
        <label className="block"><input type="checkbox" className="mr-2" />Green</label>
      </FilterAccordion>

      <FilterAccordion title="Gender">
        <label className="block"><input type="checkbox" className="mr-2" />Men</label>
        <label className="block"><input type="checkbox" className="mr-2" />Women</label>
        <label className="block"><input type="checkbox" className="mr-2" />Unisex</label>
      </FilterAccordion>

      <FilterAccordion title="Price">
        <input type="range" min="0" max="100" className="w-full" onChange={(e) => console.log(`Price: ${e.target.value}`)} />
        <div className="flex justify-between text-sm">
          <span>$0</span>
          <span>$100</span>
        </div>
      </FilterAccordion>
      <div className="flex justify-between gap-2 pl-3 pr-3 pb-3">
      <Button className='bg-transprent border border-black-600 text-black hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8'>Clear</Button>
      <Button className='bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8'>Apply</Button>
      </div>
    </div> 
        <div className="flex">
          <div className='mb-3'>
          <h2 className='font-bold text-xl'>NSW Rail Clothing</h2>
          <p className='text-sm mb-3'>From Australia Fastest Rail Compliant Workwear Supplier. NSW Rail Compliant Workwear: NSW Rail Shirts</p>
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6">

          {products?.map((product: Product) => (
            <ProductCard key={product.id} item={product} />
          ))}
          </div>
          </div>
        </div>
      </div>
      {!products?.length ? (
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      ) : null}
      <div className="mt-8 flex w-full justify-center">
        {!!paginatorInfo?.total && (
          <div className="flex items-center justify-end">
            <Pagination
              total={paginatorInfo.total}
              current={paginatorInfo.currentPage}
              pageSize={paginatorInfo.perPage}
              onChange={handlePagination}
              showLessItems
            />
          </div>
        )}
      </div>
      {/* <div className="w-[440px] flex-shrink-0 bg-white">
          <Cart />
        </div> */}
      {/* </div> */}

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
    </>
  );
}
ProductsPage.authenticate = {
  permissions: adminOnly,
};
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
