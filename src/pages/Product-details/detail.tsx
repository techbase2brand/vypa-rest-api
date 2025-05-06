// pages/product.tsx
import { useState } from 'react';
import Accordion from '../orders/filter';
import Button from '@/components/ui/button';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import ProductVariation from '@/components/product/variation/variation';
import Image from 'next/image';
import {
  useCreateUniformMutation,
  useUniformsQuery,
  useUpdateUnifromMutation,
  useProductWishlistMutation,
} from '@/data/uniforms';
import { SortOrder } from '@/types';
import { useRouter } from 'next/router';
import { getAuthCredentials } from '@/utils/auth-utils';

interface ImageGalleryProps {
  images: string[];
}
interface Uniform {
  id: number;
  name: string;
  slug: string;
  id_user: number;
  created_at: string;
  updated_at: string;
  data?: any;
}
interface ProductVariationProps {
  productSlug: string;
  setVariationPrice: React.Dispatch<React.SetStateAction<string>>;
  setSelectedVariation?: React.Dispatch<React.SetStateAction<any>>; // Make sure this is included
  setSelectedVariationSku?: React.Dispatch<React.SetStateAction<any>>;
}

//@ts-ignore
const ProductPage: React.FC<ImageGalleryProps> = ({
  images,
  ProductData,
}: {
  images: any;
  ProductData: any;
}) => {
  const { locale } = useRouter();
  const { role } = getAuthCredentials();
  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const [activeImage, setActiveImage] = useState(0);
  const [galleryImages, setGalleryImages] = useState(ProductData.gallery);
  const [currentImage, setCurrentImage] = useState(images);

  const [showPopup, setShowPopup] = useState(false);
  const [variationPrice, setVariationPrice] = useState('');
  // const [SelectedUniform, setSelectedUniform] = useState('');
  const [SelectedUniform, setSelectedUniform] = useState<Uniform | null>(null);

  // const [SelectedUniform, setSelectedUniform] = useState<Uniform | null>(null);
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [createUniform, setCreateUniform] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [selectedVariationSku, setSelectedVariationSku] = useState(null);

  const uniformId = SelectedUniform?.id?.toString() || '';

  const [uniformName, setUniformName] = useState('');
  const { mutate: createUniforms, isLoading: creating } =
    useCreateUniformMutation();

  const { uniforms, loading, paginatorInfo, error } = useUniformsQuery({
    language: locale,
    limit: 20,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
  });

  // const typedUniforms = uniforms as Uniform[];
  const { mutate: updateUniforms } = useUpdateUnifromMutation();
  const { mutate: addWishlist } = useProductWishlistMutation();

  //@ts-ignore
  const handleChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === 'create') {
      setCreateUniform(true);
      setSelectedUniform(null); // Clear previous selection if needed
    } else {
      try {
        const selectedOption = JSON.parse(selectedValue);
        setSelectedUniform(selectedOption);
        setCreateUniform(false); // Ensure createUniform is false when selecting an existing uniform
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  };

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUniformName(e.target.value);
  };
  const handleSubmit = () => {
    const payload = { name: uniformName };
    //@ts-ignore
    createUniforms(payload, {
      onSuccess: () => {
        setUniformName('');
        setCreateUniform(false);
      },
      onError: (error) => {
        console.error('Creation failed:', error);
      },
    });
  };

  const handleUpdateUniform = () => {
    //@ts-ignore
    // const uniformId = uniformId;
    //@ts-ignore
    // const uniformNames = SelectedUniform?.name;
    const payload = {
      uniform_id: uniformId,
      product_id: ProductData.id.toString(),
      variation_option_id: selectedVariation,
    };

    addWishlist(payload, {
      onSuccess: () => {
        setShowPopup(false);
      },
      onError: (error) => {
        console.error('Update failed:', error);
      },
    });
  };

  const handleChangeImage = (index: number) => {
    const newGallery = [...galleryImages];
    const clickedImage = newGallery[index].thumbnail;

    newGallery[index].thumbnail = currentImage;

    setGalleryImages(newGallery);
    setCurrentImage(clickedImage);
    setActiveImage(index);
  };


  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <>
      <div className="mx-auto  grid grid-cols-1 md:grid-cols-2 gap-8">

        <div className="flex gap-4">
          <div className="w-full">
            <img
              src={currentImage}
              alt={`Display ${activeImage}`}
              className="w-full h-80 object-contain shadow-lg"
            />
          </div>
          <div className="overflow-y-auto h-80 pt-2" style={{ width: '125px' }}>
            {galleryImages.map((gallery, index) => (
              <button
                key={index}
                className={`w-20 h-20 md:w-20 md:h-20 mb-1 ml-1 p-1 block ${index === activeImage ? 'ring-1 ring-blue-500' : ''
                  }`}
                onClick={() => handleChangeImage(index)}
              >
                <img
                  src={gallery.thumbnail}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>


        <div>
          {/* <img
            className="w-20 mb-2 object-cover"
            src="https://navneetdwivedi.github.io/Logo_Slider/logo.png"
          /> */}
          <h1 className="text-xl font-semibold mb-2">
            {ProductData?.manufacturer?.name}
          </h1>
          <h1 className="text-2xl font-bold mb-2">{ProductData?.name}</h1>
          <p className="text-sm  mb-4  pt-2 pb-2">
          Description:  {stripHtml(ProductData?.description || '')}
          </p>
          <p className="text-lg  mb-4 border-t border-b border-gray-300 pt-2 pb-2">
            <b>{variationPrice && `$${variationPrice}`}</b>{' '}
            <span className="text-sm ml-3 text-[#161616]">
              SKU: {selectedVariationSku && selectedVariationSku}
            </span>
          </p>

          {/* @ts-ignore */}
          <ProductVariation
            productSlug={ProductData?.slug}
            setVariationPrice={setVariationPrice}
            //@ts-ignore
            setSelectedVariationSku={setSelectedVariationSku}
            setSelectedVariation={setSelectedVariation}
          />

          <div className="mt-4 flex items-center gap-4 mb-5 border-t border-b border-gray-300 pt-4 pb-4">
            <Button
              onClick={handlePopupToggle}
              className="bg-transprent border border-gray-400 text-black hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8"
            >
              Add to Favorite
            </Button>
            <div className="w-1/2 h-12">
              {/* <AddToCart
                data={ProductData}
                variant="big"
                // variation={selectedVariation}
                // disabled={selectedVariation?.is_disable || !isSelected}
              /> */}
            </div>

            {/* <Button className="bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8">
              Add to cart
            </Button> */}
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <div className="flex justify-center relative">
              <a
                onClick={handlePopupToggle}
                className="cursor-pointer"
                style={{ position: 'absolute', top: '-10px', right: '0px' }}
              >
                X
              </a>
            </div>
            <h2 className="text-xl font-bold mb-8">Add to Uniform List</h2>
            <div className="">
              <select
                // {...register('company_name')}
                onChange={handleChange}
                className="px-4 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
              >
                <option value={'0'}>{'Select uniform...'}</option>
                {uniforms?.map((items) => (
                  <option key={items?.id} value={JSON.stringify(items)}>
                    {items?.name}
                  </option>
                ))}
                <option value="create" className="font-3xl">
                  {'Create new list'}
                </option>
              </select>
            </div>
            {/* <label
              htmlFor=""
              className="text-body-dark font-semibold text-sm leading-none mb-4"
            >
              Create a new list
            </label>
            <input
              type="text"
              placeholder="New list name"
              className="px-4 mb-2 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
            /> */}
            <div className="flex gap-5 mt-5 justify-end">
              <Button
                onClick={handleUpdateUniform}
                className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800"
              >
                Add to my Uniform
              </Button>
              <Button
                onClick={handlePopupToggle}
                className="bg-transprint border border-red-500  text-sm text-red-500 px-4 py-2 rounded-md hover:bg-white-600"
              >
                Cancel
              </Button>
            </div>
          </div>
          {createUniform && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg w-1/3">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold mb-4">
                    {' '}
                    {'Create New List'}
                  </h2>
                  <a onClick={handlePopupToggle} className="cursor-pointer">
                    X
                  </a>
                </div>

                <label
                  htmlFor=""
                  className="flex text-body-dark font-semibold text-sm leading-none mb-4"
                >
                  What are you going to name this list?
                </label>
                <input
                  type="text"
                  name="uniformName"
                  value={uniformName}
                  onChange={handleInputChange}
                  placeholder="List Name"
                  className="ps-4 pe-4 h-12 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                />
                <div className="flex gap-5 mt-5">
                  <Button
                    onClick={handlePopupToggle}
                    className="bg-transprint border border-red-500 text-red-500 px-4 py-2 rounded-md hover:bg-white-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800"
                  >
                    {'Create New List'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ProductPage;
