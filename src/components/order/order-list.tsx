import Pagination from '@/components/ui/pagination';
import dayjs from 'dayjs';
import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import usePrice from '@/utils/use-price';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Product, SortOrder, UserAddress } from '@/types';
import { useTranslation } from 'next-i18next';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Order, MappedPaginatorInfo } from '@/types';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useRouter } from 'next/router';
import StatusColor from '@/components/order/status-color';
import Badge from '@/components/ui/badge/badge';
import { ChatIcon } from '@/components/icons/chat';
import { useCreateConversations } from '@/data/conversations';
import { SUPER_ADMIN } from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';
import Avatar from '../common/avatar';
import Image from 'next/image';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';
import arrow from '@/assets/placeholders/arrow.svg';

type IProps = {
  orders: Order[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const OrderList = ({
  orders,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const rowExpandable = (record: any) => record.children?.length;
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const { mutate: createConversations, isLoading: creating } =
    useCreateConversations();
  const [loading, setLoading] = useState<boolean | string | undefined>(false);
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Toggle expansion when the arrow image is clicked
  const handleExpandToggle = (id: any) => {
    const currentIndex = expandedRowKeys.indexOf(id);
    const newExpandedRowKeys = [...expandedRowKeys];

    if (currentIndex > -1) {
      newExpandedRowKeys.splice(currentIndex, 1); // Collapse
    } else {
      newExpandedRowKeys.push(id); // Expand
    }

    setExpandedRowKeys(newExpandedRowKeys);
  };
  const data = [
    { id: 1, employeeCount: 50 },
    { id: 2, employeeCount: 75 },
    { id: 3, employeeCount: 30 },
    { id: 4, employeeCount: 50 },
    { id: 5, employeeCount: 75 },
    { id: 6, employeeCount: 30 },
    { id: 11, employeeCount: 50 },
    { id: 9, employeeCount: 75 },
    { id: 7, employeeCount: 30 },
  ];
  // Toggle all checkboxes
  const handleAllCheckboxChange = () => {
    if (isAllChecked) {
      setSelectedRows([]);
    } else {
      const allIds = data.map((item) => item.id);
      setSelectedRows(allIds);
    }
    setIsAllChecked(!isAllChecked);
  };

  // Toggle individual checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id],
    );
  };
  const onSubmit = async (shop_id: string | undefined) => {
    setLoading(shop_id);
    createConversations({
      shop_id: Number(shop_id),
      via: 'admin',
    });
  };

  const onHeaderClick = (column: string | null) => ({
    onClick: () => {
      onSort((currentSortDirection: SortOrder) =>
        currentSortDirection === SortOrder.Desc
          ? SortOrder.Asc
          : SortOrder.Desc,
      );
      onOrder(column!);

      setSortingObj({
        sort:
          sortingObj.sort === SortOrder.Desc ? SortOrder.Asc : SortOrder.Desc,
        column: column,
      });
    },
  });

  const columns = [
    {
      title: (
        <input
          type="checkbox"
          checked={isAllChecked}
          onChange={handleAllCheckboxChange}
          className="cursor-pointer"
        />
      ),
      dataIndex: 'id',
      key: 'id',
      align: 'center' as const,
      width: 10,
      render: (id: number) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(id)}
          onChange={() => handleCheckboxChange(id)}
          className="cursor-pointer"
        />
      ),
    },
    {
      title: t('Order Type'),
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: alignLeft,
      width: 200,
    },
    {
      title: t('Order No'),
      dataIndex: 'tracking_number',
      key: 'tracking_number',
      align: alignLeft,
      width: 200,
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'order_status',
      key: 'order_status',
      align: 'center',
      render: (order_status: string) => (
        <Badge text={t(order_status)} color={StatusColor(order_status)} />
      ),
    },
    {
      // title: t('table:table-item-order-date'),
      title: (
        <TitleWithSort
          title={t('Date')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'created_at'
          }
          isActive={sortingObj?.column === 'created_at'}
          className="cursor-pointer"
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },
    {
      // title: t('table:table-item-order-date'),
      title: (
        <TitleWithSort
          title={t('Schedule Shipment')}
          ascending={
            sortingObj?.sort === SortOrder?.Asc &&
            sortingObj?.column === 'created_at'
          }
          isActive={sortingObj?.column === 'created_at'}
          className="cursor-pointer"
        />
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (date: string) => {
        dayjs.extend(relativeTime);
        dayjs.extend(utc);
        dayjs.extend(timezone);
        return (
          <span className="whitespace-nowrap">
            {dayjs.utc(date).tz(dayjs.tz.guess()).fromNow()}
          </span>
        );
      },
    },

    {
      title: (
        <TitleWithSort
          title={t('table:table-item-customer')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'customer',
      key: 'name',
      align: alignLeft,
      width: 250,
      onHeaderCell: () => onHeaderClick('name'),
      // render: (logo: any, record: any) => (
      //   <Image
      //     src={logo?.thumbnail ?? siteSettings.product.placeholder}
      //     alt={record?.name}
      //     width={42}
      //     height={42}
      //     className="overflow-hidden rounded"
      //   />
      // ),
      render: (customer: any) => (
        <div className="flex items-center">
          {/* <Avatar name={customer.name} src={customer?.profile.avatar.thumbnail} /> */}
          <Avatar name={customer?.name} />
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
      title: (
        <TitleWithSort
          title={t('Staff Name')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'customer',
      key: 'name',
      align: alignLeft,
      width: 250,
      onHeaderCell: () => onHeaderClick('name'),
      // render: (logo: any, record: any) => (
      //   <Image
      //     src={logo?.thumbnail ?? siteSettings.product.placeholder}
      //     alt={record?.name}
      //     width={42}
      //     height={42}
      //     className="overflow-hidden rounded"
      //   />
      // ),
      render: (customer: any) => (
        <div className="flex items-center">
          {/* <Avatar name={customer.name} src={customer?.profile.avatar.thumbnail} /> */}
          <Avatar name={customer?.name} />
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
      title: t('Ordered Qty'),
      dataIndex: 'products',
      key: 'products',
      align: 'center',
      render: (products: Product) => <span>{products.length}</span>,
    },

    {
      title: t('Created by'),
      dataIndex: 'delivery_fee',
      key: 'delivery_fee',
      align: 'center',
      render: function Render(value: any) {
        const delivery_fee = value ? value : 0;
        const { price } = usePrice({
          amount: delivery_fee,
        });
        return <span>{price}</span>;
      },
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-total')}
    //       ascending={
    //         sortingObj?.sort === SortOrder?.Asc &&
    //         sortingObj?.column === 'total'
    //       }
    //       isActive={sortingObj?.column === 'total'}
    //       className="cursor-pointer"
    //     />
    //   ),
    //   dataIndex: 'total',
    //   key: 'total',
    //   align: 'center',
    //   width: 120,
    //   onHeaderCell: () => onHeaderClick('total'),
    //   render: function Render(value: any) {
    //     const { price } = usePrice({
    //       amount: value,
    //     });
    //     return <span className="whitespace-nowrap">{price}</span>;
    //   },
    // },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, order: Order) => {
        const currentButtonLoading = !!loading && loading === order?.shop_id;
        return (
          <>
            <div className="flex gap-2">
              {/* @ts-ignore */}
              {/* {order?.children?.length ? (
              ''
            ) : ( */}

              {/* Edit Action - Image/Icon with Tooltip */}
              <Image
                src={edit} // Replace with your actual icon/image path
                alt="Edit"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
                className="cursor-pointer hover:text-blue-500"
              />

              {/* Transfer Ownership Action - Image/Icon with Tooltip */}
              <Image
                src={remove} // Replace with your actual icon/image path
                alt="Transfer Ownership"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
              />
              <Image
                src={arrow} // Replace with your actual icon/image path
                alt="arrow"
                width={10} // Set the width for the icon
                height={10} // Set the height for the icon
                onClick={() => handleExpandToggle(id)}
              />
            </div>
            {/* // <>
              //   {permissions?.includes(SUPER_ADMIN) && order?.shop_id ? (
              //     <button
              //       onClick={() => onSubmit(order?.shop_id)}
              //       disabled={currentButtonLoading}
              //       className="cursor-pointer text-accent transition-colors duration-300 me-1.5 hover:text-accent-hover"
              //     >
              //       <ChatIcon width="19" height="20" />
              //     </button>
              //   ) : (
              //     ''
              //   )}
              // </>
            // )} */}
            {/* <ActionButtons
              id={id}
              detailsUrl={`${router.asPath}/${id}`}
              customLocale={order.language}
            /> */}
          </>
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}
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
          // expandable={{
          //   expandedRowRender: () => '',
          //   rowExpandable: rowExpandable,
          // }}
          expandedRowRender={(record) =>
            expandedRowKeys.includes(record?.id) && (
              <div className=" flex bg-white  p-4 shadow">
                <div className="flex flex-col  w-1/4">
                  <div>Order Number: {'order.orderNumber'}</div>
                  <div>Type: {'order.orderType'}</div>
                  <div>Amount: {'order.orderAmount'}</div>
                  <div>Status: {'order.orderStatus'}</div>
                  <div>Date: {'order.orderDate'}</div>
                </div>
                <div className="flex flex-col  w-1/4">
                  <div>Order Number: {'order.orderNumber'}</div>
                  <div>Type: {'order.orderType'}</div>
                  <div>Amount: {'order.orderAmount'}</div>
                  <div>Status: {'order.orderStatus'}</div>
                  <div>Date: {'order.orderDate'}</div>
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
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo?.total}
            current={paginatorInfo?.currentPage}
            pageSize={paginatorInfo?.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default OrderList;
