import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import Badge from '@/components/ui/badge/badge';
import { Router, useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { NoDataFound } from '@/components/icons/no-data-found';
import {
  Product,
  MappedPaginatorInfo,
  ProductType,
  Shop,
  SortOrder,
} from '@/types';
import { useIsRTL } from '@/utils/locals';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import {
  useApproveProductMutation,
  useDisApproveProductMutation,
  useUpdateProductMutation,
} from '@/data/product';
import { Switch } from '@headlessui/react';

export type IProps = {
  products: Product[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};

type SortingObjType = {
  sort: SortOrder;
  column: string | null;
};

const ProductList = ({
  products,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  //@ts-ignore
  setShowDiv,
  //@ts-ignore
  setRefreshKey
}: IProps) => {
  // const { data, paginatorInfo } = products! ?? {};
  const router = useRouter();
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const { mutate: approveProduct } = useApproveProductMutation();
  const { mutate: disapprove } = useDisApproveProductMutation();
  const {
    query: { shop },
  } = router;
  const { t } = useTranslation();
  const { alignLeft, alignRight } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<SortingObjType>({
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

  const handleCheckboxChange = (id: number) => {
    setSelectedRows((prevSelected) => {
      const isIdIncluded = prevSelected.includes(id);
      if (isIdIncluded) {
        setShowDiv(false);
        return prevSelected.filter((rowId) => rowId !== id);
      } else {
        setShowDiv(true);
        return [...prevSelected, id];
      }
    });
  };

  // Toggle all checkboxes
  const handleAllCheckboxChange = () => {
    if (isAllChecked) {
      setSelectedRows([]);
      setShowDiv(false);
    } else {
      const allIds = products?.map((item) => item.id);
      // @ts-ignore
      setSelectedRows(allIds);
      setShowDiv(true);
    }
    setIsAllChecked(!isAllChecked);
  };

  const handleApprove = (id: any) => {
    //@ts-ignore
    approveProduct(
      id, 
    );
     //@ts-ignore
    // setRefreshKey((prev) => prev + 1);
  };

  const handleRemove = (id: any) => {

    disapprove(
      id, 
      )
      //@ts-ignore
      setRefreshKey((prev) => prev + 1);
    
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
      key: 'select',
      render: (_: any, record: { id: number }) => (
        <>
          <input
            type="checkbox"
            checked={selectedRows.includes(record.id)}
            onChange={() => handleCheckboxChange(record.id)}
          />
          {/* <span> #{record.id}</span> */}
        </>
      ),
      width: 60,
    },
    {
      title: 'Reference No',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      align: alignLeft,
      render: (id: string) => (
        <span className="truncate whitespace-nowrap capitalize">#{id}</span>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Product Name"
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
      width: 200,
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
            <span className="truncate font-medium">{name}</span>
            <span className="truncate whitespace-nowrap pt-1 pb-0.5 text-[13px] text-body/80">
              {type?.name}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Brand',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
      width: 100,
      align: alignLeft,
      render: (manufacturer: string) => (
        <span className="truncate whitespace-nowrap capitalize">
          {/* @ts-ignore */}
          {manufacturer?.name}
        </span>
      ),
    },
    // {
    //   title: 'Category',
    //   dataIndex: 'category',
    //   key: 'category',
    //   width: 150,
    //   align: alignLeft,
    //   ellipsis: true,
    //   render: (category: Shop) => (
    //     <div className="flex items-center font-medium">
    //       <span className="truncate">{"dknfd"}</span>
    //     </div>
    //   ),
    // },
    {
      title: 'Category',
      dataIndex: 'categories',
      key: 'categories',
      width: 150,
      align: alignLeft,
      ellipsis: true,
      render: (categories: { name: string }[]) => (
        <div className="flex items-center font-medium">
          <span className="truncate">
            {categories?.map((cat) => cat.name).join(', ') || 'NA'}
          </span>
        </div>
      ),
    },

    {
      title: (
        <TitleWithSort
          title="Sale Price"
          ascending={
            sortingObj.sort === SortOrder.Asc && sortingObj.column === 'price'
          }
          isActive={sortingObj.column === 'price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'price',
      key: 'price',
      align: alignRight,
      width: 150,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(value: number, record: Product) {
        const { price: max_price } = usePrice({
          amount: record?.max_price as number,
        });
        const { price: min_price } = usePrice({
          amount: record?.min_price as number,
        });

        const { price } = usePrice({
          amount: value,
        });

        const renderPrice =
          record?.product_type === ProductType.Variable
            ? `${min_price} - ${max_price}`
            : price;

        return (
          <span className="whitespace-nowrap" title={renderPrice}>
            {renderPrice}
          </span>
        );
      },
    },
    {
      title: (
        <TitleWithSort
          title="Stock"
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'quantity'
          }
          isActive={sortingObj.column === 'quantity'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      width: 100,
      onHeaderCell: () => onHeaderClick('quantity'),
      render: (quantity: number) => {
        if (quantity < 1) {
          return (
            <Badge
              text={t('common:text-out-of-stock')}
              color="bg-status-failed/10 text-status-failed"
              className="capitalize"
            />
          );
        }
        return <span>{quantity}</span>;
      },
    },
    {
      title: t('table:table-item-status'),
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 100,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-2 3xl:flex-row 3xl:space-x-2 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-2 rtl:space-x-reverse'
          }`}
        >
          <Badge
            text={status}
            color={
              status.toLocaleLowerCase() === 'draft'
                ? 'bg-status-failed/10 text-status-failed'
                : 'bg-customGreenLight/20 !text-customGreenLight'
            }
            className="capitalize"
          />
          {record?.quantity > 0 && record?.quantity < 10 && (
            <Badge
              text={t('common:text-low-quantity')}
              color="bg-status-failed/10 text-status-failed"
              animate={true}
              className="capitalize"
            />
          )}
        </div>
      ),
    },
    // {
    //   title: t('table:table-item-approval-action'),
    //   dataIndex: 'is_approved',
    //   key: 'approve',
    //   align: 'center' as AlignType,
    //   width: 150,
    //   render: function Render(status: boolean, record: any) {
    //     const { locale } = useRouter();
    //       const { mutate: updateProduct, } =
    //       useUpdateProductMutation();
    //     function handleOnClick() {
    //       updateProduct({
    //         id: record?.id,
    //         name: record?.name,
    //         status: record.status,
    //         type_id: record?.type.id,
    //         // language: locale,
    //       });
    //     }

    //     return (
    //       <>
    //         <Switch
    //           checked={is_approved}
    //           onChange={handleOnClick}
    //           className={`${
    //             is_approved ? 'bg-accent' : 'bg-gray-300'
    //           } relative inline-flex h-6 w-11 items-center rounded-full focus:outline-none`}
    //           dir="ltr"
    //         >
    //           <span className="sr-only">Enable</span>
    //           <span
    //             className={`${
    //               is_approved ? 'translate-x-6' : 'translate-x-1'
    //             } inline-block h-4 w-4 transform rounded-full bg-light`}
    //           />
    //         </Switch>
    //       </>
    //     );
    //   },
    // },
    {
      title: 'Published',
      dataIndex: 'status',
      key: 'status',
      align: 'left',
      width: 100,
      render: (status: string, record: any) => (
        <div
          className={`flex justify-start ${
            record?.quantity > 0 && record?.quantity < 10
              ? 'flex-col items-baseline space-y-2 3xl:flex-row 3xl:space-x-2 3xl:space-y-0 rtl:3xl:space-x-reverse'
              : 'items-center space-x-2 rtl:space-x-reverse'
          }`}
        >
          <div className="relative inline-block w-11 h-5">
            <input
              id={
                status === 'publish'
                  ? 'switch-component-green'
                  : 'switch-component-default'
              }
              type="checkbox"
              className={`peer appearance-none w-11 h-5 ${
                status === 'publish' ? 'bg-green-600' : 'bg-red-500'
              } rounded-full cursor-pointer transition-colors duration-300`}
              checked={status === 'publish'}
              onClick={() => {
                if (status === 'publish') {
                  handleRemove(record.id); // Call handleRemove if status is 'publish'
                } else {
                  handleApprove(record.id); // Call handleApprove if status is not 'publish'
                }
              }}
              // readOnly
            />
            <label
              htmlFor={
                status === 'publish'
                  ? 'switch-component-green'
                  : 'switch-component-default'
              }
              className="absolute top-0 left-0 w-5 h-5 bg-white rounded-full border border-slate-300 shadow-sm transition-transform duration-300 peer-checked:translate-x-6 peer-checked:border-green-600 cursor-pointer"
            ></label>
          </div>
        </div>
      ),
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'slug',
      key: 'actions',
      align: 'left',
      width: 100,
      render: (slug: string, record: Product) => (
        <LanguageSwitcher
          slug={slug}
          record={record}
          deleteModalView="DELETE_PRODUCT"
          routes={Routes?.product}
          enablePreviewMode={true}
          isShop={Boolean(shop)}
          shopSlug={(shop as string) ?? ''}
        />
      ),
    },
  ];

  if (router?.query?.shop) {
    columns = columns?.filter((column) => column?.key !== 'shop');
  }

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <Table
          /* @ts-ignore */
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
          data={products}
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
            showLessItems
          />
        </div>
      )}
    </>
  );
};

export default ProductList;
