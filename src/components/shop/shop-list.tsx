import ActionButtons from '@/components/common/action-buttons';
import Avatar from '@/components/common/avatar';
import { NoDataFound } from '@/components/icons/no-data-found';
import Badge from '@/components/ui/badge/badge';
import Link from '@/components/ui/link';
import Pagination from '@/components/ui/pagination';
import { AlignType, Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { siteSettings } from '@/settings/site.settings';
import {
  MappedPaginatorInfo,
  OwnerShipTransferStatus,
  Shop,
  SortOrder,
} from '@/types';
import { OWNERSHIP_TRANSFER_STATUS, SUPER_ADMIN } from '@/utils/constants';
import { useIsRTL } from '@/utils/locals';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useState } from 'react';
import { getAuthCredentials } from '@/utils/auth-utils';
import approve from '@/assets/placeholders/approve.svg';
import arrow from '@/assets/placeholders/arrow.svg';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';
import remove_cut from '@/assets/placeholders/remove.svg';

import phone from '@/assets/placeholders/phone.svg';
import email from '@/assets/placeholders/email.svg';
import location from '@/assets/placeholders/location.svg';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import { useDeleteShopMutation } from '@/data/shop';

type IProps = {
  shops: Shop[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  isMultiCommissionRate?: boolean;
};

const ShopList = ({
  shops,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  isMultiCommissionRate,
}: IProps) => {
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();
  const { permissions } = getAuthCredentials();
  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });
  const router = useRouter();
  const { mutate: deleteShop, isLoading: updating } = useDeleteShopMutation();

  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  // const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

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

  // Toggle individual checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id],
    );
  };
  const handleUpdateCompanyData = (slug: any) => {
    router.push(`/${slug}/edit`);
  };
  const handleDeleteCompanyData = (id: any) => {
    deleteShop({
      id,
    });
  };
  console.log('shopsshopsshopsshops', shops);

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
      const allIds = shops?.map((item) => item.id);
      // @ts-ignore
      setSelectedRows(allIds);
    }
    setIsAllChecked(!isAllChecked);
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

  let columns = [
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
      align: 'left' as const,
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
      title: (
        <TitleWithSort
          title={t('Company Name')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft as AlignType,
      width: 200,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="flex items-center">
          <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5">
            <Image
              src={logo?.thumbnail ?? siteSettings?.product?.placeholder}
              alt={name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <Link href="/company-setup">
            <span className="truncate whitespace-nowrap font-medium">
              {name}
            </span>
          </Link>
        </div>
      ),
    },
    {
      title: t('No of Emp'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 100,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('Contact Details'),
      dataIndex: 'primary_contact_detail',
      key: 'primary_contact_detail',
      align: alignLeft as AlignType,
      width: 130,
      render: (primary_contact_detail: any) => {
        console.log(
          'primary_contact_detailprimary_contact_detail',
          primary_contact_detail,
        );

        return (
          <div className="flex space-x-4">
            {/* Phone Icon with Tooltip */}
            <div className="relative group">
              <Image
                src={phone} // Replace with your actual phone icon path
                alt="Phone"
                className="h-5 w-5 cursor-pointer hover:text-blue-500"
              />
              <span className=" flex absolute bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-Black bg-White p-1 rounded border opacity-0 border-black group-hover:opacity-100 transition-opacity duration-200">
                {primary_contact_detail?.mobile
                  ? primary_contact_detail?.mobile
                  : 'Phone'}
              </span>
            </div>

            {/* Email Icon with Tooltip */}
            <div className="relative group">
              <Image
                src={email} // Replace with your actual email icon path
                alt="Email"
                className="h-5 w-5 cursor-pointer hover:text-blue-500"
              />
              <span className="absolute bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-Black bg-White p-1 rounded border opacity-0 border-black group-hover:opacity-100 transition-opacity duration-200">
                {primary_contact_detail?.email
                  ? primary_contact_detail?.email
                  : 'E-mail'}
              </span>
            </div>

            <div className="relative group">
              <Image
                src={location} // Replace with your actual location icon path
                alt="Location"
                className="h-5 w-5 cursor-pointer hover:text-blue-500"
              />
              <span className="absolute bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-Black bg-White p-1 rounded border opacity-0 border-black group-hover:opacity-100 transition-opacity duration-200">
                Location
              </span>
            </div>
          </div>
        );
      },
    },

    {
      title: t('Created by'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 100,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('Company Status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'is_active',
      key: 'is_active',
      align: 'center' as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => (
        <Badge
          textKey={is_active ? 'common:text-active' : 'common:text-inactive'}
          color={
            is_active
              ? 'bg-accent/10 !text-accent'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('Total Orders')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'products_count'
          }
          isActive={sortingObj.column === 'products_count'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'products_count',
      key: 'products_count',
      align: 'center' as AlignType,
      width: 100,
      onHeaderCell: () => onHeaderClick('products_count'),
    },

    {
      title: (
        <TitleWithSort
          title={t('Avg. Orders')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'products_count'
          }
          isActive={sortingObj.column === 'products_count'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'products_count',
      key: 'products_count',
      align: 'center' as AlignType,
      width: 100,
      onHeaderCell: () => onHeaderClick('products_count'),
    },
    {
      title: (
        <TitleWithSort
          title={t('Total Spend')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'products_count'
          }
          isActive={sortingObj.column === 'products_count'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'products_count',
      key: 'products_count',
      align: 'center' as AlignType,
      width: 100,
      onHeaderCell: () => onHeaderClick('products_count'),
    },
   
    {
      title: t('text-quote-title'),
      key: 'settings',
      align: 'center' as AlignType,
      width: 80,
      render: (id: string, { settings, is_active }: Shop) => {
        return Boolean(settings?.askForAQuote?.enable) &&
          !Boolean(is_active) &&
          Boolean(isMultiCommissionRate) ? (
          <Badge
            textKey={settings?.askForAQuote?.quote}
            color="bg-accent/10 text-accent"
          />
        ) : (
          ''
        );
      },
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'left' as AlignType,
      width: 120,
      render: (
        id: string,
        { slug, is_active, owner_id, ownership_history, settings }: Shop,
      ) => {
        return (
          <div className="flex gap-3" style={{ minWidth: '120px' }}>
            {/* Edit Action - Image/Icon with Tooltip */}
            <Image
              src={edit} // Replace with your actual icon/image path
              alt="Edit"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              onClick={() => handleUpdateCompanyData(slug)}
            />

            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              className='cursor-pointer'
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              onClick={() => handleDeleteCompanyData(id)}
            />
            <Image
              src={approve} // Replace with your actual icon/image path
              alt="Approve"
              className='cursor-pointer'
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
            />
            {/* Additional Actions (if needed) */}
            {/* Example: Remove Action */}
            <Image
              src={remove_cut} // Replace with your actual icon/image path
              alt="Remove"
              className='cursor-pointer'
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
            />
            <Image
              src={arrow} // Replace with your actual icon/image path
              alt="arrow"
              className='cursor-pointer'
              width={10} // Set the width for the icon
              height={10} // Set the height for the icon
              onClick={() => handleExpandToggle(id)}
            />
          </div>
        );
      },
    },
  ];

  if (!Boolean(isMultiCommissionRate)) {
    columns = columns?.filter((column) => column?.key !== 'settings');
  }

  if (!permissions?.includes(SUPER_ADMIN)) {
    columns = columns?.filter((column) => column?.key !== 'actions');
  }

  const customerData = {
    name: 'Angelina Lopes',
    mobileNumber: '(0452) 999 999',
    abnNumber: '64 284 550 602',
    billingAddress: '184, Raven Street, Brisbane, 4000',
    totalOutstanding: '$600.00',
    orders: [
      {
        orderNumber: '1226362373773',
        orderType: 'Online',
        orderAmount: '$456.00',
        orderStatus: 'Completed',
        orderDate: '12/02/2024',
        statusColor: 'bg-green-100 text-green-700',
      },
      {
        orderNumber: '1226362373773',
        orderType: 'Offline',
        orderAmount: '$456.00',
        orderStatus: 'Open',
        orderDate: '12/02/2024',
        statusColor: 'bg-yellow-100 text-yellow-700',
      },
      {
        orderNumber: '1226362373773',
        orderType: 'Online',
        orderAmount: '$456.00',
        orderStatus: 'Cancelled',
        orderDate: '12/02/2024',
        statusColor: 'bg-red-100 text-red-700',
      },
    ],
  };
  const {
    name,
    mobileNumber,
    abnNumber,
    billingAddress,
    totalOutstanding,
    orders,
  } = customerData;
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          expandedRowRender={(record) =>
            record?.id &&
            expandedRowKeys.includes(record.id) && (
              <div
                className=" flex bg-white  p-4 rounded m-2 pl-14"
                style={{ border: '1px solid #9E9E9E' }}
              >
                <div className="grid grid-cols-1 gap-4 mr-20">
                  <div className=" mt-8">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold">Name:</p>
                      <p>{name}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">Mobile Number:</p>
                      <p>{mobileNumber}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">ABN Number:</p>
                      <p>{abnNumber}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">Billing Address:</p>
                      <p className="w-28 ml-14 text-right">{billingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="mt-6">
                  <h2 className="font-bold text-lg mb-2 text-black">
                    Recent Orders
                  </h2>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 text-black">Order Number</th>
                        <th className="py-2 text-black">Order Type</th>
                        <th className="py-2 text-black">Order Amt.</th>
                        <th className="py-2 text-black">Order Status</th>
                        <th className="py-2 text-black">Order Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{order.orderNumber}</td>
                          <td className="py-2">{order.orderType}</td>
                          <td className="py-2">{order.orderAmount}</td>
                          <td className="py-2">
                            <span
                              className={`px-3 py-1 rounded-full ${order.statusColor}`}
                            >
                              {order?.orderStatus}
                            </span>
                          </td>
                          <td className="py-2">{order?.orderDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* View All Orders Button */}
                <div className="mt-4 text-right mr-10">
                  <button className="px-4 py-2 border border-black  hover:bg-gray-300 rounded">
                    View all Orders
                  </button>
                </div>
                <div className="text-right flex mt-4 gap-10">
                  <p className="text-gray-500">Total Outstanding</p>
                  <p className="text-gray-500">{totalOutstanding}</p>
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
            <div className="flex flex-col  items-center py-7">
              <NoDataFound className="w-52" />
              <div className="mb-1 pt-6 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={shops}
          rowKey="id"
          scroll={{ x: 1000 }}
        />
      </div>

      {!!paginatorInfo?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={paginatorInfo.total}
            current={paginatorInfo.currentPage}
            pageSize={paginatorInfo.perPage}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default ShopList;
