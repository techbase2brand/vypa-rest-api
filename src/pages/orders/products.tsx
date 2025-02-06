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
import { Category, Product, ProductStatus, SortOrder, Type } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useState } from 'react';
import PageHeading from '@/components/common/page-heading';
import FilterAccordion from './filter';
import Button from '@/components/ui/button';
import { useCategoriesQuery } from '@/data/category';
import { useAttributesQuery } from '@/data/attributes';
import { useManufacturersQuery } from '@/data/manufacturer';

export default function ProductsPage() {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [visible, setVisible] = useState(false);
  const { displayCartSidebar, closeCartSidebar } = useUI();
  const [orderBy, setOrder] = useState('created_at');

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceValue, setPriceValue] = useState('100');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});

  console.log('selectedFilters', selectedSizes, selectedColors, selectedBrands,priceValue);
  console.log('selectedFilters', selectedFilters, category);

  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const toggleVisible = () => {
    setVisible((v) => !v);
  };
  //@ts-ignore
  const { products, loading, paginatorInfo, error } = useProductsQuery({
    limit: 18,
    language: locale,
    status: ProductStatus.Publish,
    name: searchTerm,
    page,
    type,
    //@ts-ignore
    categories: category,
    //@ts-ignore
    sizes: selectedFilters?.sizes?.length > 0 && selectedSizes.join(','), // Conditionally include sizes
    //@ts-ignore

    colors: selectedFilters?.colors?.length > 0 && selectedColors.join(','), // Conditionally include colors

    brands:
      //@ts-ignore
      selectedFilters?.brands?.length > 0 && selectedBrands.join(','), // Conditionally include brands
    //@ts-ignore
    price: selectedFilters?.price,
  });


  console.log("productsproducts",products);
  
  const { manufacturers } = useManufacturersQuery({
    limit: 100,
    name: searchTerm,
    page,
    orderBy,
    sortedBy,
    language: locale,
  });
  //@ts-ignore
  const { categories } = useCategoriesQuery({
    limit: 20,
    page,
    type,
    name: searchTerm,
    orderBy,
    sortedBy,
    parent: null,
    language: locale,
  });
  //@ts-ignore
  const { attributes } = useAttributesQuery({
    orderBy,
    sortedBy,
    language: locale,
  });
  console.log('manufacturers', manufacturers);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
  }

  function handlePagination(current: any) {
    setPage(current);
  }
  // @ts-ignore
  const handleCategoryClick = (categorySlug) => {
    setCategory(categorySlug);
    console.log('Selected Category:', categorySlug); // Log or do something with the selected category
  };

  // @ts-ignore

  const handleCategorySelect = (e) => {
    setCategory(e.target.value);
    console.log('Selected Category:', e.target.value); // Log or do something with the selected category
  };
  //@ts-ignore
  const handleSizeCheckboxChange = (value) => {
    //@ts-ignore
    setSelectedSizes((prevState) => {
      //@ts-ignore
      const newSelectedSizes = prevState.includes(value)
        ? prevState.filter((size) => size !== value)
        : [...prevState, value];

      console.log('Selected Sizes:', newSelectedSizes);
      return newSelectedSizes;
    });
  };

  //@ts-ignore
  const handleColorCheckboxChange = (value) => {
    //@ts-ignore
    setSelectedColors((prevState) => {
      //@ts-ignore
      const newSelectedColors = prevState.includes(value)
        ? prevState.filter((color) => color !== value)
        : [...prevState, value];

      console.log('Selected Colors:', newSelectedColors);
      return newSelectedColors;
    });
  };

  //@ts-ignore
  const handleBrandCheckboxChange = (value) => {
    //@ts-ignore
    setSelectedBrands((prevState) => {
      //@ts-ignore
      const newSelectedColors = prevState.includes(value)
        ? prevState.filter((brand) => brand !== value)
        : [...prevState, value];

      return newSelectedColors;
    });
  };

  //   const handleFilterProducts = () => {
  // console.log("handleFilterProducts", );
  //   };
  const handleFilterProducts = () => {
    // Update the selectedFilters object with the current filter states
    const filtersObject = {
      selectCategory: category,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
      price: priceValue,
    };

    // Set selectedFilters state with the filtersObject
    setSelectedFilters(filtersObject);

    console.log('Filters Applied:', filtersObject);

    // Refetch query with the updated filters
    // refetch(queryVariables);
  };
  const handleClearFilterProducts = () => {
    // Update the selectedFilters object with the current filter states
    setCategory('')
    setSelectedSizes([])
    setSelectedBrands([])
    setSelectedColors([])
    // Set selectedFilters state with the filtersObject
    setSelectedFilters({});

    // console.log('Filters Applied:', filtersObject);

    // Refetch query with the updated filters
    // refetch(queryVariables);
  };
  return (
    <>
      <Card className="mb-2 flex flex-col">
        <div className="mb-4 md:mb-0">
          <PageHeading title={t('Products')} />
        </div>
        <div className="flex w-full flex-col justify-between items-center md:flex-row">
          {/* <div className="relative inline-block text-left">
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
          </div> */}

          {/* <div className="relative inline-block text-left">
            {categories?.map((category) => {
              
              if (category.children.length === 0) {
                // Render button for categories with empty children
                return (
                  <div
                    key={category?.id}
                    className="filter_button"
                    style={{
                      display: 'inline-block',
                      // backgroundColor: '#f1f1f1',
                      color: 'black',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      margin: '4px',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                    onClick={() => handleCategoryClick(category.slug)} // Update selected category on click
                  >
                    {category.name}
                  </div>
                );
              }

              // Render select dropdown for categories with children
              return (
                <select
                  style={{ border: 'none' }}
                  // @ts-ignore

                  value={category}
                  onChange={handleCategorySelect}
                  key={category.id}
                >
                  <option
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                    }}
                    value={category.slug}
                  >
                    {category?.name}
                  </option>
                  {category?.children.map((child) => (
                    <option
                      style={{
                        backgroundColor: 'white',
                        color: 'black',
                      }}
                      key={child.id}
                      value={child.slug}
                    >
                      {child.name}
                    </option>
                  ))}
                </select>
              );
            })}
          </div> */}
          <div className="relative inline-block text-left">
  {categories?.map((cat) => {
    // Check if the category is selected
    const isSelected = category === cat.slug;

    if (cat.children.length === 0) {
      // Render button for categories with empty children
      return (
        <div
          key={cat?.id}
          className="filter_button"
          style={{
            display: 'inline-block',
            color: isSelected ? 'white' : 'black', // Change text color based on selection
            backgroundColor: isSelected ? 'green' : '#f1f1f1', // Highlight selected category with green
            padding: '8px 12px',
            borderRadius: '4px',
            margin: '4px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => handleCategoryClick(cat.slug)} // Update selected category on click
        >
          {cat.name}
        </div>
      );
    }

    // Render select dropdown for categories with children
    return (
      <select
        style={{
          border: 'none',
          backgroundColor: isSelected ? 'green' : 'white', // Highlight selected dropdown with green
          color: isSelected ? 'white' : 'black',
        }}
        value={category}
        onChange={(e) => handleCategorySelect(e)}
        key={cat.id}
      >
        <option
          style={{
            backgroundColor: 'white',
            color: 'black',
          }}
          value={cat.slug}
        >
          {cat?.name}
        </option>
        {cat?.children.map((child) => (
          <option
            style={{
              backgroundColor: 'white',
              color: 'black',
            }}
            key={child.id}
            value={child.slug}
          >
            {child.name}
          </option>
        ))}
      </select>
    );
  })}
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
      <div className="flex space-x-5" style={{ alignItems: 'flex-start' }}>
        <div className="w-[15%] space-y-4 bg-[#e5e7eb]">
          {/* <FilterAccordion title="Brand">
            <label className="block">
              <input type="checkbox" className="mr-2" />
              Brand 1
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" />
              Brand 2
            </label>
            <label className="block">
              <input type="checkbox" className="mr-2" />
              Brand 3
            </label>
          </FilterAccordion> */}

          <FilterAccordion title="Brand">
            {manufacturers?.map((manufacturer) => (
              <label key={manufacturer?.id} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  //@ts-ignore
                  checked={selectedBrands?.includes(manufacturer?.name)}
                  onChange={() => handleBrandCheckboxChange(manufacturer?.name)}
                />
                {manufacturer?.name}
              </label>
            ))}
          </FilterAccordion>

          
          {/* SizeFilter  */}
          <FilterAccordion title="Size">
            {attributes[0]?.values.map((size) => (
              <label key={size.id} className="block">
                <input
                  type="checkbox"
                  className="mr-2"
                  //@ts-ignore
                  checked={selectedSizes?.includes(size?.value)}
                  onChange={() => handleSizeCheckboxChange(size.value)}
                />
                {size?.value}
              </label>
            ))}
          </FilterAccordion>
          {/* <FilterAccordion title="Gender">
        <label className="block"><input type="checkbox" className="mr-2" />Men</label>
        <label className="block"><input type="checkbox" className="mr-2" />Women</label>
        <label className="block"><input type="checkbox" className="mr-2" />Unisex</label>
      </FilterAccordion> */}
          {/* ColorFilter  */}

          <FilterAccordion title="Color">
            {attributes[1]?.values?.map((color) => ( 
               
                <label  key={color?.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  // @ts-ignore
                  checked={selectedColors?.includes(color?.value)}
                  onChange={() => handleColorCheckboxChange(color?.value)}
                />
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundImage: color?.value && color.value.includes(',') 
                      ? `linear-gradient(to bottom right, ${color.value})` 
                      : 'none',
                    backgroundColor: color?.value && !color.value.includes(',')
                      ? color.value
                      : 'transparent',
                  }}
                ></div>
              </div>
              {color?.value}

            </label> 
            ))}
          </FilterAccordion>
          {/* <FilterAccordion title="Color">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="" />
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundImage:
                      ' linear-gradient(to bottom right,rgb(255, 0, 0) 50%, #007BFF 50%)',
                  }}
                ></div>
              </div>
              Red
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="" />
              <div className="flex items-center space-x-4">
                <div
                  className="w-4 h-4"
                  style={{
                    backgroundImage:
                      ' linear-gradient(to bottom right, #FFA500 50%, #007BFF 50%)',
                  }}
                ></div>
              </div>
              Blue
            </label>
          </FilterAccordion> */}

          {/* <FilterAccordion title="Gender">
        <label className="block"><input type="checkbox" className="mr-2" />Men</label>
        <label className="block"><input type="checkbox" className="mr-2" />Women</label>
        <label className="block"><input type="checkbox" className="mr-2" />Unisex</label>
      </FilterAccordion> */}

          <FilterAccordion title="Price">
            <input
              type="range"
              min="0"
              max="100"
              className="w-full"
              value={priceValue}
              onChange={(e) => setPriceValue(e.target.value)}
            />
            <div className="flex justify-between text-sm">
              <span>${priceValue}</span>
              <span>$100</span>
            </div>
          </FilterAccordion>
          <div className="flex justify-between gap-2 pl-3 pr-3 pb-3">
            <Button onClick={handleClearFilterProducts} className="bg-transprent w-20 border border-white text-black hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8">
              Clear
            </Button>
            <Button
              onClick={handleFilterProducts}
              className="bg-black border w-20 border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8"
            >
              Apply
            </Button>
          </div>
        </div>
        <div className="flex w-[85%]">
          <div className="mb-3">
            <h2 className="font-bold text-xl">NSW Rail Clothing</h2>
            <p className="text-sm mb-3">
              From Australia Fastest Rail Compliant Workwear Supplier. NSW Rail
              Compliant Workwear: NSW Rail Shirts
            </p>
            {/* <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6">
            {!products?.length ? (
        <NotFound text="text-not-found" className="mx-auto w-7/12" />
      ) :
             
              {products?.map((product: Product) => (
                <ProductCard key={product.id} item={product} />
              ))}
              }
            </div> */}
            {/* <div className='w-full'>
              {!products?.length ? (
                <NotFound text="text-not-found" className="w-1/2" />
              ) : (
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-6">
                  {products.map((product: Product) => (
                    <ProductCard key={product.id} item={product} />
                  ))}
                </div>
              )}
            </div> */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 3xl:grid-cols-4">
              {!products?.length ? (
                <NotFound
                  text="text-not-found"
                  className="col-span-full text-center"
                />
              ) : (
                products?.map((product: Product) => (
                  <ProductCard key={product.id} item={product} />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

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
