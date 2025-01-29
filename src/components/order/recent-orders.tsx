import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import usePrice from '@/utils/use-price';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import ActionButtons from '@/components/common/action-buttons';
import { MappedPaginatorInfo, Order, OrderStatus, Product } from '@/types';
import { useTranslation } from 'next-i18next';
import Badge from '@/components/ui/badge/badge';
import StatusColor from '@/components/order/status-color';
import { useRouter } from 'next/router';
import Avatar from '../common/avatar';
import Pagination from '@/components/ui/pagination';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import { Routes } from '@/config/routes';
import cn from 'classnames';
import Image from 'next/image';
import arrow from '@/assets/placeholders/arrow.svg';
import { useState } from 'react';
import TitleWithSort from '../ui/title-with-sort';

type IProps = {
  orders: Order[];
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  searchElement: React.ReactNode;
  title?: string;
  className?: string;
};

const RecentOrders = ({
  orders,
  paginatorInfo,
  onPagination,
  searchElement,
  title,
  className,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const rowExpandable = (record: any) => record.children?.length;
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Toggle expansion when the arrow image is clicked
  const handleExpandToggle = (id: any) => {
    // @ts-ignore

    const currentIndex = expandedRowKeys.indexOf(id);
    const newExpandedRowKeys = [...expandedRowKeys];

    if (currentIndex > -1) {
      newExpandedRowKeys.splice(currentIndex, 1); // Collapse
    } else {
      // @ts-ignore

      newExpandedRowKeys.push(id); // Expand
    }

    setExpandedRowKeys(newExpandedRowKeys);
  };

  const columns = [
    {
      title: (
        // @ts-ignore
        <TitleWithSort
          title={t('Order Type')}
          // ascending={
          //   sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          // }
          // isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      width: 120,
      align: alignLeft,
      className: 'cursor-pointer',
      // onHeaderCell: () => on/HeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="flex items-center">
          <span className="truncate whitespace-nowrap font-medium">{'NA'}</span>
        </div>
      ),
    },
    {
      title: 'Order Id',
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: alignLeft,
      width: 120,
    },
    {
      title: t('Employee'),
      dataIndex: 'customer',
      key: 'name',
      align: alignLeft,
      width: 80,
      render: (customer: any) => (
        <div className="flex items-center">
          {/* <Avatar name={customer?.name} /> */}
          <div className="flex flex-col whitespace-nowrap font-medium ms-2">
            {customer?.name ? customer?.name : t('common:text-guest')}
            <span className="text-[13px] font-normal text-gray-500/80">
              {customer?.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: t('table:table-item-products'),
      dataIndex: 'products',
      key: 'products',
      align: 'center',
      width: 50,
      render: (products: Product) => <span>{products.length}</span>,
    },

    {
      // title: t('table:table-item-order-date'),
      title: (
        //@ts-ignore
        <TitleWithSort
          title={t('Order Time')}
          // ascending={
          //   sortingObj?.sort === SortOrder?.Asc &&
          //   sortingObj?.column === 'created_at'
          // }
          // isActive={sortingObj?.column === 'created_at'}
          // className="cursor-pointer"
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      // onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        //@ts-ignore
        const formatDate = (dateString) => {
          const date = new Date(dateString);
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
          const year = date.getFullYear();
          return `${day}/${month}/${year}`; // Change to `${day}-${month}-${year}` for the hyphen format
        };

        //@ts-ignore
        const formattedDate = formatDate(date);
        console.log(formattedDate); // Output: "28/01/2025"
        return (
          <span className="whitespace-nowrap">
            {formattedDate}
            {/* {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()} */}
          </span>
        );
      },
    },
    // {
    //   // title: t('table:table-item-order-date'),
    //   title: t('Order Time'),
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   align: 'center',
    //   width: 100,

    //   render: (date: string) => {
    //     dayjs.extend(relativeTime);
    //     dayjs.extend(utc);
    //     dayjs.extend(timezone);
    //     return (
    //       <span className="whitespace-nowrap">
    //         {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
    //       </span>
    //     );
    //   },
    // },
    {
      title: t('Amount'),
      dataIndex: 'total',
      key: 'total',
      align: 'center',
      width: 50,

      render: function Render(value: any) {
        const { price } = usePrice({
          amount: value,
        });
        return <span className="whitespace-nowrap font-medium">{price}</span>;
      },
    },
    {
      title: t('Order Status'),
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'center',
      width: 100,
      render: (order_status: OrderStatus) => (
        <Badge
          text={t(order_status)}
          color={StatusColor(order_status)}
          className="!rounded py-1.5 font-medium"
        />
      ),
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'left',
      width: 50,
      render: (id: string, order: Order) => {
        return (
          <div className="flex gap-2 items-center">
            <ActionButtons
              id={id}
              detailsUrl={`${Routes.order.list}/${id}`}
              customLocale={order.language}
            />
            <Image
              src={arrow} // Replace with your actual icon/image path
              alt="arrow"
              width={10} // Set the width for the icon
              height={10} // Set the height for the icon
              onClick={() => handleExpandToggle(id)}
              className="cursor-pointer"
            />
          </div>
        );
      },
    },
  ];
  const tabledata = [
    { label: 'Name:', value: 'Angelina Lopes' },
    { label: 'Mobile Number:', value: '(0452) 999 999' },
    { label: 'ABN Number:', value: '64 284 550 602' },
    { label: 'Billing Address:', value: '184, Raven Street Brisbane, 4000' },
    { label: 'Total Outstanding', value: '$600.00' },
    { label: 'Order Number', value: 'Order type' },
    { label: '1226362373773', value: 'Online' },
    { label: '1226362373773', value: 'Offline' },
    { label: '1226362373773', value: 'Online' },
    {
      label: 'View All Order',
      value: (
        <a href="your-pdf-link.pdf" target="_blank" rel="noopener noreferrer">
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.4699 8.61719V5.61719H8.46988V8.61719H7.46988V4.61719H17.4699V8.61719H16.4699ZM18.0849 12.1172C18.3682 12.1172 18.6059 12.0212 18.7979 11.8292C18.9899 11.6372 19.0855 11.3999 19.0849 11.1172C19.0842 10.8345 18.9885 10.5969 18.7979 10.4042C18.6072 10.2115 18.3695 10.1155 18.0849 10.1162C17.8002 10.1169 17.5629 10.2129 17.3729 10.4042C17.1829 10.5955 17.0869 10.8332 17.0849 11.1172C17.0829 11.4012 17.1789 11.6385 17.3729 11.8292C17.5669 12.0199 17.8035 12.1159 18.0849 12.1172ZM16.4699 19.0012V14.4632H8.46988V19.0012H16.4699ZM17.4699 20.0012H7.46988V16.0012H4.04688V10.6172C4.04688 10.0505 4.23921 9.57552 4.62387 9.19219C5.00854 8.80885 5.48288 8.61685 6.04688 8.61619H18.8929C19.4595 8.61619 19.9345 8.80819 20.3179 9.19219C20.7012 9.57619 20.8929 10.0509 20.8929 10.6162V16.0012H17.4699V20.0012ZM19.8929 15.0012V10.6172C19.8929 10.3339 19.7972 10.0962 19.6059 9.90419C19.4145 9.71219 19.1769 9.61619 18.8929 9.61619H6.04688C5.76354 9.61619 5.52621 9.71219 5.33487 9.90419C5.14354 10.0962 5.04754 10.3339 5.04688 10.6172V15.0012H7.46988V13.4632H17.4699V15.0012H19.8929Z"
              fill="#4791EE"
            />
          </svg>
        </a>
      ),
    },
    { label: 'Order Amt.', value: '' },
    { label: '$456.00', value: '' },
    { label: '$456.00', value: ' ' },
    { label: '$456.00', value: ' ' },
  ];
  const gridData = [
    tabledata.slice(0, 5),
    tabledata.slice(5, 9),
    tabledata.slice(9, 15),
  ];
  return (
    <>
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-white p-6 md:p-7',
          className,
        )}
      >
        <div className="flex items-center justify-between pb-6 md:pb-7">
          <h3 className="before:content-'' relative mt-1 bg-light text-lg font-semibold text-heading before:absolute before:-top-px before:h-7 before:w-1 before:rounded-tr-md before:rounded-br-md before:bg-accent ltr:before:-left-6 rtl:before:-right-6 md:before:-top-0.5 md:ltr:before:-left-7 md:rtl:before:-right-7 lg:before:h-8">
            {title}
          </h3>
          {searchElement}
        </div>
        <Table
          //@ts-ignore
          columns={columns}
          expandedRowRender={(record) =>
            // @ts-ignore
            expandedRowKeys.includes(record?.id) && (
              <div className=" flex bg-white  p-4 shadow">
                <div className="grid grid-cols-3 gap-4 border border-gray-300 bg-white rounded-md">
                  {gridData?.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className={`p-6 ${columnIndex < 3 ? 'border-r border-gray-300' : ''}`}
                    >
                      {column?.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2"
                        >
                          <span className="font-medium text-gray-600">
                            {item?.label}
                          </span>
                          <span className="text-gray-800 text-right">
                            {item?.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              // </div>
            )
          }
          expandable={{
            expandedRowKeys, // Manage which rows are expanded
            onExpand: (expanded, record) => {
              // Optional callback when a row is expanded or collapsed
              handleExpandToggle(record.id);
            },
            expandIcon: () => null,
            // expandIcon: false, // Hide the default expand icon (the + icon)
            expandRowByClick: false, // Disable expansion on row click
          }}
          emptyText={() => (
            <div className="flex flex-col items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={orders}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
        {!!paginatorInfo?.total && (
          <div className="flex items-center justify-between py-2">
            <div className="mt-2 text-sm text-gray-500">
              {paginatorInfo?.currentPage} of {paginatorInfo?.lastPage} pages
            </div>
            <Pagination
              total={paginatorInfo?.total}
              current={paginatorInfo?.currentPage}
              pageSize={paginatorInfo?.perPage}
              onChange={onPagination}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default RecentOrders;
