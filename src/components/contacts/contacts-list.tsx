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
import { EditFillIcon, EditIcon } from '../icons/edit';
import { AlignType } from 'rc-table/lib/interface';
import { TrashIcon } from '../icons/trash';
import { useDeleteUniformMutation } from '@/data/uniforms';
import { useDeleteContactMutation } from '@/data/contact';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  contacts: Coupon[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  setUniFormId: string;
  setShowPopup: any;
  showPopup: any;
};
const ContactsList = ({
  contacts,
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
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState('');

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
  const { mutate: deleteShop } = useDeleteContactMutation();

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
  const handleClose = () => {
    setShowModal(false);
  };
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
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 120,
      onHeaderCell: () => onHeaderClick('id'),
      render: (_: any, record: { name: any }) => {
        console.log();
        console.log('recordrecordrecordrecord', record);

        return (
          <>
            {/* <input type="checkbox" /> */}
            {/* <Link href="/uniforms/create" className="ml-2"> */}
            {record.name}
            {/* </Link> */}
          </>
        );
      },
      // render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    },
    {
      title: t('Subject'),
      dataIndex: 'subject',
      key: 'subject',
      align: alignLeft as AlignType,
      width: 150,
      render: (subject: any) => `${subject}`,
    },

    // {
    //   title: t('Question'),
    //   dataIndex: 'question',
    //   key: 'question',
    //   align: alignLeft as AlignType,
    //   width: 400,
    //   render: (question: any) => `${question}`,
    // },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
      width: 400,
      render: (question: string) => (
        <span
          style={{ color: 'blue', cursor: 'pointer' }}
          onClick={() => {
            setSelectedQuestion(question);
            setShowModal(true);
          }}
        >
          {question}
        </span>
      ),
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 260,
      render: (slug: string, id: any) => {
        const deleteId = id?.id;
        console.log('iiddddd', deleteId);
        const [isModalOpen, setIsModalOpen] = useState(false);

        // Open Modal
        const openDeleteModal = () => {
          setIsModalOpen(true);
        };

        // Close Modal
        const closeDeleteModal = () => {
          setIsModalOpen(false);
        };
        // Handle Delete
        const handledeleteUniformList = () => {
          //@ts-ignore
          deleteShop({
            // @ts-ignore
            id: deleteId,
          });

          setIsModalOpen(false);
        };
        return (
          <div className="flex gap-2">
            {/* Edit Icon */}
            {/* @ts-ignore */}
            {/* <div
              onClick={() => {
                setShowPopup(!showPopup);
              }}
            >
              <EditIcon width={15} />
            </div> */}

            <button
              onClick={openDeleteModal}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t('common:text-delete')}
            >
              <TrashIcon width={14} />
            </button>
            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to delete Uniform List?
                  </h2>
                  {/* <p className="mt-2 text-sm text-gray-600">
                This action cannot be undone.
              </p> */}
                  <div className="mt-4 flex justify-end gap-3">
                    {/* Cancel Button */}
                    <button
                      className="px-4 py-2 text-gray-800 bg-gray-200 rounded hover:bg-gray-300"
                      onClick={closeDeleteModal}
                    >
                      Cancel
                    </button>
                    {/* Delete Button */}
                    <button
                      className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                      onClick={handledeleteUniformList}
                    >
                      Delete
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
          data={contacts}
          rowKey="id"
          scroll={{ x: 900 }}
        />
        {showModal && (
          <div
            onClick={handleClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100vw',
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 8,
                maxWidth: '500px',
                margin: '100px auto',
                position: 'relative',
              }}
            >
              <button
                onClick={handleClose}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                }}
              >
                &times;
              </button>
              <h3 style={{ fontWeight: 'bold' }}>Question Detail</h3>
              <p style={{ marginTop: '20px' }}>{selectedQuestion}</p>
            </div>
          </div>
        )}
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

export default ContactsList;
