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


const UniformsData = ({
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
          <input type="checkbox" className='mr-2' />
        
        <TitleWithSort
          title='ID'
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
            href='/uniforms/create'
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
          title='Product Name'
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
          title='Price'
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
            $4534
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Color'
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
          <select name="" id="" className='ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent'>
            <option value="">Red</option>
            <option value="">Black</option>
            <option value="">Pink</option>
          </select>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Size'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'size',
      key: 'size',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <select name="" id="" className='ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent'>
            <option value="">Small</option>
            <option value="">Medium</option>
            <option value="">Large</option>
            <option value="">XL</option>
            <option value="">2XL</option>
            <option value="">3XL</option>
          </select>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Available'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'available',
      key: 'available',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <span style={{ color: '#21BA21' }}>In Stock</span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Max Stock'
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
          <input type="text" className='ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent' />
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title='Current Stock'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Current',
      key: 'Current',
      align: 'left',
      width: 80,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <input type="text" className='ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent' />
        );
      },
    },

    {
      title: (
        <TitleWithSort
          title='Quantity'
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'Quantity',
      key: 'Quantity',
      align: 'left',
      width: '180px',
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number,) {
        return (
          <>
          <div className="flex">
            <div className="flex items-center space-x-4 border border-black-500 rounded" style={{ width: 'fit-content' }}>
              <button
                onClick={handleDecrement}
                className="px-4 py-2 text-xl text-black  focus:outline-none disabled:opacity-50"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-lg w-5 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                className="px-4 py-2 text-xl rounded-lg focus:outline-none"
              >
                +
              </button>
            </div>
            <Button className='p-2 bg-green-700' style={{borderRadius:'0px 4px 4px 0px'}}>
              <svg fill="#fff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                width="20px" height="20px" viewBox="0 0 902.86 902.86"
              >
                <g>
                  <g>
                    <path d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z
			 M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"/>
                    <path d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717
			c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744
			c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742
			C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744
			c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z
			 M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742
			S619.162,694.432,619.162,716.897z"/>
                  </g>
                </g>
              </svg></Button>
              </div>
          </>
        );
      },
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'code',
      key: 'actions',
      align: 'left',
      width: 100,
      render: (slug: string, record: Coupon) => (
     
        <div className="flex gap-3">
            {/* Edit Action - Image/Icon with Tooltip */}
            <Image
            title='edit'
              src={edit} // Replace with your actual icon/image path
              alt="Edit"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500" 
            />
            {/* Transfer Ownership Action - Image/Icon with Tooltip */}
            <Image 
              src={remove} // Replace with your actual icon/image path
              alt="Transfer Ownership"
              width={15} // Set the width for the icon
              height={15} // Set the height for the icon
              className="cursor-pointer hover:text-blue-500" 
              onClick={handlePopupToggle}
            />
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


{showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">

            <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-5">Remove List</h2>
            <a   onClick={handlePopupToggle} className='cursor-pointer'>X</a>
            </div>

            <label htmlFor="" className='flex text-body-dark font-semibold text-lg leading-none mb-5'>You're about to delete 'Test' list?</label>
            
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

export default UniformsData;
