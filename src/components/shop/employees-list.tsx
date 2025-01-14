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

const EmployeesList = ({
  shops,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  isMultiCommissionRate,
  //@ts-ignore
  setShowDiv,
  //@ts-ignore
  openOffcanvas,
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

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) => {
      const isIdIncluded = prevSelected.includes(id);
      if (isIdIncluded) {
        setShowDiv(false);
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        setShowDiv(true);
        return [...prevSelected, id];
      }
    });
  };
  const handleUpdateCompanyData = (slug: any) => {
    console.log('handleUpdateCompanyDataidd');
    router.push(`/${slug}/edit`);
  };
  const handleDeleteCompanyData = (id: any) => {
    console.log('handleUpdateCompanyDataidd');
    deleteShop({
      id,
    });
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
      setShowDiv(false);
    } else {
      const allIds = shops?.map((item) => item.id);
      // @ts-ignore
      setSelectedRows(allIds);
      setShowDiv(true);
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
      title: (
        <TitleWithSort
          title={t('id')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 100,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { id, slug, logo }: any) => (
        <div className="flex items-center">
          {/* <Link href={`/${slug}`}> */}
          <span className="truncate whitespace-nowrap font-medium">{id}</span>
          {/* </Link> */}
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Employee Name')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft as AlignType,
      width: 100,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="flex items-center">
          {/* <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5"> */}
          {/* <Image
              src={logo?.thumbnail ?? siteSettings?.product?.placeholder}
              alt={name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            /> */}
          {/* </div> */}
          {/* <Link href={`/${slug}`}> */}
          <span className="truncate whitespace-nowrap font-medium">{name}</span>
          {/* </Link> */}
        </div>
      ),
    },
    // {
    //   title: t('Employee Class'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft as AlignType,
    //   width: 130,
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
    {
      title: t('Gender'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 130,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },

    {
      title: t('Start Date'),
      dataIndex: 'id',
      key: 'id',
      align: alignLeft as AlignType,
      width: 100,
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('End Date')}
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
      width: 100,
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (is_active: boolean) => <span>0</span>,
    },
    {
      title: (
        <TitleWithSort
          title={t('Customer Status')}
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
      width: 100,
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
          title={t('Budget')}
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
      render: (id: number) => `$0`,
      onHeaderCell: () => onHeaderClick('products_count'),
    },
    {
      title: (
        <TitleWithSort
          title={t('Job Title')}
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
          <div className="flex gap-3">
            {/* Edit Action - Image/Icon with Tooltip */}
            <Image
              title="edit"
              src={edit} // Replace with your actual icon/image path
              alt="Edit"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              // onClick={openOffcanvas}
              onClick={() => openOffcanvas({ id, slug, is_active, owner_id, ownership_history, settings })}
            />
            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              //   onClick={() => handleDeleteCompanyData(id)}
            />
            <Image
              src={arrow} // Replace with your actual icon/image path
              alt="arrow"
              width={10} // Set the width for the icon
              height={10} // Set the height for the icon
              onClick={() => handleExpandToggle(id)}
              className={`cursor-pointer ${expandedRowKeys.includes(id) ? 'rotate-icon' : ''}`}
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
  const tabledata = [
    { label: 'Date of birth', value: '10/05/2000' },
    { label: 'Branch', value: 'Rapidbyte Sydney' },
    { label: 'Department', value: 'Warehouse' },
    { label: 'Address Type', value: '184, Raven Street, Brisbane, 4000' },
    { label: 'Phone', value: '9988776655' },
    { label: 'Country', value: 'AU' },
    { label: 'State', value: 'Victoria' },
    { label: 'Jurisdiction', value: 'AU' },
    { label: 'Postal Code', value: '3000' },
    { label: 'Levy Rate Code', value: 'VIC' },
    { label: 'Payroll Posting Class', value: 'Accounting' },
    { label: 'Calendar', value: 'AU Eastern' },
    { label: 'Payment Summary type', value: 'Individual Non-business' },
    { label: 'Residency', value: 'Australian' },
    { label: 'Employment Basis', value: 'Full-Time' },
    { label: 'Tax Free Threshold', value: 'NotClaimed' },
    { label: 'TFN Declaration Status', value: 'Submitted' },
    { label: 'Contract Type', value: 'Individual' },
    { label: 'Withholding Variation', value: 'No' },
    { label: 'Tax Scale', value: '4' },
  ];
  const gridData = [
    tabledata.slice(0, 5),
    tabledata.slice(5, 10),
    tabledata.slice(10, 15),
    tabledata.slice(15, 20),
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          expandedRowRender={(record) =>
            // @ts-ignore
            expandedRowKeys.includes(record?.id) && (
              <div className=" flex bg-white  p-4 shadow">
                <div className="grid grid-cols-4 gap-4 border border-gray-300 bg-white rounded-md">
                  {gridData?.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className={`p-6 ${columnIndex < 3 ? 'border-r border-gray-300' : ''}`}
                    >
                      {column?.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
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

export default EmployeesList;
