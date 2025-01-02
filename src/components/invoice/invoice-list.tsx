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
import Button from '../ui/button';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';

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
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
};


const InvoiceList = ({
  coupons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  initialQuantity = 1,
  onQuantityChange
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [quantity, setQuantity] = useState(initialQuantity);
  const [showPopup, setShowPopup] = useState(false);
  const [uniformName, setUniformName] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // Toggle expansion when the arrow image is clicked
  const handleExpandToggle = (id: any) => {
    // @ts-ignore
    // console.log("fsdsdfs", id);
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

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  const handleIncrement = () => {
    setQuantity(prevQuantity => {
      const newQuantity = prevQuantity + 1;
      if (onQuantityChange) onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity(prevQuantity => {
      const newQuantity = Math.max(1, prevQuantity - 1); // prevent negative quantities
      if (onQuantityChange) onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const {
    query: { shop },
  } = router;
  const { alignLeft } = useIsRTL();
  // console.log(coupons, 'sssssssss');

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
        <>
          <input type="checkbox" className='mr-2' name='all' id='all' />

          <TitleWithSort
            title='Reference No'
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
      render: (_: any, record: { id: number }) => (
        <>
          <input type="checkbox" />
          <Link
            href='/invoice/details'
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
          title='Staff Name'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'name'
          }
          isActive={sortingObj.column === 'name'}

        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'name',
      key: 'name',
      align: alignLeft,
      width: 150,
      ellipsis: true,
      onHeaderCell: () => onHeaderClick('name'),
      render: (name: string, { image, type }: { image: any; type: any }) => (
        <div className="flex items-center">
          <div className="relative aspect-square h-10 w-10 shrink-0 overflow-hidden rounded border border-border-200/80 bg-gray-100 me-2.5">
            <Image
              src={image?.thumbnail ?? siteSettings.product.placeholder}
              alt={name}
              fill
              priority={true}
              sizes="(max-width: 768px) 100vw"
            />
          </div>
          <div className="flex flex-col">
            <span className="truncate font-medium">Test</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title='Customer Name'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span className="whitespace-nowrap" >
            David Smith
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
      dataIndex: 'color',
      key: 'color',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span>Closed</span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Date'
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
          <span>Jul 25,2024</span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Post Period'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Post',
      key: 'Post',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span>Aug 25,2024</span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Amount'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Stock',
      key: 'Stock',
      align: 'left',
      width: 80,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span>$2,7000</span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Location'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Location',
      key: 'Location',
      align: 'left',
      width: 80,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span>Australia</span>
        );
      },
    },
    {
      title: t('table:table-item-actions'),
      dataIndex: 'id',
      key: 'actions',
      align: 'left',
      width: 100,
      render: (
        id: number,
      ) => {
        return (

          <div className="flex items-center gap-3">

            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500"
              onClick={handlePopupToggle}
            />
            <a href="#">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.85657 4.95812C9.73242 4.95812 10.5724 5.30623 11.1917 5.92587C11.811 6.54551 12.159 7.38592 12.159 8.26223C12.159 9.13853 11.811 9.97895 11.1917 10.5986C10.5724 11.2182 9.73242 11.5663 8.85657 11.5663C7.98072 11.5663 7.14075 11.2182 6.52143 10.5986C5.90211 9.97895 5.55418 9.13853 5.55418 8.26223C5.55418 7.38592 5.90211 6.54551 6.52143 5.92587C7.14075 5.30623 7.98072 4.95812 8.85657 4.95812ZM8.85657 6.61017C8.41865 6.61017 7.99866 6.78423 7.689 7.09405C7.37934 7.40387 7.20538 7.82408 7.20538 8.26223C7.20538 8.70038 7.37934 9.12059 7.689 9.43041C7.99866 9.74023 8.41865 9.91428 8.85657 9.91428C9.2945 9.91428 9.71448 9.74023 10.0241 9.43041C10.3338 9.12059 10.5078 8.70038 10.5078 8.26223C10.5078 7.82408 10.3338 7.40387 10.0241 7.09405C9.71448 6.78423 9.2945 6.61017 8.85657 6.61017ZM7.20538 16.5225C6.99898 16.5225 6.8256 16.3738 6.79258 16.1756L6.48711 13.9866C5.96698 13.7801 5.52116 13.4992 5.09185 13.1688L3.03611 14.0031C2.85448 14.0692 2.63157 14.0031 2.5325 13.8214L0.881301 10.9633C0.830771 10.8782 0.812957 10.7776 0.831191 10.6803C0.849425 10.583 0.902458 10.4957 0.980373 10.4347L2.72238 9.06348L2.66459 8.26223L2.72238 7.4362L0.980373 6.08978C0.902458 6.02876 0.849425 5.94144 0.831191 5.84414C0.812957 5.74684 0.830771 5.64623 0.881301 5.56112L2.5325 2.70306C2.63157 2.52134 2.85448 2.44699 3.03611 2.52134L5.09185 3.34736C5.52116 3.02521 5.96698 2.74436 6.48711 2.53786L6.79258 0.348885C6.8256 0.150638 6.99898 0.00195312 7.20538 0.00195312H10.5078C10.7142 0.00195312 10.8875 0.150638 10.9206 0.348885L11.226 2.53786C11.7462 2.74436 12.192 3.02521 12.6213 3.34736L14.677 2.52134C14.8587 2.44699 15.0816 2.52134 15.1806 2.70306L16.8318 5.56112C16.9392 5.74284 16.8896 5.96587 16.7328 6.08978L14.9908 7.4362L15.0486 8.26223L14.9908 9.08826L16.7328 10.4347C16.8896 10.5586 16.9392 10.7816 16.8318 10.9633L15.1806 13.8214C15.0816 14.0031 14.8587 14.0775 14.677 14.0031L12.6213 13.1771C12.192 13.4992 11.7462 13.7801 11.226 13.9866L10.9206 16.1756C10.8875 16.3738 10.7142 16.5225 10.5078 16.5225H7.20538ZM8.23737 1.65401L7.9319 3.80994C6.94119 4.01645 6.06605 4.5451 5.43034 5.28027L3.44065 4.4212L2.82146 5.49504L4.56347 6.77538C4.23323 7.73908 4.23323 8.78538 4.56347 9.74908L2.8132 11.0377L3.4324 12.1115L5.4386 11.2524C6.07431 11.9794 6.94119 12.508 7.92365 12.7063L8.22912 14.8704H9.48403L9.7895 12.7145C10.772 12.508 11.6388 11.9794 12.2745 11.2524L14.2807 12.1115L14.8999 11.0377L13.1497 9.75734C13.4799 8.79089 13.4799 7.74183 13.1497 6.77538L14.8917 5.49504L14.2725 4.4212L12.2828 5.28027C11.6341 4.52885 10.7541 4.01453 9.78124 3.8182L9.47577 1.65401H8.23737Z" fill="#151D48" />
              </svg>
            </a>
            <div className='cursor-pointer' onClick={() => handleExpandToggle(id)} >
              <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.21877 0.00195408C1.07043 0.00195026 0.925424 0.0312729 0.802083 0.0862131C0.678742 0.141153 0.582609 0.219245 0.525842 0.31061C0.469074 0.401975 0.454222 0.502511 0.483163 0.599504C0.512104 0.696497 0.583539 0.78559 0.688433 0.855516L7.65805 5.50195L0.688433 10.1484C0.547778 10.2421 0.468758 10.3693 0.468758 10.5019C0.468758 10.6346 0.547778 10.7617 0.688433 10.8555C0.829088 10.9493 1.01986 11.002 1.21877 11.002C1.41769 11.002 1.60846 10.9493 1.74911 10.8555L9.24907 5.85551C9.31872 5.80908 9.37396 5.75396 9.41166 5.69329C9.44935 5.63263 9.46875 5.56761 9.46875 5.50195C9.46875 5.43628 9.44935 5.37126 9.41166 5.3106C9.37396 5.24993 9.31872 5.19482 9.24907 5.14839L1.74911 0.148392C1.67954 0.101894 1.59688 0.0650196 1.50586 0.0398893C1.41485 0.0147581 1.31728 0.00186634 1.21877 0.00195408Z" fill="black" />
              </svg>

            </div>
          </div>
        );
      },
    },
  ];
  const tabledata = [
    { label: 'Description', value: 'The purpose  of lorem ipsum is to create a natural looking block of text.' },
    { label: 'Customer order', value: 'lorem ipsum' },
    { label: 'Created On', value: '09-Nov-2024' },
    { label: 'Balance', value: '$9876' },
    {
      label: 'PDF',
      value: (
        <a href="your-pdf-link.pdf" target="_blank" rel="noopener noreferrer">
          <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.4699 8.61719V5.61719H8.46988V8.61719H7.46988V4.61719H17.4699V8.61719H16.4699ZM18.0849 12.1172C18.3682 12.1172 18.6059 12.0212 18.7979 11.8292C18.9899 11.6372 19.0855 11.3999 19.0849 11.1172C19.0842 10.8345 18.9885 10.5969 18.7979 10.4042C18.6072 10.2115 18.3695 10.1155 18.0849 10.1162C17.8002 10.1169 17.5629 10.2129 17.3729 10.4042C17.1829 10.5955 17.0869 10.8332 17.0849 11.1172C17.0829 11.4012 17.1789 11.6385 17.3729 11.8292C17.5669 12.0199 17.8035 12.1159 18.0849 12.1172ZM16.4699 19.0012V14.4632H8.46988V19.0012H16.4699ZM17.4699 20.0012H7.46988V16.0012H4.04688V10.6172C4.04688 10.0505 4.23921 9.57552 4.62387 9.19219C5.00854 8.80885 5.48288 8.61685 6.04688 8.61619H18.8929C19.4595 8.61619 19.9345 8.80819 20.3179 9.19219C20.7012 9.57619 20.8929 10.0509 20.8929 10.6162V16.0012H17.4699V20.0012ZM19.8929 15.0012V10.6172C19.8929 10.3339 19.7972 10.0962 19.6059 9.90419C19.4145 9.71219 19.1769 9.61619 18.8929 9.61619H6.04688C5.76354 9.61619 5.52621 9.71219 5.33487 9.90419C5.14354 10.0962 5.04754 10.3339 5.04688 10.6172V15.0012H7.46988V13.4632H17.4699V15.0012H19.8929Z" fill="#4791EE" />
          </svg>
        </a>
      )
    },
    { label: 'Tracking ID', value: 'LP-12345-628-110' },

  ];
  const gridData = [
    tabledata.slice(0, 3),
    tabledata.slice(3, 6),
  ];
  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          //@ts-ignore
          columns={columns}

          expandedRowRender={(record) =>
            // @ts-ignore
            expandedRowKeys.includes(record?.id) && (
              <div className=" flex bg-white  p-4 shadow">
                <div className="grid grid-cols-3 gap-4 border border-gray-300 bg-white rounded-md">
                  {gridData?.map((column, columnIndex) => (
                    <div
                      key={columnIndex}
                      className={`p-6 ${columnIndex < 3 ? 'border-r border-gray-300' : ''}`}
                    >
                      {column?.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                          <span className="font-medium text-gray-600 w-40">
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
            // expandIcon: () => null,
            expandIcon: () => false, // Hide the default expand icon (the + icon)
            expandRowByClick: false, // Disable expansion on row click
          }}

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


      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">

            <div className="flex justify-between">
              <h2 className="text-xl font-bold mb-5">Remove Invoice</h2>
              <a onClick={handlePopupToggle} className='cursor-pointer'>X</a>
            </div>

            <label htmlFor="" className='flex text-body-dark font-semibold text-lg leading-none mb-5'>You're about to delete Invoice?</label>

            <div className="flex gap-5 mt-8">
              <Button
                onClick={handlePopupToggle}
                className="bg-transprint border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-white-600"
              >
                Cancel
              </Button>
              <Button
                className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
              >
                Remove
              </Button>

            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default InvoiceList;
