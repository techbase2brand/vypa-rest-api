// pages/product.tsx
import { useState } from 'react';
import Accordion from '../orders/filter';
import Button from '@/components/ui/button';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';

interface ImageGalleryProps {
  images: string[];
}
//@ts-ignore
const ProductPage: React.FC<ImageGalleryProps> = ({
  images,
  ProductData,
}: {
  images: any;
  ProductData: any;
}) => {
  const [quantity, setQuantity] = useState(1);
  const colors = [
    '#D23F47',
    '#34568B',
    '#FFDB58',
    '#6B5B95',
    '#88B04B',
    '#F7CAC9',
    '#92A8D1',
    '#955251',
  ];
  const sizes = ['Small', 'Medium', 'Large', 'XL'];

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const [activeImage, setActiveImage] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const handlePopupToggle = () => {
    setShowPopup(!showPopup);
  };
  console.log('ProductDataProductData', ProductData);

  return (
    <>
      <div className="mx-auto  grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex gap-4">
          <div className="w-full">
            {/* Main Image Display */}
            <img
              src={images[activeImage]}
              alt={`Display ${activeImage}`}
              className="w-full h-80 object-cover shadow-lg"
            />
          </div>
          <div
            className=" overflow-y-auto h-80 pt-2"
            style={{ width: '125px' }}
          >
            {/* Thumbnails */}
            {/* @ts-ignore */}
            {images.map((image, index) => (
              <button
                key={index}
                className={`w-20 h-20 md:w-20 md:h-20 mb-1 ml-1 p-1 block ${index === activeImage ? 'ring-1 ring-blue-500' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <img
            className="w-20 mb-2 object-cover"
            src="https://navneetdwivedi.github.io/Logo_Slider/logo.png"
          />
          <h1 className="text-2xl font-bold mb-2">
            {ProductData?.name}
            {/* DNC 3710 Hi-VIS "X" BACK & BIO-MOTION TAPED POLO */}
          </h1>
          <p className="text-lg  mb-4 border-t border-b border-gray-300 pt-2 pb-2">
            <b>{ProductData?.min_price ?? '$44.59'}</b>{' '}
            <span className="text-sm ml-3 text-[#161616]">SKU: VP11255</span>
          </p>

          <Accordion title="Color">
            <div className="flex space-x-2">
              {colors.map((color, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: color }}
                  className="w-6 h-6 mt-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                ></button>
              ))}
            </div>
          </Accordion>

          <Accordion title="Size">
            <ul className=" w-full">
              {sizes.map((size, index) => (
                <li
                  className="text-sm mb-1 hover:text-[#21BA21] cursor-pointer"
                  key={index}
                  value={size}
                >
                  {size}
                </li>
              ))}
            </ul>
          </Accordion>

          {/* <div
            className="mt-4 border border-gray-500 rounded shadow"
            style={{
              width: '120px',
              display: 'flex',
              justifyContent: 'space-between',
              padding: '3px',
              alignItems: 'center',
            }}
          >
            <button
              onClick={decreaseQuantity}
              className="text-gray-700 px-3 py-1 rounded mr-2"
            >
              -
            </button>
            <span className="text-sm">{quantity}</span>
            <button
              onClick={increaseQuantity}
              className="text-gray-700 px-3 py-1 rounded ml-2"
            >
              +
            </button>
          </div> */}

          <div className="mt-4 flex gap-4 mb-5 border-t border-b border-gray-300 pt-4 pb-4">
            <Button
              onClick={handlePopupToggle}
              className="bg-transprent border border-gray-400 text-black hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8"
            >
              Add to Favorite
            </Button>
            <div className="w-1/2">
              <AddToCart
                data={ProductData}
                variant="big"
                // variation={selectedVariation}
                // disabled={selectedVariation?.is_disable || !isSelected}
              />
            </div>

            {/* <Button className="bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8">
              Add to cart
            </Button> */}
          </div>
          {/* 
          <Accordion title="Description">
            <p className="text-sm">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              risus purus, consequat vel semper et, consectetur maximus ante.
              Mauris quis facilisis turpis.
            </p>
          </Accordion>
          <Accordion title="Request a Quote">
            <div className="p-0">
              <form action="">
                <input
                  type="text"
                  placeholder="Name"
                  className="px-4 mb-2 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Contact Number"
                    className="px-4 mb-2 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    className="px-4 mb-2 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
                  />
                </div>
                <textarea
                  placeholder="Message"
                  className="w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
                  name=""
                  id=""
                ></textarea>
                <Button className="pt-2 pb-2 h-10 text-sm">Send</Button>
              </form>
            </div>
          </Accordion> */}
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
            <label
              htmlFor=""
              className="text-body-dark font-semibold text-sm leading-none mb-4"
            >
              Create a new list
            </label>
            <input
              type="text"
              placeholder="New list name"
              className="px-4 mb-2 flex items-center w-full rounded appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent h-12"
            />
            <div className="flex gap-5 mt-5 justify-end">
              <Button className="bg-black text-white px-4 py-2 text-sm rounded-md hover:bg-gray-800">
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
        </div>
      )}
    </>
  );
};

export default ProductPage;
