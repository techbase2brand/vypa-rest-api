import Card from '@/components/common/card';
import Search from '@/components/common/search';
import { ArrowDown } from '@/components/icons/arrow-down';
import { ArrowUp } from '@/components/icons/arrow-up';
import Layout from '@/components/layouts/admin';
import CategoryTypeFilter from '@/components/filters/category-type-filter';
import ProductList from '@/components/product/product-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useProductsQuery } from '@/data/product';
import { Category, ProductType, SortOrder, Type } from '@/types';
import { adminAndOwnerOnly, adminOnly } from '@/utils/auth-utils';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import Button from '@/components/ui/button'; 
import AddProduct from '@/components/shop/add-procuct';


interface ProductTypeOptions {
  name: string;
  slug: string;
}

export default function ProductsPage() {
  const [showDiv, setShowDiv] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [productType, setProductType] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const { locale } = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [visible, setVisible] = useState(true);
  const [isOffcanvasOpen, setIsOffcanvasOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
console.log("refreshKey",refreshKey);

  const router = useRouter();
  const openOffcanvas = () => setIsOffcanvasOpen(true);
  const closeOffcanvas = () => setIsOffcanvasOpen(false);

  const toggleVisible = () => {
    setVisible((v) => !v);
  };

  const { products, loading, paginatorInfo, error } = useProductsQuery({
    language: locale,
    limit: 20,
    page,
    type,
    categories: category,
    product_type: productType,
    name: searchTerm,
    orderBy,
    sortedBy,
    // @ts-ignore
    refreshKey
  });

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }
  console.log("productsproducts",products);
  
  const Addproduct = () => {
    // Navigate to the specified URL
    router.push('/products/create');
  };
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <div className="flex w-full flex-col items-center md:flex-row">
          <div className="mb-4 md:mb-0 md:w-1/4">
            <PageHeading title={t('form:input-label-products')} />
          </div>

       

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
        <div className="flex w-full justify-between flex-col items-center mt-4 md:flex-row">
          <div className='flex gap-3'>
          <Button className='bg-transprint text-sm  border border-gray-600 text-black hover:bg-transprint-700 flex gap-2 items-center'>
          <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.752855 6.63728V12.6091C0.776644 13.2464 1.0517 13.8484 1.51793 14.2835C1.98416 14.7187 2.60367 14.9516 3.2411 14.9314H16.5118C17.1492 14.9516 17.7687 14.7187 18.2349 14.2835C18.7012 13.8484 18.9762 13.2464 19 12.6091V6.63728C19 6.4173 18.9126 6.20634 18.7571 6.05079C18.6015 5.89525 18.3906 5.80786 18.1706 5.80786C17.9506 5.80786 17.7396 5.89525 17.5841 6.05079C17.4286 6.20634 17.3412 6.4173 17.3412 6.63728V12.6091C17.3142 12.8049 17.2132 12.9829 17.0589 13.1063C16.9045 13.2298 16.7087 13.2893 16.5118 13.2726H3.2411C3.04417 13.2893 2.84833 13.2298 2.69399 13.1063C2.53966 12.9829 2.43861 12.8049 2.41169 12.6091V6.63728C2.41169 6.4173 2.3243 6.20634 2.16876 6.05079C2.01321 5.89525 1.80225 5.80786 1.58227 5.80786C1.3623 5.80786 1.15133 5.89525 0.995785 6.05079C0.840239 6.20634 0.752855 6.4173 0.752855 6.63728ZM11.8753 4.00803L10.7058 2.83026V9.95494C10.7058 10.1749 10.6185 10.3859 10.4629 10.5414C10.3074 10.697 10.0964 10.7844 9.87643 10.7844C9.65645 10.7844 9.44549 10.697 9.28994 10.5414C9.1344 10.3859 9.04701 10.1749 9.04701 9.95494V2.83026L7.87754 4.00803C7.80043 4.08577 7.7087 4.14747 7.60763 4.18958C7.50655 4.23169 7.39814 4.25337 7.28865 4.25337C7.17916 4.25337 7.07075 4.23169 6.96968 4.18958C6.8686 4.14747 6.77687 4.08577 6.69977 4.00803C6.62289 3.93053 6.56208 3.83862 6.5208 3.73756C6.47953 3.63651 6.4586 3.5283 6.45923 3.41915C6.4586 3.30999 6.47953 3.20178 6.5208 3.10073C6.56208 2.99967 6.62289 2.90776 6.69977 2.83026L9.28754 0.242484C9.42956 0.100737 9.61816 0.0152809 9.81837 0.00195312H9.97596C10.1419 0.0216726 10.298 0.091056 10.4238 0.201013H10.4653L13.0531 2.83026C13.2093 2.98644 13.297 3.19827 13.297 3.41915C13.297 3.64002 13.2093 3.85185 13.0531 4.00803C12.8969 4.16421 12.6851 4.25196 12.4642 4.25196C12.2433 4.25196 12.0315 4.16421 11.8753 4.00803Z" fill="black"/>
        </svg>
            Export</Button>    
          <Button className='bg-transprint text-sm  border border-gray-600 text-black hover:bg-transprint-700 flex gap-2 items-center'>
          <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.2471 8.36663V2.39483C18.2234 1.75753 17.9483 1.15554 17.4821 0.720387C17.0158 0.285238 16.3963 0.0523014 15.7589 0.0724697H2.48825C1.85081 0.0523014 1.23131 0.285238 0.765077 0.720387C0.298845 1.15554 0.0237885 1.75753 0 2.39483V8.36663C0 8.5866 0.0873846 8.79757 0.24293 8.95311C0.398476 9.10866 0.609441 9.19604 0.829416 9.19604C1.04939 9.19604 1.26036 9.10866 1.4159 8.95311C1.57145 8.79757 1.65883 8.5866 1.65883 8.36663V2.39483C1.68575 2.19903 1.7868 2.02103 1.94114 1.89756C2.09547 1.7741 2.29131 1.71458 2.48825 1.7313H15.7589C15.9558 1.71458 16.1517 1.7741 16.306 1.89756C16.4603 2.02103 16.5614 2.19903 16.5883 2.39483V8.36663C16.5883 8.5866 16.6757 8.79757 16.8312 8.95311C16.9868 9.10866 17.1978 9.19604 17.4177 9.19604C17.6377 9.19604 17.8487 9.10866 18.0042 8.95311C18.1598 8.79757 18.2471 8.5866 18.2471 8.36663ZM7.12468 10.9959L8.29416 12.1736V5.04896C8.29416 4.82899 8.38154 4.61802 8.53709 4.46248C8.69263 4.30693 8.9036 4.21955 9.12357 4.21955C9.34355 4.21955 9.55451 4.30693 9.71006 4.46248C9.8656 4.61802 9.95299 4.82899 9.95299 5.04896V12.1736L11.1225 10.9959C11.1996 10.9181 11.2913 10.8564 11.3924 10.8143C11.4934 10.7722 11.6019 10.7505 11.7113 10.7505C11.8208 10.7505 11.9293 10.7722 12.0303 10.8143C12.1314 10.8564 12.2231 10.9181 12.3002 10.9959C12.3771 11.0734 12.4379 11.1653 12.4792 11.2663C12.5205 11.3674 12.5414 11.4756 12.5408 11.5848C12.5414 11.6939 12.5205 11.8021 12.4792 11.9032C12.4379 12.0042 12.3771 12.0961 12.3002 12.1736L9.71246 14.7614C9.57044 14.9032 9.38184 14.9886 9.18163 15.002H9.02404C8.8581 14.9822 8.70199 14.9129 8.57616 14.8029H8.53469L5.94691 12.1736C5.79073 12.0175 5.70299 11.8056 5.70299 11.5848C5.70299 11.3639 5.79073 11.1521 5.94691 10.9959C6.10309 10.8397 6.31492 10.752 6.5358 10.752C6.75667 10.752 6.9685 10.8397 7.12468 10.9959Z" fill="black"/>
          </svg> 
            Import</Button>
          </div>
          <div className='flex gap-3'> 
          {showDiv &&  
            <Button  className='bg-red-500 border border-red-600 text-white text-sm  hover:bg-white hover:text-red-700 flex gap-2 items-center'>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.4 22.169" fill="currentColor" width="14"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.4"><path data-name="Rectangle 2" d="M8.238.7h2.923a2 2 0 012 2v.769h0-6.923 0V2.7a2 2 0 012-2z"></path><path data-name="Line 1" d="M.7 3.469h18"></path><path data-name="Path 77" d="M14.649 21.469h-9.9a1.385 1.385 0 01-1.38-1.279L2.085 3.469h15.231L16.029 20.19a1.385 1.385 0 01-1.38 1.279z"></path><path data-name="Line 2" d="M7.623 6.238V18.7"></path><path data-name="Line 3" d="M11.777 6.238V18.7"></path></g></svg>
              Delete</Button>
          }
            <Button className='bg-black border border-black-600 text-sm  text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 items-center'   onClick={Addproduct}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4141 6.91602H8.08594V0.587891C8.08594 0.264277 7.82361 0.00195312 7.5 0.00195312C7.17639 0.00195312 6.91406 0.264277 6.91406 0.587891V6.91602H0.585938C0.262324 6.91602 0 7.17834 0 7.50195C0 7.82557 0.262324 8.08789 0.585938 8.08789H6.91406V14.416C6.91406 14.7396 7.17639 15.002 7.5 15.002C7.82361 15.002 8.08594 14.7396 8.08594 14.416V8.08789H14.4141C14.7377 8.08789 15 7.82557 15 7.50195C15 7.17834 14.7377 6.91602 14.4141 6.91602Z" fill="currentColor"/>
            </svg>
              Add Product</Button>
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
          </div>




        <div
          className={cn('flex w-full transition', {
            'visible h-auto': visible,
            'invisible h-0': !visible,
          })}
        >
          <div className="flex w-full gap-4 flex-col border-t border-gray-200 pt-5 md:mt-8 md:flex-row md:items-center md:pt-8">
          {/* <label className='flex gap-2 items-center'>
            <input type="checkbox"  /> All
          </label> */}
          <div className="flex w-full flex-col items-center ms-auto md:w-1/3">
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
            />
          </div>

            <CategoryTypeFilter
              className="w-full"
              type={type}
              onCategoryFilter={(category: Category) => {
                setCategory(category?.slug!);
                setPage(1);
              }}
              onTypeFilter={(type: Type) => {
                setType(type?.slug!);
                setPage(1);
              }}
              onProductTypeFilter={(productType: ProductTypeOptions) => {
                setProductType(productType?.slug!);
                setPage(1);
              }}
              enableCategory
              enableType
              enableProductType
            />
          </div>
        </div>
      </Card>
      <ProductList
      // @ts-ignore 
      setRefreshKey={setRefreshKey}
      setShowDiv={setShowDiv}
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />


         {/* Right Side Offcanvas Menu */}
         <div
            className={`fixed inset-0 z-50 flex justify-end transition-transform ${
              isOffcanvasOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Backdrop */}
            {/* <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeOffcanvas}
        ></div> */}

            {/* Offcanvas Content */}
            <div className="bg-white w-1/2 p-6 shadow-lg h-full overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Add Products</h2>
                  <p>Add your product and necessary information from here</p>
                </div>

                <button
                  onClick={closeOffcanvas}
                  className="text-gray-500 hover:text-black"
                >
                  ✕
                </button>
              </div>
              <AddProduct />
            </div>
          </div>


    </>
  );
}
ProductsPage.authenticate = {
  permissions: adminAndOwnerOnly,
};
ProductsPage.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
