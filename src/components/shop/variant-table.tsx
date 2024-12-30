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

const VariantTable = ({
  shops,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  isMultiCommissionRate,
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

  // Toggle individual checkbox
  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id],
    );
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
        <TitleWithSort
          title='Image'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="flex items-center">
          <div className="relative flex items-center justify-center aspect-square h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border-200/80 bg-gray-100 me-2.5">
          <label className='text-center'>
                    <input className="text-sm cursor-pointer w-36 hidden" type="file" multiple />
                    <div className="text   text-white  rounded font-semibold cursor-pointer p-1">
                    <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.752855 6.63728V12.6091C0.776644 13.2464 1.0517 13.8484 1.51793 14.2835C1.98416 14.7187 2.60367 14.9516 3.2411 14.9314H16.5118C17.1492 14.9516 17.7687 14.7187 18.2349 14.2835C18.7012 13.8484 18.9762 13.2464 19 12.6091V6.63728C19 6.4173 18.9126 6.20634 18.7571 6.05079C18.6015 5.89525 18.3906 5.80786 18.1706 5.80786C17.9506 5.80786 17.7396 5.89525 17.5841 6.05079C17.4286 6.20634 17.3412 6.4173 17.3412 6.63728V12.6091C17.3142 12.8049 17.2132 12.9829 17.0589 13.1063C16.9045 13.2298 16.7087 13.2893 16.5118 13.2726H3.2411C3.04417 13.2893 2.84833 13.2298 2.69399 13.1063C2.53966 12.9829 2.43861 12.8049 2.41169 12.6091V6.63728C2.41169 6.4173 2.3243 6.20634 2.16876 6.05079C2.01321 5.89525 1.80225 5.80786 1.58227 5.80786C1.3623 5.80786 1.15133 5.89525 0.995785 6.05079C0.840239 6.20634 0.752855 6.4173 0.752855 6.63728ZM11.8753 4.00803L10.7058 2.83026V9.95494C10.7058 10.1749 10.6185 10.3859 10.4629 10.5414C10.3074 10.697 10.0964 10.7844 9.87643 10.7844C9.65645 10.7844 9.44549 10.697 9.28994 10.5414C9.1344 10.3859 9.04701 10.1749 9.04701 9.95494V2.83026L7.87754 4.00803C7.80043 4.08577 7.7087 4.14747 7.60763 4.18958C7.50655 4.23169 7.39814 4.25337 7.28865 4.25337C7.17916 4.25337 7.07075 4.23169 6.96968 4.18958C6.8686 4.14747 6.77687 4.08577 6.69977 4.00803C6.62289 3.93053 6.56208 3.83862 6.5208 3.73756C6.47953 3.63651 6.4586 3.5283 6.45923 3.41915C6.4586 3.30999 6.47953 3.20178 6.5208 3.10073C6.56208 2.99967 6.62289 2.90776 6.69977 2.83026L9.28754 0.242484C9.42956 0.100737 9.61816 0.0152809 9.81837 0.00195312H9.97596C10.1419 0.0216726 10.298 0.091056 10.4238 0.201013H10.4653L13.0531 2.83026C13.2093 2.98644 13.297 3.19827 13.297 3.41915C13.297 3.64002 13.2093 3.85185 13.0531 4.00803C12.8969 4.16421 12.6851 4.25196 12.4642 4.25196C12.2433 4.25196 12.0315 4.16421 11.8753 4.00803Z" fill="black"></path></svg>
                    </div>
                </label>
          </div>
          {/* <Link href={`/${slug}`}> */}
          <span className="truncate whitespace-nowrap font-medium">{name}</span>
          {/* </Link> */}
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Combination'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'Sku',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="  items-center"> 
          <span className="truncate whitespace-nowrap font-medium">Test</span>
          
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='SKU'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'Sku',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="  items-center">
       <input type="text" className='block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-white-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mx-1 h-8 w-18 md:w-20 lg:w-20 p-2'   />
        
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Barcode'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'Barcode',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="  items-center">
       <input type="text" className='block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-white-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mx-1 h-8 w-18 md:w-20 lg:w-20 p-2'   />
        
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Price'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'Price',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="  items-center">
       <input type="text" className='block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-white-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mx-1 h-8 w-18 md:w-20 lg:w-20 p-2'   />
        
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Sale Price'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'Sale Price',
      key: 'name',
      align: alignLeft as AlignType,
      width: 250,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: any, { slug, logo }: any) => (
        <div className="  items-center">
       <input type="text" className='block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-white-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mx-1 h-8 w-18 md:w-20 lg:w-20 p-2'   />
        
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Quantity'
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
       <input type="text" className='block w-full h-12 border px-3 py-1 text-sm focus:outline-none dark:text-gray-300 leading-5 rounded-md bg-white-100 focus:bg-white dark:focus:bg-gray-700 focus:border-gray-200 border-gray-200 dark:border-gray-600 dark:focus:border-gray-500 dark:bg-gray-700 mx-1 h-8 w-18 md:w-20 lg:w-20 p-2'   />
      ),
    },
 
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight as AlignType,
      width: 120,
      render: (
        id: string,
        { slug, is_active, owner_id, ownership_history, settings }: Shop,
      ) => {
        return (
          <div className="flex gap-1"> 
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              //   onClick={() => handleDeleteCompanyData(id)}
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
        <div className="flex items-center justify-end mb-5">
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

export default VariantTable;
