import { useMemo } from 'react';
import { getVariations } from './get-variations';
import { isVariationSelected } from './is-variation-selected';
import VariationGroups from './variation-groups';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { AttributesProvider, useAttributes } from './attributes.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useProductQuery } from '@/data/product';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import Loader from '@/components/ui/loader/loader';
import WishListVariationGroups from './wishlist-varition-group';

interface Props {
  product: any;
}

const Variation = ({
  product,
  setVariationPrice,
  setSelectedVariation,
}: {
  product: any;
  setVariationPrice: any;
  setSelectedVariation: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const { attributes } = useAttributes();
  const variations = useMemo(
    () => getVariations(product?.variations),
    [product?.variations],
  );
  const isSelected = isVariationSelected(variations, attributes);
  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort(),
      ),
    );
    setVariationPrice(selectedVariation?.price)
    setSelectedVariation(selectedVariation?.id);
  }

  
  return (
    <div className=" -[95vw] max-w-lg rounded-md bg-white p-8">
      {/* <h3 className="mb-2 text-center text-2xl font-semibold text-heading">
        {product?.name}
      </h3>
      <div className="mb-8 flex items-center justify-center">
        <VariationPrice
          selectedVariation={selectedVariation}
          minPrice={product?.min_price}
          maxPrice={product?.max_price}
        />
      </div> */}
      <div className="mb-8">
        <WishListVariationGroups
          variations={variations}
        
        />
      </div>
      <AddToCart
        data={product}
        variant="neon"
        variation={selectedVariation}
        disabled={selectedVariation?.is_disable || !isSelected}
      />
    </div>
  );
};

const ProductWishListVariation = ({
  productSlug,
  setVariationPrice,
  setSelectedVariation,
}: {
  productSlug: string;
  setVariationPrice: any;
  setSelectedVariation: React.Dispatch<React.SetStateAction<any>>;

}) => {
  const { locale } = useRouter();
  console.log("locale",locale);
  
  const { product, isLoading: loading } = useProductQuery({
    slug: productSlug,
    language: locale!,
  });


  if (loading || !product)
    return (
      <div className="flex h-48 w-48 items-center justify-center rounded-md bg-white">
        <Loader />
      </div>
    );
  return (
    <AttributesProvider>
      {/* @ts-ignore */}
      <Variation product={product} setVariationPrice={setVariationPrice}  setSelectedVariation={setSelectedVariation}/>
    </AttributesProvider>
  );
};

export default ProductWishListVariation;
