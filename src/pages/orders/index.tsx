import Card from '@/components/common/card';
import Layout from '@/components/layouts/admin';
import Search from '@/components/common/search';
import OrderList from '@/components/order/order-list';
import { Fragment, useState } from 'react';
import ErrorMessage from '@/components/ui/error-message';
import Loader from '@/components/ui/loader/loader';
import { useOrdersQuery } from '@/data/order';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { MoreIcon } from '@/components/icons/more-icon';
import { useExportOrderQuery } from '@/data/export';
import { useRouter } from 'next/router';
import { useShopQuery } from '@/data/shop';
import { Menu, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { DownloadIcon } from '@/components/icons/download-icon';
import PageHeading from '@/components/common/page-heading';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main CSS file
import 'react-date-range/dist/theme/default.css'; // Theme CSS file
import { useSearchParams } from 'next/navigation';
import { useMeQuery } from '@/data/user';

export default function Orders() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const company = searchParams.get('company');
  const { data: me } = useMeQuery();
  const companyId = Number(company);

  const { locale } = useRouter();
  const {
    query: { shop },
  } = router;
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const { t } = useTranslation();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpens, setIsOpens] = useState(false);
  const [isDate, setIsDate] = useState(false);
  const [orderType, setOrderType] = useState('');
  console.log('orderType>>', orderType);

  const [orderStatus, setOrderStatus] = useState('');

  const [dateFilter, setDateFilter] = useState('');

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdowns = () => {
    setIsOpens(!isOpens);
  };
  const toggleDate = () => {
    setIsDate(!isDate);
  };
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });

  function handleOrderTypeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setOrderType(event?.target?.value);
  }
  function handleOrderStatusChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    setOrderStatus(event?.target?.value);
  }

  function handleDateFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setDateFilter(event?.target?.value);
  }
  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges?.selection);
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: any) {
    setPage(current);
  }

  const { data: shopData, isLoading: fetchingShop } = useShopQuery(
    {
      slug: shop as string,
    },
    {
      enabled: !!shop,
    },
  );
  const shopId = shopData?.id!;

  const { orders, loading, paginatorInfo, error } = useOrdersQuery({
    language: locale,
    limit: 20,
    page,
    orderBy,
    sortedBy,
    //@ts-ignore
    tracking_number: searchTerm,
    type: orderType, // Pass selected order type
    // @ts-ignore
    status: orderStatus,
    //@ts-ignore
    days: dateFilter || null, // Pass selected date filter
  });
  const { refetch } = useExportOrderQuery(
    {
      ...(shopId && { shop_id: shopId }),
    },
    { enabled: false },
  );

  if (loading) return <Loader text={t('common:text-loading')} />;

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  async function handleExportOrder() {
    const { data } = await refetch();

    if (data) {
      const a = document.createElement('a');
      a.href = data;
      a.setAttribute('download', 'export-order');
      a.click();
    }
  }

  return (
    <>
      <Card className="mb-8 flex flex-col items-center justify-between md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title={t('form:input-label-orders')} />
        </div>

        <div className="flex w-full gap-4 flex-row items-center md:w-1/1">
          <Search
            onSearch={handleSearch}
            className="w-full"
            placeholderText={t('search by order id')}
          />

          <div className="relative inline-block text-left ">
            <div className="">
              <select
                className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                style={{ width: '170px', marginRight: '20px' }}
                onChange={handleOrderTypeChange}
              >
                <option value="">Select Order Type</option>
                <option value="FULL_WALLET_PAYMENT">Order</option>
                <option value="CASH">Quotation</option>
              </select>
            </div>
          </div>

          <div className="relative inline-block text-left w-[250px]">
            <div className="">
              <select
                className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                style={{ width: '150px' }}
                onChange={handleDateFilterChange}
              >
                <option value="">Sort By Date</option>
                <option value="30">Last 30 days</option>
                <option value="15">Last 15 days</option>
                <option value="7">Last 7 days</option>
              </select>
            </div>
            {/* <div>
              <button
                onClick={toggleDropdowns}
                type="button"
                className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
                id="menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                Last 30 days
                <svg
                  className="-mr-1 size-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div> */}

            {/* {isOpens && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <div className="py-1" role="none">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    id="menu-item-0"
                  >
                    Last week
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700"
                    role="menuitem"
                    id="menu-item-1"
                  >
                    Last Months
                  </a>
                </div>
              </div>
            )} */}
          </div>

          <div className="relative inline-block text-left ">
            <div className="">
              <select
                className="px-4 py-2 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                style={{ width: '180px', marginRight: '20px' }}
                onChange={handleOrderStatusChange}
              >
                <option value="">Select Order Status</option>
                <option value="order-processing">Processing</option>
                <option value="order-cancelled">Cancelled</option>
                <option value="order-completed">Completed</option>
                <option value="order-at-local-facility">
                  Order at local facility
                </option>
                <option value="order-out-for-delivery">
                  Order out for delivery
                </option>
              </select>
            </div>
          </div>

          <div className="relative inline-block text-left w-[200px]">
            {/* <button
              onClick={toggleDate}
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-3 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50"
              id="menu-button"
              aria-expanded="false"
              aria-haspopup="true"
            >
              Date Filter
            </button>
            {isDate && (
              <div
                className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 focus:outline-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
              >
                <DateRange
                  ranges={[selectionRange]}
                  onChange={handleSelect}
                  rangeColors={['#4F46E5']} // Optional: Custom range color
                  moveRangeOnFirstSelection={false}
                />
              </div>
            )} */}
          </div>

          {/* <Menu
            as="div"
            className="relative inline-block ltr:text-left rtl:text-right"
          >
            <Menu.Button className="group p-2">
              <MoreIcon className="w-3.5 text-body" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                as="ul"
                className={classNames(
                  'shadow-700 absolute z-50 mt-2 w-52 overflow-hidden rounded border border-border-200 bg-light py-2 focus:outline-none ltr:right-0 ltr:origin-top-right rtl:left-0 rtl:origin-top-left',
                )}
              >
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleExportOrder}
                      className={classNames(
                        'flex w-full items-center space-x-3 px-5 py-2.5 text-sm font-semibold capitalize transition duration-200 hover:text-accent focus:outline-none rtl:space-x-reverse',
                        active ? 'text-accent' : 'text-body',
                      )}
                    >
                      <DownloadIcon className="w-5 shrink-0" />
                      <span className="whitespace-nowrap">
                        {t('common:text-export-orders')}
                      </span>
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu> */}
        </div>
      </Card>
      <OrderList
        orders={orders}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Orders.authenticate = {
  permissions: adminOnly,
};
Orders.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['table', 'common', 'form'])),
  },
});
