import LanguageSwitcher from '@/components/ui/lang-action/action';
import Pagination from '@/components/ui/pagination';
import { AlignType, Table } from '@/components/ui/table';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import { MappedPaginatorInfo, RefundReason, Shop, SortOrder } from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import ActionButtons from '../common/action-buttons';
import Link from 'next/link';
import { Eye } from '../icons/eye-icon';
import Image from 'next/image';
import approve from '@/assets/placeholders/approve.svg';
import remove_cut from '@/assets/placeholders/remove.svg';
import {
  useApproveEmployeeMutation,
  useDisApproveEmployeeMutation,
} from '@/data/employee';
import {
  useApproveRefundMutation,
  useDisApproveRefundMutation,
} from '@/data/refund-reason';
import Badge from '../ui/badge/badge';

type IProps = {
  refundReasons: RefundReason[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const RefundReasonList = ({
  refundReasons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
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

  let columns = [
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-id')}
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
      render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-title')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      align: alignLeft,
      render: (name: string) => <span className="font-medium">{name}</span>,
      onHeaderCell: () => onHeaderClick('name'),
    },
    {
      title: (
        <TitleWithSort
          title={t('table:table-item-slug')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'slug'
          }
          isActive={sortingObj.column === 'slug'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'slug',
      key: 'slug',
      width: 200,
      ellipsis: true,
      align: alignLeft,
      onHeaderCell: () => onHeaderClick('slug'),
    },
    {
      title: (
        <TitleWithSort
          title={t('Refund Status')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      width: 100,
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (
        id: string,
        { slug, is_active, owner_id, ownership_history, settings }: Shop,
      ) => {
        return (
          <>
            <div>
              <Badge
                textKey={
                  is_active ? 'common:text-active' : 'common:text-inactive'
                }
                color={
                  is_active
                    ? 'bg-customGreenLight/20 !text-customGreenLight'
                    : 'bg-status-failed/10 text-status-failed'
                }
              />
            </div>
          </>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'right' as AlignType,
      render: (
        slug: string,
        record: RefundReason,
        // id: string,
      ) => {
        console.log('id', record);
        const id = record?.id;
        //@ts-ignore
        const is_active = record?.is_active;
        const { mutate: approveRefund } = useApproveRefundMutation();
        const { mutate: disapprove } = useDisApproveRefundMutation();
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
          approveRefund({
            id,
          });
          setApproveModalOpen(false);
        };
        return (
          <div className="flex gap-4">
            <div className="mt-1">
              <Link
                href={{
                  pathname: 'returns-details',
                  query: { slug: slug }, // Add your query params here
                }}
                className="text-base transition duration-200 hover:text-heading"
                title={t('common:text-view')}
                // locale={customLocale}
              >
                <Eye className="w-6 h-6" />
              </Link>
            </div>

            <LanguageSwitcher
              slug={slug}
              record={record}
              deleteModalView="DELETE_REFUND_REASON"
              routes={Routes?.return}
            />
            {is_active ? (
              <Image
                src={remove_cut} // Path for the "Remove" icon
                alt="Remove"
                className="cursor-pointer"
                width={15}
                height={15}
                onClick={openDisapproveModal}
              />
            ) : (
              <Image
                src={approve} // Path for the "Approve" icon
                alt="Approve"
                className="cursor-pointer"
                width={15}
                height={15}
                onClick={openapproveModal}
              />
            )}
            {disapprovModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to Disapprove refund?
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
                    Are you sure you want to Approve refund?
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
          // @ts-ignore
          columns={columns}
          emptyText={t('table:empty-table-data')}
          data={refundReasons}
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

export default RefundReasonList;
