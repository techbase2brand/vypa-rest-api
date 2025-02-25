import Card from '@/components/common/card';
import PageHeading from '@/components/common/page-heading';
import Search from '@/components/common/search';
import UniformsData from '@/components/uniforms/uniforms-data';
import Layout from '@/components/layouts/admin';
import Button from '@/components/ui/button';
import ErrorMessage from '@/components/ui/error-message';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import { Config } from '@/config';
import { useGetProductWishlistMutation } from '@/data/uniforms';
import { ProductStatus, SortOrder } from '@/types';
import { adminOnly } from '@/utils/auth-utils';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ProductVariation from '@/components/product/variation/variation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useProductsQuery } from '@/data/product';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';
import { toast } from 'react-toastify';
import { useDeleeteAllWishlistMutation } from '@/data/wishlist';

export default function Wishlist() {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();
  const router = useRouter();
  const { id } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [variationPrice, setVariationPrice] = useState('');
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<{ id: number }[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [stocks, setStocks] = useState<{
    [key: number]: { maxStock: string; currentStock: string; quantity: number };
  }>({});
  const { mutate: deleteAllWishlist } = useDeleeteAllWishlistMutation();
  const { wishlist, loading, paginatorInfo, error } =
    useGetProductWishlistMutation({
      language: locale,
      limit: 20,
      page,
      name: searchTerm,
      orderBy,
      sortedBy,
      //@ts-ignore
      uniform_id: id,
      refreshKey,
    });

  // console.log('selectedItemsselectedItems', selectedItems);
  console.log('selectedIdsselectedIds', selectedIds);

  if (loading) return <Loader text={t('common:text-loading')} />;
  if (error) return <ErrorMessage message={error.message} />;

  // const handleAddMultipleItems = () => {
  //   if (!selectedItems || selectedItems.length === 0) {
  //     return toast.error('Please select at least one item!');
  //   }
  //   selectedItems?.forEach((item) => {
  //     //@ts-ignore
  //     item.variation_options?.forEach((variation) => {
  //       //@ts-ignore
  //       const selectedItem = generateCartItem(item, variation);
  //       //@ts-ignore

  //       addItemToCart(selectedItem, 1);
  //     });
  //   });

  //   toast.success('Selected items added to cart!');
  // };

  // const handleAddMultipleItems = () => {
  //   if (!selectedItems || selectedItems.length === 0) {
  //     return toast.error('Please select at least one item!');
  //   }

  //   for (const item of selectedItems) {
  //     //@ts-ignore
  //     if (!item.variation_options || item.variation_options.length === 0) {
  //       return toast.error('Please select size and color!');
  //     }
  //     //@ts-ignore
  //     item.variation_options.forEach((variation) => {
  //       //@ts-ignore
  //       const selectedItem = generateCartItem(item, variation);
  //       //@ts-ignore
  //       addItemToCart(selectedItem, 1);
  //     });
  //     handleDeleteAllWishData();
  //   }
  //   toast.success('Selected items added to cart!');
  // };
  const handleAddMultipleItems = () => {
    if (!selectedItems || selectedItems.length === 0) {
      return toast.error('Please select at least one item!');
    }

    let allItemsValid = true; // Track if all items have variations

    const updatedItems = selectedItems.map((item) => {
      // Ensure variations exist before adding
      //@ts-ignore
      if (!item.variation_options || item.variation_options.length === 0) {
        //@ts-ignore
        toast.error(
          //@ts-ignore
          `Please select size and color for ${item?.name || 'an item'}!`,
        );
        allItemsValid = false;
        return item; // Return item unchanged
      }

      // Add items to cart
      //@ts-ignore
      item.variation_options.forEach((variation) => {
        //@ts-ignore
        const selectedItem = generateCartItem(item, variation);
        //@ts-ignore
        addItemToCart(selectedItem, 1);
      });

      return item;
    });

    if (allItemsValid) {
      handleDeleteAllWishData(); // Delete only if all items were valid
      toast.success('Selected items added to cart!');
    }
  };

  function handleSearch({ searchText }: { searchText: string }) {
    setSearchTerm(searchText);
    setPage(1);
  }

  function handlePagination(current: number) {
    setPage(current);
  }
  const resetStocks = () => {
    setStocks({});
  };

  // Open Modal
  const openDeleteModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const closeDeleteModal = () => {
    setIsModalOpen(false);
  };
  const handleDeleteAllWishData = () => {
    //@ts-ignore
    deleteAllWishlist(selectedIds, {
      onSuccess: () => {
        setIsModalOpen(false);
        //@ts-ignore
        // toast.success('WishLists Deleted Successfully!');
        setRefreshKey((prev) => prev + 1); // Increment the key to refresh the query
      },
      //@ts-ignore
      onError: (error) => {
        console.error('Error deleting employees:', error);
      },
    });
  };

  const handleDeleteAllEmployeeData = () => {
    //@ts-ignore
    deleteAllWishlist(selectedIds, {
      onSuccess: () => {
        setIsModalOpen(false);
        //@ts-ignore
        toast.success('WishLists Deleted Successfully!');
        setRefreshKey((prev) => prev + 1); // Increment the key to refresh the query
      },
      //@ts-ignore
      onError: (error) => {
        console.error('Error deleting employees:', error);
      },
    });
  };

  return (
    <>
      <Card className="flex flex-col items-center mb-8 md:flex-row">
        <div className="mb-4 md:mb-0 md:w-1/4">
          <PageHeading title="NSW Rail Shirts" />
        </div>

        <div className="flex flex-col items-center w-full space-y-4 ms-auto md:w-3/4 md:flex-row md:space-y-0 xl:w-1/1">
          {/* <div className='mr-3 flex items-center gap-2'>
        <input type="checkbox" id="all" name="all" value="all" />
        <label htmlFor="all"> All </label>
        </div> */}
          <Search onSearch={handleSearch} placeholderText="Search..." />

          <Button
            onClick={handleAddMultipleItems}
            className="h-12 md:w-auto ml-4 bg-black rounded mr-4 text-sm "
          >
            <span>+ Update Cart</span>
          </Button>
          <Button
            onClick={resetStocks}
            className="h-12 md:w-auto bg-black rounded mr-4 text-sm "
          >
            <svg
              className="mr-1"
              fill="#fff"
              width="20px"
              height="20px"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z" />
              <path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z" />
            </svg>
            <span> Reset Qty</span>
          </Button>
          <Button
            onClick={openDeleteModal}
            className="bg-red-500 text-white text-sm "
          >
            <svg
              className="mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 19.4 22.169"
              fill="currentColor"
              width="14"
            >
              <g
                fill="none"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.4"
              >
                <path
                  data-name="Rectangle 2"
                  d="M8.238.7h2.923a2 2 0 012 2v.769h0-6.923 0V2.7a2 2 0 012-2z"
                ></path>
                <path data-name="Line 1" d="M.7 3.469h18"></path>
                <path
                  data-name="Path 77"
                  d="M14.649 21.469h-9.9a1.385 1.385 0 01-1.38-1.279L2.085 3.469h15.231L16.029 20.19a1.385 1.385 0 01-1.38 1.279z"
                ></path>
                <path data-name="Line 2" d="M7.623 6.238V18.7"></path>
                <path data-name="Line 3" d="M11.777 6.238V18.7"></path>
              </g>
            </svg>
            Delete
          </Button>
          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Are you sure you want to delete wishlists?
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
                    onClick={handleDeleteAllEmployeeData}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      <UniformsData
        getWishlist={wishlist}
        //@ts-ignore
        item="1"
        //@ts-ignore
        stocks={stocks}
        uniformid={id}
        setStocks={setStocks}
        setRefreshKey={setRefreshKey}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        paginatorInfo={paginatorInfo}
        onPagination={handlePagination}
        onOrder={setOrder}
        onSort={setColumn}
      />
    </>
  );
}

Wishlist.authenticate = {
  permissions: adminOnly,
};

Wishlist.Layout = Layout;

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['form', 'common', 'table'])),
  },
});
