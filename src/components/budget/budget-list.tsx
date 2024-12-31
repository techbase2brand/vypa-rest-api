import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { SortOrder } from '@/types';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Coupon, MappedPaginatorInfo, Attachment } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import Badge from '../ui/badge/badge';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import LinkButton from '../ui/link-button';
import Link from 'next/link';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  coupons: Coupon[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const BudgetList = ({
  coupons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
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
          title='ID'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
          }
          isActive={sortingObj.column === 'id'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (_: any, record: { id: number }) => (
        <>
          <Link
            href='#'
            className="ml-2"
          >
            #{record.id}
          </Link>
        </>
      ),
      // render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title='Employee  Name'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Employee',
      key: 'Employee',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap" >
            John
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Email'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Employee',
      key: 'Employee',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap" >
            John@gmail.com
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Assign Date'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Date',
      key: 'Date',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap" >
            Aug 25,2024
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Status'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Status',
      key: 'Status',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap" style={{ color: '#1A932E' }} >
            Approved
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Assign Budget'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Budget',
      key: 'Budget',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap"   >
            $456.00
          </span>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'code',
      key: 'actions',
      align: 'left',
      width: 260,
      render: (slug: string, record: Coupon) => (
        <div className='flex gap-3 items-center'>
          <a href="">
            <svg width="23" height="15" viewBox="0 0 23 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.329 6.58504C22.1324 6.31619 17.4495 0.00195312 11.4687 0.00195312C5.48777 0.00195312 0.804681 6.31619 0.608356 6.58479C0.422215 6.83985 0.422215 7.18579 0.608356 7.44086C0.804681 7.70971 5.48777 14.0239 11.4687 14.0239C17.4495 14.0239 22.1324 7.70967 22.329 7.44107C22.5154 7.18605 22.5154 6.83985 22.329 6.58504ZM11.4687 12.5734C7.0631 12.5734 3.24742 8.38252 2.1179 7.01246C3.24596 5.64119 7.05364 1.4525 11.4687 1.4525C15.874 1.4525 19.6894 5.64265 20.8194 7.01344C19.6914 8.38467 15.8837 12.5734 11.4687 12.5734Z" fill="black" />
              <path d="M11.4689 2.6582C9.06939 2.6582 7.11719 4.61041 7.11719 7.00988C7.11719 9.40934 9.06939 11.3615 11.4689 11.3615C13.8683 11.3615 15.8205 9.40934 15.8205 7.00988C15.8205 4.61041 13.8683 2.6582 11.4689 2.6582ZM11.4689 9.91096C9.86913 9.91096 8.56777 8.60956 8.56777 7.00988C8.56777 5.41019 9.86917 4.10879 11.4689 4.10879C13.0685 4.10879 14.3699 5.41019 14.3699 7.00988C14.3699 8.60956 13.0686 9.91096 11.4689 9.91096Z" fill="black" />
            </svg>
          </a>
          <a href="">
            <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.21877 0.00195408C1.07043 0.00195026 0.925424 0.0312729 0.802083 0.0862131C0.678742 0.141153 0.582609 0.219245 0.525842 0.31061C0.469074 0.401975 0.454222 0.502511 0.483163 0.599504C0.512104 0.696497 0.583539 0.78559 0.688433 0.855516L7.65805 5.50195L0.688433 10.1484C0.547778 10.2421 0.468758 10.3693 0.468758 10.5019C0.468758 10.6346 0.547778 10.7617 0.688433 10.8555C0.829088 10.9493 1.01986 11.002 1.21877 11.002C1.41769 11.002 1.60846 10.9493 1.74911 10.8555L9.24907 5.85551C9.31872 5.80908 9.37396 5.75396 9.41166 5.69329C9.44935 5.63263 9.46875 5.56761 9.46875 5.50195C9.46875 5.43628 9.44935 5.37126 9.41166 5.3106C9.37396 5.24993 9.31872 5.19482 9.24907 5.14839L1.74911 0.148392C1.67954 0.101894 1.59688 0.0650196 1.50586 0.0398893C1.41485 0.0147581 1.31728 0.00186634 1.21877 0.00195408Z" fill="black" />
            </svg>
          </a>
        </div>
      ),
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
              <div className="pt-6 mb-1 text-base font-semibold text-heading">
                {t('table:empty-table-data')}
              </div>
              <p className="text-[13px]">{t('table:empty-table-sorry-text')}</p>
            </div>
          )}
          data={coupons}
          rowKey="id"
          scroll={{ x: 900 }}
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

export default BudgetList;
