import { Table } from '@/components/ui/table';
import ActionButtons from '@/components/common/action-buttons';
import { SortOrder } from '@/types';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import Pagination from '@/components/ui/pagination';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useIsRTL } from '@/utils/locals';
import usePrice from '@/utils/use-price';
import { Routes } from '@/config/routes';
import { NoDataFound } from '@/components/icons/no-data-found';
import Image from 'next/image';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';
dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export type IProps = {
  // refunds: Refund[] | undefined;
  refunds: any;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const RefundList = ({ refunds, onSort, onOrder, onPagination }: IProps) => {
  const tableData = [
    {
      id: 1,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 2,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 3,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 4,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 5,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 6,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 7,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
    {
      id: 8,
      orderNo: "#12456",
      companyName: "ABCD",
      customerCode: "123456",
      nameOfOriginator: "0203",
      contactNumber: "02 124578981",
      email: "abc@gmail.com",
      date: "2/2/20224",
    },
  ];
  
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = router;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });

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
        <TitleWithSort
          title={t('Order No')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'orderNo',
      key: 'id',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (id: number) => `${id}`,
    },
    {
      title: t('Company Name'),
      dataIndex: 'companyName',
      key: 'refund_reason_name',
      align: alignLeft,
      ellipsis: true,
      width: 150,
      render: (companyName: any, record: any) => (
        <span className="whitespace-nowrap">{"companyName"}</span>
      ),
    },
    {
      title: t('Customer Code'),
      dataIndex: 'customerCode',
      key: 'customer_email',
      align: 'center',
      width: 150,
      render: (customerCode: any) => (
        <span className="whitespace-nowrap">{customerCode}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Name of Originator')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'amount'
          }
          isActive={sortingObj.column === 'amount'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'nameOfOriginator',
      key: 'amount',
      align: 'center',
      width: 180,
      onHeaderCell: () => onHeaderClick('amount'),
      render: function Render(nameOfOriginator: any) {
       
        return <span>{nameOfOriginator}</span>;
      },
    },
    {
      title: t('Contact Number'),
      dataIndex: 'contactNumber',
      key: 'tracking_number',
      align: 'center',
      width: 120,
      render: (contactNumber: any) => (
        <span className="whitespace-nowrap">{contactNumber}</span>
      ),
    },

    {
      title: (
        <TitleWithSort
          title={t('Email')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'created_at'
          }
          isActive={sortingObj.column === 'created_at'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'email',
      key: 'created_at',
      align: 'center',
      width: 150,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('created_at'),
      render: (email: string) => (
        <span className="whitespace-nowrap capitalize">
          {email}
        </span>
      ),
    },
    {
      title: t('Date'),
      dataIndex: 'date',
      key: 'order_created_at',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (date: any) => (
        <span className="whitespace-nowrap capitalize">
          {date}
        </span>
      ),
    },
    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('table:table-item-status')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc && sortingObj.column === 'status'
    //       }
    //       isActive={sortingObj.column === 'status'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'status',
    //   key: 'status',
    //   align: 'center',
    //   width: 120,
    //   onHeaderCell: () => onHeaderClick('status'),
    // },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'center',
      width: 100,
      render: (id: string, refund: any) => {
        return (
          <div className="flex gap-3" style={{ minWidth: '120px' }}>
            {/* Edit Action - Image/Icon with Tooltip */}
            <ActionButtons
            id={id}
            detailsUrl={`${router.asPath}/${id}`}
            customLocale={refund?.order?.language}
          />
            <Image
              src={edit} // Replace with your actual icon/image path
              alt="Edit"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              // onClick={() => handleUpdateCompanyData(slug)}
            />

            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              className='cursor-pointer'
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              // onClick={() => handleDeleteCompanyData(id)}
            />
           
          </div>
         
        );
      },
    },
  ];

  return (
    <>
      <div className="mb-8 overflow-hidden rounded shadow">
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
          // data={refunds?.data}
          data={tableData}

          rowKey="id"
          scroll={{ x: 900 }}
        />
      </div>
      {!!refunds?.total && (
        <div className="flex items-center justify-end">
          <Pagination
            total={refunds?.total}
            current={refunds?.current_page}
            pageSize={refunds?.per_page}
            onChange={onPagination}
          />
        </div>
      )}
    </>
  );
};

export default RefundList;
