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
import { useEffect, useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { getWishlist, MappedPaginatorInfo, Attachment } from '@/types';
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
import ProductVariation from '@/components/product/variation/variation';
import Counter from '@/components/ui/counter';
import { useCart } from '@/contexts/quick-cart/cart.context';
import ProductWishListVariation from '../product/variation/wishlist-variation';
import { PlusIcon } from '../icons/plus-icon';
import { useModalAction } from '../ui/modal/modal.context';
import CartIcon from '@/components/icons/cart';
import { toast } from 'react-toastify';
import { useDeleteShopMutation } from '@/data/shop';
import { TrashIcon } from '../icons/trash';
import { useDeleteWishlistMutation } from '@/data/wishlist';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  getWishlist: getWishlist[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
  initialQuantity?: number;
  onQuantityChange?: (quantity: number) => void;
  item: any;
};
interface ProductVariationProps {
  productSlug: string;
  setVariationPrice: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVariation?: React.Dispatch<React.SetStateAction<any>>; // Make sure this is included
}
const Wishlist = ({
  getWishlist,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
  initialQuantity = 1,
  onQuantityChange,
  item,
}: IProps) => {
  const { t } = useTranslation();
  const { openModal } = useModalAction();
  const router = useRouter();

  const [quantity, setQuantity] = useState(initialQuantity);
  const [maxStock, setMaxStock] = useState<number | ''>('');
  const [currentStock, setCurrentStock] = useState<number | ''>('');
  const [showPopup, setShowPopup] = useState(false);
  const [uniformName, setUniformName] = useState('');
  const [variationPrice, setVariationPrice] = useState('');
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [moveCart, setMoveCart] = useState(null);

  const {
    isInStock,
    clearItemFromCart,
    addItemToCart,
    removeItemFromCart,
    updateCartItem,
  } = useCart();

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };

  function handleIncrement(e: any) {
    e.stopPropagation();
    addItemToCart(item, 1);
  }

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
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

  // const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value;

  //   if (value === '' || /^[0-9]*$/.test(value)) { // Allow empty or numeric input
  //     //@ts-ignore

  //     setMaxStock(value);
  //     //@ts-ignore

  //     updateQuantity(value, currentStock);
  //   }
  // };

  // const handleCurrentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let value = e.target.value;
  //   if (value === '' || /^[0-9]*$/.test(value)) { // Allow empty or numeric input
  //     //@ts-ignore

  //     if (maxStock !== '' && parseInt(value || '0', 10) > parseInt(maxStock || '0', 10)) {
  //       toast.error('Current Stock cannot be greater than Max Stock!');
  //       return;
  //     }
  //     //@ts-ignore
  //     setCurrentStock(value);
  //     //@ts-ignore

  //     updateQuantity(maxStock, value);
  //   }
  // };
  const [stocks, setStocks] = useState<{
    [key: number]: { maxStock: string; currentStock: string; quantity: number };
  }>({});

  // Max Stock Change
  // const handleMaxChange = (id: number, value: string) => {
  //   if (value === '' || /^[0-9]*$/.test(value)) {
  //     setStocks((prev) => ({
  //       ...prev,
  //       [id]: {
  //         ...prev[id],
  //         maxStock: value,
  //         quantity: Math.max(
  //           parseInt(value || '0', 10) -
  //             parseInt(prev[id]?.currentStock || '0', 10),
  //           1,
  //         ),
  //       },
  //     }));
  //   }
  // };

  // Max Stock Change
  const handleMaxChange = (id: number, value: string) => {
    if (value === '' || /^[0-9]*$/.test(value)) {
      let maxStockValue = parseInt(value || '0', 10);
      let currentStockValue = parseInt(stocks[id]?.currentStock || '0', 10);

      // Ensure Max Stock is always greater than or equal to Current Stock
      if (maxStockValue < currentStockValue) {
        toast.error('Max Stock cannot be less than Current Stock!');
        return;
      }
      //@ts-ignore
      setStocks((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          maxStock: maxStockValue,
          quantity: Math.max(maxStockValue - currentStockValue, 1),
        },
      }));
    }
  };

  // Current Stock Change
  const handleCurrentChange = (id: number, value: string) => {
    if (value === '' || /^[0-9]*$/.test(value)) {
      let maxStockValue = parseInt(stocks[id]?.maxStock || '0', 10);
      let currentStockValue = parseInt(value || '0', 10);

      if (maxStockValue !== 0 && currentStockValue > maxStockValue) {
        toast.error('Current Stock cannot be greater than Max Stock!');
        return;
      }

      setStocks((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          currentStock: value,
          quantity: Math.max(maxStockValue - currentStockValue, 1),
        },
      }));
    }
  };

  // Increment Quantity
  const incrementQuantity = (id: number) => {
    setStocks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: (prev[id]?.quantity || 1) + 1,
      },
    }));
  };

  // Decrement Quantity
  const decrementQuantity = (id: number) => {
    setStocks((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        quantity: Math.max((prev[id]?.quantity || 1) - 1, 1),
      },
    }));
  };

  // const updateQuantity = (max: string, current: string) => {
  //   let maxValue = parseInt(max || '0', 10);
  //   let currentValue = parseInt(current || '0', 10);
  //   setQuantity(Math.max(maxValue - currentValue, 1));
  // };
  const columns = [
    {
      title: (
        <>
          <input type="checkbox" className="mr-2" />

          <TitleWithSort
            title="ID"
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
          <Link href="/uniforms/create" className="ml-2">
            #{record.id}
          </Link>
        </>
      ),
      // render: (id: number) => `#${t('table:table-item-id')}: ${id}`,
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
            <span className="truncate font-medium">{name}</span>
          </div>
        </div>
      ),
    },
    {
      title: (
        <TitleWithSort
          title="Price"
          ascending={
            sortingObj.sort === SortOrder.Asc &&
            sortingObj.column === 'max_price'
          }
          isActive={sortingObj.column === 'max_price'}
        />
      ),
      className: 'cursor-pointer',
      dataIndex: 'max_price',
      key: 'max_price',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('max_price'),
      render: (_: any, record: { max_price: number }) => (
        <>
          <span className="whitespace-nowrap">${record.max_price}</span>
        </>
      ),
    },

    {
      title: t('Color'),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: (_: any, record: { id: number; variation_options?: any[] }) => {
        // Extract colors from variation_options
        const colorOptions =
          record.variation_options
            ?.flatMap((variation) =>
              variation.options
                ?.filter((opt: any) => opt.name.toLowerCase() === 'color') // Only colors
                .map((opt: any) => opt.value),
            )
            ?.filter(Boolean) || []; // Remove empty values

        return (
          <div className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
            {colorOptions.length > 0 ? (
              colorOptions.map((color, index) => <div key={index}>{color}</div>)
            ) : (
              <div>NA</div>
            )}
          </div>
        );
      },
    },

    {
      title: t('Size'),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: (_: any, record: { id: number; variation_options?: any[] }) => {
        // Extract colors from variation_options
        const colorOptions =
          record.variation_options
            ?.flatMap((variation) =>
              variation.options
                ?.filter((opt: any) => opt.name.toLowerCase() === 'size') // Only colors
                .map((opt: any) => opt.value),
            )
            ?.filter(Boolean) || []; // Remove empty values

        return (
          <div className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent">
            {colorOptions.length > 0 ? (
              colorOptions.map((color, index) => <div key={index}>{color}</div>)
            ) : (
              <div>NA</div>
            )}
          </div>
        );
      },
    },
    {
      title: t('Available'),
      className: 'cursor-pointer',
      dataIndex: 'available',
      key: 'available',
      align: 'left',
      width: 100,
      render: function Render(value: number) {
        return <span style={{ color: '#21BA21' }}>In Stock</span>;
      },
    },
    {
      title: t('Max Stock'),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(id: number) {
        return (
          <>
            {/* Max Stock Input */}
            <input
              type="number"
              placeholder="Max Stock"
              // value={maxStock}
              value={stocks[id]?.maxStock || ''}
              //@ts-ignore
              onChange={(e) => handleMaxChange(id, e.target.value)}
              // onChange={handleMaxChange}
              className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
            />
          </>
        );
      },
    },
    {
      title: t('Current Stock'),
      className: 'cursor-pointer',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      width: 100,
      onHeaderCell: () => onHeaderClick('price'),
      render: function Render(id: number) {
        return (
          <>
            {/* Current Stock Input */}
            <input
              type="number"
              placeholder="Current Stock"
              // value={currentStock}
              // onChange={handleCurrentChange}
              value={stocks[id]?.currentStock || ''}
              onChange={(e) => handleCurrentChange(id, e.target.value)}
              className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
            />
          </>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 180,
      render: (id: number) => (
        <div className="flex items-center gap-2 border w-1/2 border-black rounded">
          <button
            onClick={() => decrementQuantity(id)}
            className="px-2 py-1 text-black rounded"
          >
            -
          </button>
          <span className="text-bold">{stocks[id]?.quantity || 1}</span>
          <button
            onClick={() => incrementQuantity(id)}
            className="px-2 py-1  text-black rounded"
          >
            +
          </button>
        </div>
      ),
    },

    {
      title: t('table:table-item-actions'),
      dataIndex: 'code',
      key: 'actions',
      align: 'left',
      width: 100,
      render: (slug: string, record: getWishlist) => {
        const [isModalOpen, setModalOpen] = useState(false);
        const [deleteModalOpen, setDeleteModalOpen] = useState(false);
        useEffect(() => {
          if (moveCart !== null) {
            handleDelete(moveCart);
            setMoveCart(null); // Reset after deletion
          }
        }, [moveCart]);
         
        const colorOptions =
          // @ts-ignore
          record.variation_options
            // @ts-ignore
            ?.flatMap((variation) =>
              variation.options
                ?.filter((opt: any) => opt.name.toLowerCase() === 'color') // Only colors
                .map((opt: any) => opt.value),
            )
            ?.filter(Boolean) || []; // Remove empty values
        const sizeOptions =
          // @ts-ignore
          record.variation_options
            // @ts-ignore
            ?.flatMap((variation) =>
              variation.options
                ?.filter((opt: any) => opt.name.toLowerCase() === 'size') // Only colors
                .map((opt: any) => opt.value),
            )
            ?.filter(Boolean) || []; // Remove empty values

        // State to control modal visibility

        const id = record.id;
        const { mutate: deleteWislist, isLoading: updating } =
          useDeleteWishlistMutation();

        
        // Open disapprove Modal
        const openDeleteModal = () => {
          setDeleteModalOpen(true);
        };
        // Close Modal
        const closeDeleteModal = () => {
          setDeleteModalOpen(false);
        };
        // Handle Delete
        const handleDelete = (id:any) => {
          deleteWislist(
            {
              // @ts-ignore
              id,
            },
            {
              onSuccess: () => {
                //@ts-ignore
                // setRefreshKey((prev) => prev + 1);
                setDeleteModalOpen(false);
              },
            },
          );
          setDeleteModalOpen(false);
        };
        // Function to open modal
        const handleOpenModal = () => {
          setModalOpen(true);
        };

        // Function to close modal
        const handleCloseModal = () => {
          setModalOpen(false);
        };
        function handleVariableProduct() {
          //@ts-ignore
          return openModal('SELECT_PRODUCT_VARIATION', record?.slug);
        }

        return (
          <div className="flex">
            {Number(quantity) > 0 && (
              <>
                {/* Cart Button with Click Event */}
                <button
                  onClick={handleOpenModal} // Open modal on click
                  className="group flex h-7 items-center justify-between rounded text-xs text-body-dark transition-colors hover:border-accent hover:bg-accent hover:text-light focus:border-accent focus:bg-accent focus:text-light focus:outline-none md:h-9 md:text-sm"
                >
                  <CartIcon className="me-2.5 h-6 w-6" />
                </button>

                {/* Inline Modal */}
                {isModalOpen && (
                  <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
                    onClick={handleCloseModal} // Close modal when clicking outside
                  >
                    <div
                      className="bg-white p-6 rounded shadow-lg w-1/2 relative"
                      onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                    >
                      <h2 className="text-lg font-bold mb-4">
                        Select Variation
                      </h2>

                      {/* Product Variation Component inside Modal */}
                      <ProductVariation
                        //@ts-ignore
                        productSlug={record?.slug}
                        //@ts-ignore
                        stockQuntity={stocks[record?.id]?.quantity}
                        //@ts-ignore
                        setMoveCart={() => setMoveCart(record.id)}
                        selectedColorOptions={colorOptions?.[0]}
                        selectedSizeOptions={sizeOptions?.[0]}
                        setVariationPrice={setVariationPrice}
                        setSelectedVariation={setSelectedVariation}
                      />

                      {/* Close Button
                      <button
                        onClick={handleCloseModal}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
                      >
                        Close
                      </button> */}
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              onClick={openDeleteModal}
              className="text-red-500 transition duration-200 hover:text-red-600 focus:outline-none"
              title={t('common:text-delete')}
            >
              <TrashIcon width={14} />
            </button>

            {deleteModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Are you sure you want to delete Item from wishlist?
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
            {/* @ts-ignore */}
            {/* <LanguageSwitcher
              slug={slug}
              record={record}
              deleteModalView="DELETE_REFUND_REASON"
              // routes={Routes?.return}
            /> */}
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
          data={getWishlist}
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
              <a onClick={handlePopupToggle} className="cursor-pointer">
                X
              </a>
            </div>

            <label
              htmlFor=""
              className="flex text-body-dark font-semibold text-lg leading-none mb-5"
            >
              You're about to delete 'Test' list?
            </label>

            <div className="flex gap-5 mt-8">
              <Button
                onClick={handlePopupToggle}
                className="bg-transprint border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-white-600"
              >
                Cancel
              </Button>
              <Button className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Wishlist;
