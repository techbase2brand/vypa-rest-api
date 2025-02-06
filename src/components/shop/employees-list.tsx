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
import { useEffect, useState } from 'react';
import { getAuthCredentials } from '@/utils/auth-utils';
import approve from '@/assets/placeholders/approve.svg';
import arrow from '@/assets/placeholders/arrow.svg';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';
import remove_cut from '@/assets/placeholders/remove.svg';
import phone from '@/assets/placeholders/phone.svg';
// import email from '@/assets/placeholders/email.svg';
import location from '@/assets/placeholders/location.svg';
import { useRouter } from 'next/router';
import { Routes } from '@/config/routes';
import {
  useApproveShopMutation,
  useDeleteShopMutation,
  useDisApproveShopMutation,
} from '@/data/shop';
import {
  deleteFromLocalStorage,
  getFromLocalStorage,
  updateLocalStorageItem,
} from '@/utils/localStorageUtils';
import {
  useApproveEmployeeMutation,
  useDeleteEmployeeMutation,
  useDisApproveEmployeeMutation,
  useUpdateEmployeeMutation,
} from '@/data/employee';

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
  //@ts-ignore
  data,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  isMultiCommissionRate,
  //@ts-ignore
  setShowDiv,
  //@ts-ignore
  setSelectedRows,
  //@ts-ignore
  selectedRows,
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
  const { mutate: deleteShop } = useDeleteEmployeeMutation();
  const { mutate: updateEmployee } = useUpdateEmployeeMutation();
  const { mutate: approveEmployee } = useApproveEmployeeMutation();
  const { mutate: disapprove } = useDisApproveEmployeeMutation();
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
    //@ts-ignore
    setSelectedRows((prevSelected) => {
      const isIdIncluded = prevSelected.includes(id);
      if (isIdIncluded) {
        setShowDiv(false);
        //@ts-ignore
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

  const handleAllCheckboxChange = () => {
    if (isAllChecked) {
      setSelectedRows([]);
      setShowDiv(false);
    } else {
      // @ts-ignore
      const allIds = data?.map((item) => item.id);
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

  // const handledeleteEmployee = (id: any) => {
  //   //@ts-ignore
  //   deleteFromLocalStorage(id);
  //   const updateData = getFromLocalStorage();
  //   setData(updateData);
  // };

  // const handleApprove = (id: any) => {
  //   //@ts-ignore
  //   approveEmployee({
  //     id,
  //   });
  // };

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
          checked={selectedRows?.includes(id)}
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
          title={t('Employee')}
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
          {/* <Link href="/employee-setup"> */}
          <span className="whitespace-nowrap font-medium  ">{name}</span>
          {/* </Link> */}
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title={t('Company')}
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}
        />
      ),
      dataIndex: 'shop',
      key: 'shop',
      align: alignLeft as AlignType,
      width: 100,
      className: 'cursor-pointer',
      onHeaderCell: () => onHeaderClick('name'),
      render: (shop: any, { slug, logo }: any) => (
        <div className="flex items-center">
          <span className="truncate whitespace-nowrap font-medium">
            {shop?.name}
          </span>
        </div>
      ),
    },

    // {
    //   title: t('Gender'),
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   align: alignLeft as AlignType,
    //   width: 130,
    //   render: (gender: any, { slug, logo }: any) => (
    //     <div className="flex items-center">
    //       <span className="truncate whitespace-nowrap font-medium">
    //         {gender}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      title: t('Start Date'),
      dataIndex: 'joining_date',
      key: 'joining_date',
      align: alignLeft as AlignType,
      width: 100,
      render: (joining_date: any, { slug, logo }: any) => {
        // Format the date to show only the date without time
        const date = new Date(joining_date);
        const formattedDate = date.toLocaleDateString(); // Adjust the format if needed

        return (
          <div className="flex items-center">
            <span className="truncate whitespace-nowrap font-medium">
              {formattedDate}
            </span>
          </div>
        );
      },
    },

    // {
    //   title: (
    //     <TitleWithSort
    //       title={t('End Date')}
    //       ascending={
    //         sortingObj.sort === SortOrder.Asc &&
    //         sortingObj.column === 'is_active'
    //       }
    //       isActive={sortingObj.column === 'is_active'}
    //     />
    //   ),
    //   className: 'cursor-pointer',
    //   dataIndex: 'joining_date',
    //   key: 'joining_date',
    //   align: 'center' as AlignType,
    //   width: 100,
    //   // onHeaderCell: () => onHeaderClick('is_active'),
    //   render: (joining_date: any, { slug, logo }: any) => (
    //     <div className="flex items-center">
    //       <span className="truncate whitespace-nowrap font-medium">{'NA'}</span>
    //     </div>
    //   ),
    // },
    {
      title: (
        <TitleWithSort
          title={t('Status')}
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
              ? 'bg-customGreenLight/20 !text-customGreenLight'
              : 'bg-status-failed/10 text-status-failed'
          }
        />
      ),
    },


    {
      title: t('Budget'),
      dataIndex: 'wallet',
      key: 'wallet',
      align: alignLeft as AlignType,
      width: 100,
      render: (wallet: any, { slug, logo }: any) => {
        // Format the date to show only the date without time
      

        return (
          <div className="flex items-center">
            <span className="truncate whitespace-nowrap font-medium">
            ${wallet?.total_points ?? '0.00'}
            </span>
          </div>
        );
      },
    },


    {
      title: t('Available Points'),
      dataIndex: 'wallet',
      key: 'wallet',
      align: alignLeft as AlignType,
      width: 100,
      render: (wallet: any, { slug, logo }: any) => {
        // Format the date to show only the date without time
      

        return (
          <div className="flex items-center">
            <span className="truncate whitespace-nowrap font-medium">
            ${wallet?.available_points ?? '0.00'}
            </span>
          </div>
        );
      },
    },
  
    {
      title: t('Used Point'),
      dataIndex: 'wallet',
      key: 'wallet',
      align: alignLeft as AlignType,
      width: 100,
      render: (wallet: any, { slug, logo }: any) => {
        // Format the date to show only the date without time
      

        return (
          <div className="flex items-center">
            <span className="truncate whitespace-nowrap font-medium">
            ${wallet?.points_used ?? '0.00'}
            </span>
          </div>
        );
      },
    },
  


    {
      title: t('Expiry Date'),
      dataIndex: 'wallet',
      key: 'wallet',
      align: alignLeft as AlignType,
      width: 100,
      render: (wallet: any, { slug, logo }: any) => {
        // Format the date to show only the date without time
      

        return (
          <div className="flex items-center">
            <span className="truncate whitespace-nowrap font-medium">
            {wallet?.expiry_date ?? 'NA'}
            </span>
          </div>
        );
      },
    },
  
    {
      title: (
        <TitleWithSort
          title={t('Job Title')}
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'is_active'
          }
          isActive={sortingObj.column === 'is_active'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'job_title',
      key: 'job_title',
      align: 'center' as AlignType,
      width: 100,
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (job_title: any, { slug, logo }: any) => (
        <div className="flex items-center">
          <span className="truncate whitespace-nowrap font-medium">
            {job_title}
          </span>
        </div>
      ),
    },

    {
      title: t('Actions'),
      dataIndex: 'id',
      key: 'id',
      align: 'left' as AlignType,
      width: 120,
      render: (
        id: string,
        { slug, is_active, owner_id, ownership_history, settings }: Shop,
      ) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [approvModalOpen, setApproveModalOpen] = useState(false);
        const [disapprovModalOpen, setDisapproveModalOpen] = useState(false);

        // Open Modal
        const openDeleteModal = () => {
          setIsModalOpen(true);
        };

        // Close Modal
        const closeDeleteModal = () => {
          setIsModalOpen(false);
        };
        const handleUpdate = (slug: any) => {
          // console.log('slugslug', slug);
          // router.push();
          router.push({
            pathname: `/employee/${slug?.slug}/edit`,
            //@ts-ignore
            // query: { item: JSON.stringify(slug) },
          });
        };

        // Handle Delete
        const handledeleteEmployee = () => {
          //@ts-ignore
          deleteShop({
            id,
          });

          setIsModalOpen(false);
        };

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
          approveEmployee({
            id,
          });
          setApproveModalOpen(false);
        };
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
              onClick={() =>
                handleUpdate({
                  slug,
                })
              }
            />
            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              onClick={openDeleteModal}
            />
            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to delete Employee?
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

            {/* <Image
              src={approve} // Replace with your actual icon/image path
              alt="Approve"
              className="cursor-pointer"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              onClick={() => handleApprove(id)}
            />
           
            <Image
              src={remove_cut} // Replace with your actual icon/image path
              alt="Remove"
              className="cursor-pointer"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              onClick={openDisapproveModal}
            /> */}
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
                    Are you sure you want to Disapprove company?
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
                    Are you sure you want to Approve Employee?
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
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          expandedRowRender={(record) =>
            // @ts-ignore
            expandedRowKeys.includes(record?.id) && (
              <div className=" flex bg-white gap-6  p-4 shadow">
                <div className="grid grid-cols-4 gap-4 border border-gray-300 bg-white rounded-md">
                  <div className={`p-6 border-r border-gray-300'}`}>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Date of birth'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.date_of_birth}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Branch'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.city}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Department'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'Warehouse'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Address Type'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.city}, {record?.address?.state},{' '}
                        {record?.address?.country}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Phone'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}+{record?.contact_no}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 border-r border-gray-300'}`}>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Country'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.country}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'State'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.city}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Jurisdiction'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.country}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Postal Code'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.address?.zip}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Levy Rate Code'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 border-r border-gray-300'}`}>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Payroll Posting Class'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {record?.job_title}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Calender'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Residency'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Employment Basis'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>
                  </div>

                  <div className={`p-6 border-r border-gray-300'}`}>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Tax free threshold'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'TFN Declartion Status'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Contract type'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Withholding Variation'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600 mr-10">
                        {'Tax scale'}
                      </span>
                      <span className="text-gray-800 text-right">
                        {/* @ts-ignore */}
                        {'NA'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
          data={data}
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
