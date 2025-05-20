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
import { useDeleteEmployeeGroupMutation } from '@/data/employee-group';

type IProps = {
  orders: Order[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

const EmployeeGroupList = ({
  orders,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  // const { data, paginatorInfo } = orders! ?? {};
  const router = useRouter();
  const { t } = useTranslation();
  const { mutate: deletegroup } = useDeleteEmployeeGroupMutation();

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

  const columns = [
    // {
    //   // title: (
    //   //   <input
    //   //     type="checkbox"
    //   //     checked={isAllChecked}
    //   //     onChange={handleAllCheckboxChange}
    //   //     className="cursor-pointer"
    //   //   />
    //   // ),
    //   title:'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center' as const,
    //   width: 10,
    //   render: (id: number) => (
    //     <input
    //       type="checkbox"
    //       checked={selectedRows.includes(id)}
    //       onChange={() => handleCheckboxChange(id)}
    //       className="cursor-pointer"
    //     />
    //   ),
    // },
    {
      title: t('Group Name'),
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 200,
    },
    {
      title: t('Groups Type'),
      dataIndex: 'tag',
      key: 'tag',
      align: alignLeft,
      width: 200,
    },
    
    {
      title: t('No. of Employee/Tags'),
      dataIndex: 'data', // This points to your data property
      key: 'noOfEmployeesTags',
      align: 'center',
      render: (_: any, record: any) => {
        const employeeCount = record.selectedEmployees?.length || 0;
        const tagCount = record.selectedTags?.length || 0;
        return (
          <span>
            {employeeCount} / {tagCount} 
          </span>
        );
      },
    },
    {
      title: t('Actions'),
      dataIndex: 'id',
      key: 'actions',
      align: alignRight,
      width: 120,
      render: (id: string, slug: any) => {
        // const currentButtonLoading = !!loading && loading === order?.shop_id;
        console.log('slug', slug.slug);

        const [isModalOpen, setIsModalOpen] = useState(false);

        // Open Modal
        const openDeleteModal = () => {
          setIsModalOpen(true);
        };

        // Close Modal
        const closeDeleteModal = () => {
          setIsModalOpen(false);
        };
        const handleUpdate = () => {
          // console.log("slug?.slug",slug?.slug);

          // console.log('slugslug', slug);
          // router.push();
          router.push({
            pathname: `/employee-group/${slug?.slug}/edit`,
            //@ts-ignore
            // query: { item: JSON.stringify(slug) },
          });
        };

        // Handle Delete
        const handledeleteEmployee = () => {
          //@ts-ignore
          deletegroup({
            id,
          });

          setIsModalOpen(false);
        };

        return (
          <>
            <div className="flex gap-2">
              <Image
                src={edit} // Replace with your actual icon/image path
                alt="Edit"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
                className="cursor-pointer hover:text-blue-500"
                onClick={handleUpdate}
              />

              {/* Transfer Ownership Action - Image/Icon with Tooltip */}
              <Image
                src={remove} // Replace with your actual icon/image path
                alt="Transfer Ownership"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
                onClick={openDeleteModal}
              />

              {/* Modal */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 text-left">
                      Are you sure you want to delete Group?
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
                        onClick={handledeleteEmployee}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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

export default EmployeeGroupList;
