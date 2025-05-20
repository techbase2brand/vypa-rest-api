import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { Shop, SortOrder } from '@/types';
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
import { EditFillIcon, EditIcon } from '../icons/edit';
import { AlignType } from 'rc-table/lib/interface';
import { TrashIcon } from '../icons/trash';
import { useDeleteUniformMutation } from '@/data/uniforms';
import approve from '@/assets/placeholders/approve.svg';
import remove_cut from '@/assets/placeholders/remove.svg';
import { useApproveRequestMutation, useDisApproveRequestMutation } from '@/data/assign-budget';

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
  setUniFormId: string;
  setShowPopup: any;
  showPopup: any;
};
const BudgetList = ({
  coupons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  setUniFormId,
  setShowPopup,
  showPopup,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isAllChecked, setIsAllChecked] = useState(false);
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
  const { mutate: deleteShop } = useDeleteUniformMutation();
  const { mutate: approveb } = useApproveRequestMutation();
    const { mutate: disapprove } = useDisApproveRequestMutation();

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
        <>
          {/* <input type="checkbox" className="cursor-pointer mr-2" /> */}
          <TitleWithSort
            title="Employee Name"
            ascending={
              sortingObj.sort === SortOrder.Asc && sortingObj.column === 'id'
            }
            isActive={sortingObj.column === 'id'}
          />
        </>
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (_: any, record: { id: number }) => {
        console.log("reedddddd",record);
        
        return (
          <>
            {/* <input type="checkbox" /> */}
            {/* <Link href="/uniforms/create" className="ml-2"> */}
            <div  className="ml-2">
              {/* @ts-ignore */}
              {record.user.name}
            </div>
          </>
        );
      },
      // render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('Request Budget'),
      dataIndex: 'points_requested',
      key: 'points_requested',
      align: alignLeft as AlignType,
      width: 100,
      render: (points_requested: any) => `${points_requested}`,
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 260,
      render: (
             id: string,
             { slug, is_active, owner_id, ownership_history, settings }: Shop,
           ) => {
        console.log("idddddd",id);
        
        const ApproveId = id;

        const [approvModalOpen, setApproveModalOpen] = useState(false);
        const [disapprovModalOpen, setDisapproveModalOpen] = useState(false);

        // Open disapprove Modal
        const openDisapproveModal = () => {
          setDisapproveModalOpen(true);
        };
        // Close Modal
        const closeDisapproveModal = () => {
          setDisapproveModalOpen(false);
        };
        const handleRemove = () => {
          disapprove({
            //@ts-ignore
            id,
          });
          setDisapproveModalOpen(false);
        };

        // Open approve Modal
        const openapproveModal = () => {
          setApproveModalOpen(true);
        };
        // Close Modal
        const closeapproveModal = () => {
          setApproveModalOpen(false);
        };

        const handleApprove = () => {
          //@ts-ignore
          approveb({
            id,
          });
          setApproveModalOpen(false);
        };
        return (
          <div className="flex gap-2">
            {/* @ts-ignore */}
            <Image
              src={approve} // Path for the "Approve" icon
              alt="Approve"
              className="cursor-pointer"
              width={15}
              height={15}
              onClick={openapproveModal}
            />
            <Image
              src={remove_cut} // Path for the "Remove" icon
              alt="Remove"
              className="cursor-pointer"
              width={15}
              height={15}
              onClick={openDisapproveModal}
            />
            {/* Modal */}
            {disapprovModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to Disapprove Budget?
                  </h2>
                  {/* <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p> */}
                  <div className="mt-4 flex justify-end gap-3">
                    {/* Cancel Button */}
                    <button
                      className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={closeDisapproveModal}
                    >
                      Cancel
                    </button>
                    {/* Delete Button */}
                    <button
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={handleRemove}
                    >
                      Disapprove
                    </button>
                  </div>
                </div>
              </div>
            )}
            {approvModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to Approve Budget?
                  </h2>
                  {/* <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p> */}
                  <div className="mt-4 flex justify-end gap-3">
                    {/* Cancel Button */}
                    <button
                      className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={closeapproveModal}
                    >
                      Cancel
                    </button>
                    {/* Delete Button */}
                    <button
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={handleApprove}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
