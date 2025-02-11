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
import {
  useApproveShopMutation,
  useDeleteShopMutation,
  useDisApproveShopMutation,
} from '@/data/shop';
import { useModalAction } from '../ui/modal/modal.context';

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
  // @ts-ignore
  setShowDiv,
  //@ts-ignore
  setSelectedRows,
  //@ts-ignore
  selectedRows,
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
  const { openModal } = useModalAction();

  const router = useRouter();
  const { mutate: deleteShop, isLoading: updating } = useDeleteShopMutation();
  const { mutate: approveCompany } = useApproveShopMutation();
  const { mutate: disapprove } = useDisApproveShopMutation();

  // const [selectedRows, setSelectedRows] = useState<number[]>([]);
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
    router.push(`/${slug}/edit`);
  };
  const handleDeleteCompanyData = (id: any) => {
    deleteShop({
      id,
    });
  };
  // const handleApprove = (id: any) => {
  //   //@ts-ignore
  //   approveCompany({
  //     id,
  //   });
  // };
  // const handleRemove = (id: any) => {
  //   disapprove({
  //     id,
  //   });
  // };
  function handleUpdateRefundStatus() {
    openModal('UPDATE_REFUND');
  }

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

  const handleNavigateOrders = () => {
    router.push('/orders');
  };

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
          {/* <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5"> */}
          {/* <Image
              src={logo?.thumbnail ?? siteSettings?.product?.placeholder}
              alt={name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            /> */}
          {/* </div> */}
          {/* <Link href="/company-setup"> */}
          <span className="truncate whitespace-nowrap font-medium">{name}</span>
          {/* </Link> */}
        </div>
      ),
    },
    {
      title: t('No. of Emp.'),
      dataIndex: 'employees_count',
      key: 'employees_count',
      align: alignLeft as AlignType,
      width: 100,
      render: (employees_count: number) => `${employees_count}`,
    },
    {
      title: t('Contact Details'),
      dataIndex: 'primary_contact_detail',
      key: 'primary_contact_detail',
      align: alignLeft as AlignType,
      width: 130,
      render: (
        primary_contact_detail: any,
        { address }: any,
        { record }: any,
      ) => {
        //@ts-ignore
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
              <span className="absolute h-500 bottom-7 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-Black bg-White p-1 rounded border opacity-0 border-black group-hover:opacity-100 transition-opacity duration-200">
                {address?.city ? address?.city : 'Location'},
                {/* {address?.city ? address?.city : 'Location'} */}
              </span>
            </div>
          </div>
        );
      },
    },
    // {
    //   title: t('Created by'),
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: alignLeft as AlignType,
    //   width: 100,
    //   render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
    // },
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
      dataIndex: 'id',
      key: 'id',
      align: 'center' as AlignType,
      width: 150,
      onHeaderCell: () => onHeaderClick('is_active'),
      render: (
        id: string,
        { slug, is_active, owner_id, ownership_history, settings }: Shop,
      ) => {
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
          approveCompany({
            id,
          });
          setApproveModalOpen(false);
        };
        return (
          <>
            <div onClick={is_active ? openDisapproveModal : openapproveModal}>
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
                    Are you sure you want to Approve company?
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
          </>
        );
      },
    },
    {
      title: t('Total Orders'),
      dataIndex: 'orders_count',
      key: 'orders_count',
      align: alignLeft as AlignType,
      width: 100,
      render: (orders_count: number) => `${orders_count}`,
    },

    {
      title: t('Avg. Orders'),
      dataIndex: 'orders_avg_amount',
      key: 'orders_avg_amount',
      align: alignLeft as AlignType,
      width: 100,
      render: (orders_avg_amount: number) =>
        `$${orders_avg_amount ? orders_avg_amount : '0'}`,
    },

    {
      title: t('Total Spend'),
      dataIndex: 'orders_sum_amount',
      key: 'orders_sum_amount',
      align: alignLeft as AlignType,
      width: 100,
      render: (orders_sum_amount: number) =>
        `$${orders_sum_amount ? orders_sum_amount : '0'}`,
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

        // Handle Delete
        const handleDelete = () => {
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
          approveCompany({
            id,
          });
          setApproveModalOpen(false);
        };

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
              className="cursor-pointer"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              onClick={openDeleteModal}
              // onClick={() => handleDeleteCompanyData(id)}
            />
            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to delete company?
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
                      onClick={handleDelete}
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
            {/* Conditional Rendering Based on is_active */}
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
                    Are you sure you want to Approve company?
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
              className={`cursor-pointer ${expandedRowKeys.includes(id) ? 'rotate-icon' : ''}`}
              width={10} // Set the width for the icon
              height={10} // Set the height for the icon
              onClick={() => handleExpandToggle(id)}
            />
            {/* <ActionButtons
            id={id}
            approveButton={true}
            detailsUrl={`/${slug}`}
            isShopActive={is_active}
            transferShopOwnership
            disabled={
              !Boolean(is_active) ||
              OWNERSHIP_TRANSFER_STATUS?.includes(
                ownership_history?.status as OwnerShipTransferStatus
              )
            }
            data={{
              id,
              owner_id: owner_id as number,
            }}
          /> */}
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
    // orders: [
    //   {
    //     orderNumber: '1226362373773',
    //     orderType: 'Online',
    //     orderAmount: '$456.00',
    //     orderStatus: 'Completed',
    //     orderDate: '12/02/2024',
    //     statusColor: 'bg-green-100 text-green-700',
    //   },
    //   {
    //     orderNumber: '1226362373773',
    //     orderType: 'Offline',
    //     orderAmount: '$456.00',
    //     orderStatus: 'Open',
    //     orderDate: '12/02/2024',
    //     statusColor: 'bg-yellow-100 text-yellow-700',
    //   },
    //   {
    //     orderNumber: '1226362373773',
    //     orderType: 'Online',
    //     orderAmount: '$456.00',
    //     orderStatus: 'Cancelled',
    //     orderDate: '12/02/2024',
    //     statusColor: 'bg-red-100 text-red-700',
    //   },
    // ],
  };
  const {
    name,
    mobileNumber,
    abnNumber,
    billingAddress,
    totalOutstanding,
    // orders,
  } = customerData;
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          columns={columns}
          expandedRowRender={(record) => {
            //@ts-ignore
            const { business_contact_detail, orders, name, address } = record;
            console.log('recordrecord', record);

            return (
              <div
                className="flex gap-4 bg-white p-4 rounded m-2 pl-8"
                style={{ border: '1px solid #9E9E9E' }}
              >
                <div className=" w-1/4 mr-10">
                  <div className="mt-8">
                    <div className="flex justify-between">
                      <p className="text-sm font-semibold">Name:</p>
                      <p>{name}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">Mobile Number:</p>
                      <p>+{business_contact_detail?.business_phone}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">ABN Number:</p>
                      <p>{business_contact_detail?.abn_number}</p>
                    </div>
                    <div className="flex justify-between mt-6">
                      <p className="text-sm font-semibold">Billing Address:</p>
                      <p className="w-28 ml-14 text-right">
                        {address?.street_address}
                        {/* {address?.city},
                        {address?.state},{address?.zip} */}
                        {/* {address?.country}, */}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Orders Table */}
                <div className="mt-6 w-full">
                  <div className="flex justify-between">
                    <h2 className="font-bold text-lg mb-2 text-black">
                      Recent Orders
                    </h2>

                    <div className="flex gap-8 items-center">
                      <button className="px-4 py-2 border border-black hover:bg-gray-300 rounded">
                        View all Orders
                      </button>

                      <p className="text-sm">Total Outstanding</p>
                      <b>$600</b>
                    </div>
                  </div>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="text-left border-b">
                        <th
                          className="py-2 text-black"
                          style={{ textAlign: 'left' }}
                        >
                          Order Number
                        </th>
                        <th
                          className="py-2 text-black"
                          style={{ textAlign: 'left' }}
                        >
                          Order Type
                        </th>
                        <th
                          className="py-2 text-black"
                          style={{ textAlign: 'left' }}
                        >
                          Order Amt.
                        </th>
                        <th
                          className="py-2 text-black"
                          style={{ width: '250px', textAlign: 'left' }}
                        >
                          Order Status
                        </th>
                        <th
                          className="py-2 text-black"
                          style={{ textAlign: 'left' }}
                        >
                          Order Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* @ts-ignore */}
                      {orders?.map((order, index) => {
                        /* @ts-ignore */
                        const formatDate = (dateString) => {
                          const date = new Date(dateString);
                          const day = String(date.getDate()).padStart(2, '0');
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            '0',
                          ); // Months are 0-based
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`; // Change to `${day}-${month}-${year}` for the hyphen format
                        };

                        // Example usage
                        // const createdAt = '2025-01-28T09:43:12.000000Z';
                        const formattedDate = formatDate(order?.created_at);
                        console.log(formattedDate); // Output: "28/01/2025"
                        return (
                          <tr key={index} className="border-b">
                            <td className="py-2">{order?.id}</td>
                            <td className="py-2">{order?.payment_gateway}</td>
                            <td className="py-2">{order?.total}</td>
                            <td className="py-2">
                              <span
                                className={`px-3 py-1 rounded-full ${
                                  order?.order_status === 'order-pending'
                                    ? 'bg-yellow-500 text-black'
                                    : order?.order_status === 'order-processing'
                                      ? 'bg-red-400 text-black'
                                      : order?.order_status ===
                                          'order-at-local-facility'
                                        ? 'bg-orange-500 text-black'
                                        : order?.order_status ===
                                            'order-completed'
                                          ? 'bg-green-500 text-white'
                                          : ''
                                }`}
                              >
                                {order?.order_status}
                              </span>
                            </td>
                            <td className="py-2">{formattedDate}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* View All Orders Button */}
                {/* <div className="mt-4 text-right mr-6">
                  <button
                    onClick={handleNavigateOrders}
                    className="px-4 py-2 border border-black hover:bg-gray-300 rounded"
                  >
                    View all Orders
                  </button>
                </div>
                <div className="text-right flex mt-4 gap-4">
                  <p className="text-gray-500">Total Outstanding</p>
                  <p className="text-gray-500">{totalOutstanding}</p>
                </div> */}
              </div>
            );
          }}
          expandable={{
            expandedRowKeys, // Manage which rows are expanded
            onExpand: (expanded, record) => {
              handleExpandToggle(record.id);
            },
            expandIcon: () => null,
            expandRowByClick: false,
          }}
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
