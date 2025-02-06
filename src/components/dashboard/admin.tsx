import RecentOrders from '@/components/order/recent-orders';
import { motion } from 'framer-motion';
import PopularProductList from '@/components/product/popular-product-list';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import ColumnChart from '@/components/widgets/column-chart';
import StickerCard from '@/components/widgets/sticker-card';
import WithdrawTable from '@/components/withdraw/withdraw-table';
import Button from '@/components/ui/button';
import {
  useAnalyticsQuery,
  usePopularProductsQuery,
  useLowProductStockQuery,
  useProductByCategoryQuery,
  useTopRatedProductsQuery,
} from '@/data/dashboard';
import { useOrdersQuery } from '@/data/order';
import { useWithdrawsQuery } from '@/data/withdraw';
import usePrice from '@/utils/use-price';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LowStockProduct from '@/components/product/product-stock';
import { useEffect, useState } from 'react';
import { EaringIcon } from '@/components/icons/summary/earning';
import { TotalOrderIcon } from '@/components/icons/summary/total';
import { ShoppingIcon } from '@/components/icons/summary/shopping';
import { PendingIcon } from '@/components/icons/summary/pending';
import { BasketIcon } from '@/components/icons/summary/basket';
import { ProcessOrderIcon } from '@/components/icons/summary/processing';
import { DeliveredIcon } from '@/components/icons/summary/delivered';
import { ChecklistIcon } from '@/components/icons/summary/checklist';
import Search from '@/components/common/search';
import OrderList from '../order/order-list';
import { useShopsQuery } from '@/data/shop';

// const TotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );
// const WeeklyDaysTotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );
// const MonthlyTotalOrderByStatus = dynamic(
//   () => import('@/components/dashboard/total-order-by-status')
// );

const OrderStatusWidget = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-order-by-status'),
);

const ProductCountByCategory = dynamic(
  () =>
    import(
      '@/components/dashboard/widgets/table/widget-product-count-by-category'
    ),
);

const TopRatedProducts = dynamic(
  () => import('@/components/dashboard/widgets/box/widget-top-rate-product'),
);

export default function Dashboard() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const router = useRouter();
  const { data, isLoading: loading } = useAnalyticsQuery();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTimeFrame, setActiveTimeFrame] = useState(1);

  const [orderDataRange, setOrderDataRange] = useState(
    data?.todayTotalOrderByStatus,
  );
  const [activeTab, setActiveTab] = useState(1);

  const { price: total_revenue } = usePrice(
    data && {
      amount: data?.totalRevenue!,
    },
  );
  const { price: todays_revenue } = usePrice(
    data && {
      amount: data?.todaysRevenue!,
    },
  );

  const {
    error: orderError,
    orders: orderData,
    loading: orderLoading,
    paginatorInfo: orderPaginatorInfo,
  } = useOrdersQuery({
    language: locale,
    limit: 5,
    page,
    tracking_number: searchTerm,
  });
  console.log("orderDataorderData",orderData);

  const {
    data: popularProductData,
    isLoading: popularProductLoading,
    error: popularProductError,
  } = usePopularProductsQuery({ limit: 10, language: locale });
const { shops } = useShopsQuery({
  limit: 10,
  page,
});
console.log("popularProductData",shops);


  const {
    data: topRatedProducts,
    isLoading: topRatedProductsLoading,
    error: topRatedProductsError,
  } = useTopRatedProductsQuery({ limit: 10, language: locale });

  const {
    data: lowStockProduct,
    isLoading: lowStockProductLoading,
    error: lowStockProductError,
  } = useLowProductStockQuery({
    limit: 10,
    language: locale,
  });

  const {
    data: productByCategory,
    isLoading: productByCategoryLoading,
    error: productByCategoryError,
  } = useProductByCategoryQuery({ limit: 10, language: locale });

  const {
    withdraws,
    loading: withdrawLoading,
    paginatorInfo: withdrawPaginatorInfo,
  } = useWithdrawsQuery({
    limit: 10,
  });

  let salesByYear: number[] = Array.from({ length: 12 }, (_) => 0);
  if (!!data?.totalYearSaleByMonth?.length) {
    salesByYear = data.totalYearSaleByMonth.map((item: any) =>
      item.total.toFixed(2),
    );
  }

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const timeFrame = [
    { name: t('text-today'), day: 1 },
    { name: t('text-weekly'), day: 7 },
    { name: t('text-monthly'), day: 30 },
    { name: t('text-yearly'), day: 365 },
  ];

  useEffect(() => {
    switch (activeTimeFrame) {
      case 1:
        setOrderDataRange(data?.todayTotalOrderByStatus);
        break;
      case 7:
        setOrderDataRange(data?.weeklyTotalOrderByStatus);
        break;
      case 30:
        setOrderDataRange(data?.monthlyTotalOrderByStatus);
        break;
      case 365:
        setOrderDataRange(data?.yearlyTotalOrderByStatus);
        break;

      default:
        setOrderDataRange(orderDataRange);
        break;
    }
  });

  if (
    loading ||
    orderLoading ||
    popularProductLoading ||
    withdrawLoading ||
    topRatedProductsLoading
  ) {
    return <Loader text={t('common:text-loading')} />;
  }
  if (orderError || popularProductError || topRatedProductsError) {
    return (
      <ErrorMessage
        message={
          orderError?.message ||
          popularProductError?.message ||
          topRatedProductsError?.message
        }
      />
    );
  }

  // Extract series (total values) and categories (month names)
  //@ts-ignore
  const series = data?.totalYearSaleByMonth?.map((item) => item.total);
  //@ts-ignore
  const categories = data?.totalYearSaleByMonth?.map((item) =>
    t(`common:${item.month.toLowerCase()}`),
  );


  return (
    <>
    <div className="text-right mb-3">
      <Button onClick={()=> router.push('/orders')}>Begin Order</Button>
    </div>
    <div className="grid gap-7 md:gap-8 lg:grid-cols-2 2xl:grid-cols-12">
      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            Overall Detail
          </h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="Total Sale"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<EaringIcon className="h-78 w-76" />}
            color="#d3ffe3"
            price={total_revenue}
          />
          <StickerCard
            titleTransKey="Total Company"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<ShoppingIcon className="h-78 w-76" />}
            color="#ecd3ff"
            //@ts-ignore
            company={data?.totalShops}
          />
          <StickerCard
            titleTransKey="Total Employee"
            icon={<ChecklistIcon className="h-78 w-76" />}
            color="#ddeafe"
            //@ts-ignore
            employee={data?.newCustomers}
          />
        </div>
      </div>

      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 items-center justify-between sm:flex md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            Today Average Detail
          </h3>
          {/* <div className="mt-3.5 inline-flex rounded-full bg-gray-100/80 p-1.5 sm:mt-0">
            {timeFrame
              ? timeFrame.map((time) => (
                  <div key={time.day} className="relative">
                    <Button
                      className={cn(
                        '!focus:ring-0  relative z-10 !h-7 rounded-full !px-2.5 text-sm font-medium text-gray-500',
                        time.day === activeTimeFrame ? 'text-accent' : '',
                      )}
                      type="button"
                      onClick={() => setActiveTimeFrame(time.day)}
                      variant="custom"
                    >
                      {time.name}
                    </Button>
                    {time.day === activeTimeFrame ? (
                      <motion.div className="absolute bottom-0 left-0 right-0 z-0 h-full rounded-3xl bg-accent/10" />
                    ) : null}
                  </div>
                ))
              : null}
          </div> */}
        </div>

        <OrderStatusWidget
          order={orderDataRange}
          timeFrame={activeTimeFrame}
          allowedStatus={[
            'pending',
            'processing',
            'complete',
            // 'cancel',
            // 'out-for-delivery',
          ]}
          //@ts-ignore
          todaysAverageRevenue={data?.todaysAverageRevenue}
          todayTotalOrderByStatus={data?.todayTotalOrderByStatus}
          todayTotalEarning={data?.todaysRevenue}
        />
      </div>

      <div className="col-span-full rounded-lg bg-light p-6 md:p-7">
        <div className="mb-5 flex items-center justify-between md:mb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            Overall Orders
          </h3>
        </div>

        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <StickerCard
            titleTransKey="Total Order"
            subtitleTransKey="sticker-card-subtitle-rev"
            icon={<TotalOrderIcon className="h-78 w-76" />}
            color="#1EAE98"
            //@ts-ignore
            totalOrders={data?.totalOrders}
            // price={total_revenue}
          />
          <StickerCard
            titleTransKey="Total Pending"
            subtitleTransKey="sticker-card-subtitle-order"
            icon={<PendingIcon className="h-78 w-76" />}
            color="#ffd9c7"
            //@ts-ignore
            pendingOrders={data?.yearlyTotalOrderByStatus?.pending || '1'}
          />
          <StickerCard
            titleTransKey="Order Processing"
            icon={<ProcessOrderIcon className="h-78 w-76" />}
            color="#D74EFF"
            //@ts-ignore
            processing={data?.yearlyTotalOrderByStatus?.processing}
          />
          <StickerCard
            titleTransKey="Order Delivered"
            icon={<DeliveredIcon className="h-78 w-76" />}
            color="#d8e7ff"
            //@ts-ignore
            totalDeleverdOrder={data?.yearlyTotalOrderByStatus?.complete}
            // price={data?.totalVendors}
          />
        </div>
      </div>
      <div className="lg:col-span-full 2xl:col-span-8">
      {/* <OrderList
        orders={orderData}
        paginatorInfo={orderPaginatorInfo}
        onPagination={handlePagination}
        // onOrder={setOrder}
        // onSort={setColumn}
      /> */}
        <RecentOrders
          className="col-span-full"
          orders={orderData}
          paginatorInfo={orderPaginatorInfo}
          title={t('table:recent-order-table-title')}
          onPagination={handlePagination}
          searchElement={
            <Search
              onSearch={handleSearch}
              placeholderText={t('form:input-placeholder-search-name')}
              className="hidden max-w-sm sm:inline-block [&button]:top-0.5"
              inputClassName="!h-10"
            />
          }
        />
      </div>
      <div className="  2xl:col-span-4">
        <PopularProductList
        // @ts-ignore
          company={shops}
          title={t('Top Company by Sales')}
          className=" "
        />
         {/* <ProductList
      // @ts-ignore 
      setRefreshKey={setRefreshKey}
      setShowDiv={setShowDiv}
        products={products}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      /> */}
      </div>

      <TopRatedProducts
        products={popularProductData}
        title={'Top 10 Products'}
        className="lg:col-span-1 lg:col-start-2 lg:row-start-5 2xl:col-span-4 2xl:col-start-auto 2xl:row-start-auto"
      />

      <div className="lg:col-span-full 2xl:col-span-8">
        <nav
          className="flex gap-4"
          aria-label="Tabs"
          role="tablist"
          aria-orientation="horizontal"
        >
          <button
            type="button"
            className={`hs-tab-active:font-bold hs-tab-active:border-green-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2    hs-tab-active:text-green-600 text-sm whitespace-nowrap text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500 ${activeTab === 1 ? 'font-semibold-600 border-green-600 text-green-600' : ''}`}
            onClick={() => setActiveTab(1)}
            id="tabs-with-underline-item-1"
            aria-selected={activeTab === 1 ? 'true' : 'false'}
            aria-controls="tabs-with-underline-1"
            role="tab"
            style={{ color: '#000', fontSize: '18px' }}
          >
            Sales
          </button>
          {/* <button
            type="button"
            className={`hs-tab-active:font-bold hs-tab-active:border-green-600 py-4 px-1 inline-flex items-center gap-x-2 border-b-2    hs-tab-active:text-green-600 text-sm whitespace-nowrap text-gray-500 hover:text-green-600 focus:outline-none focus:text-green-600 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:text-green-500 ${activeTab === 2 ? 'font-semibold-600 border-green-600 text-green-600' : ''}`}
            onClick={() => setActiveTab(2)}
            id="tabs-with-underline-item-2"
            aria-selected={activeTab === 2 ? 'true' : 'false'}
            aria-controls="tabs-with-underline-2"
            role="tab"
            style={{ color: '#000', fontSize: '18px' }}
          >
            Orders
          </button> */}
        </nav>
        <div
          id="tabs-with-underline-1"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-1"
          className={activeTab === 1 ? '' : 'hidden'}
        >
          <ColumnChart
            widgetTitle={t('')}
            colors={[
              '#6073D4',
              '#FF5733',
              '#33FF57',
              '#FFB533',
              '#FF33D4',
              '#33B5FF',
              '#FF5F5F',
            ]}
            // series={[10, 20, 30, 40, 50, 60, 70, 40, 20, 60, 80, 70]} // Corrected syntax: use curly braces for array
            // categories={[
            //   t('common:january'),
            //   t('common:february'),
            //   t('common:march'),
            //   t('common:april'),
            //   t('common:may'),
            //   t('common:june'),
            //   t('common:july'),
            //   t('common:august'),
            //   t('common:september'),
            //   t('common:october'),
            //   t('common:november'),
            //   t('common:december'),
            // ]}
            series={series ?? [10, 20, 30, 40, 50, 60, 70, 40, 20, 60, 80, 70]}
            categories={categories}
          />
        </div>
        <div
          id="tabs-with-underline-2"
          role="tabpanel"
          aria-labelledby="tabs-with-underline-item-2"
          className={activeTab === 2 ? '' : 'hidden'}
        >
          {/* <ColumnChart
            widgetTitle={t('Orders')}
            colors={[
              '#6073D4',
              '#FF5733',
              '#33FF57',
              '#FFB533',
              '#FF33D4',
              '#33B5FF',
              '#FF5F5F',
            ]}
            series={[150, 20, 30, 40, 50, 60, 70, 40, 20, 60, 80, 70]} // Corrected syntax: use curly braces for array
            categories={[
              t('common:january'),
              t('common:february'),
              t('common:march'),
              t('common:april'),
              t('common:may'),
              t('common:june'),
              t('common:july'),
              t('common:august'),
              t('common:september'),
              t('common:october'),
              t('common:november'),
              t('common:december'),
            ]}
          /> */}
        </div>
      </div>

      {/* <LowStockProduct
        //@ts-ignore
        products={lowStockProduct}
        title={'text-low-stock-products'}
        paginatorInfo={withdrawPaginatorInfo}
        onPagination={handlePagination}
        className="col-span-full"
        searchElement={
          <Search
            onSearch={handleSearch}
            placeholderText={t('form:input-placeholder-search-name')}
            className="hidden max-w-sm sm:inline-block"
            inputClassName="!h-10"
          />
        }
      />

      
      <ProductCountByCategory
        products={productByCategory}
        title={'text-most-category-products'}
        className="col-span-full 2xl:col-span-7 2xl:ltr:-ml-20 2xl:rtl:-mr-20"
      />

      <WithdrawTable
        withdraws={withdraws}
        title={t('table:withdraw-table-title')}
        paginatorInfo={withdrawPaginatorInfo}
        onPagination={handlePagination}
        className="col-span-full"
      /> */}
    </div>
    </>
  );
}
