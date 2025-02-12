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

interface Props {
  product: any;
}

const Variation = ({
  product,
  setVariationPrice,
}: {
  product: any;
  setVariationPrice: any;
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
  }

  console.log("variationsvariations",variations);
  
  return (
    <div className="w-[95vw] max-w-lg rounded-md bg-white p-8">
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
        <VariationGroups
          variations={variations}
        
        />
      </div>
      <AddToCart
        data={product}
        variant="big"
        variation={selectedVariation}
        disabled={selectedVariation?.is_disable || !isSelected}
      />
    </div>
  );
};

const ProductVariation = ({
  productSlug,
  setVariationPrice,
}: {
  productSlug: string;
  setVariationPrice: any;
}) => {
  const { locale } = useRouter();
  console.log("locale",locale);
  
  const { product, isLoading: loading } = useProductQuery({
    slug: productSlug,
    language: locale!,
  });
console.log("productSlug",productSlug);
console.log("productproductproductmm",product);


  if (loading || !product)
    return (
      <div className="flex h-48 w-48 items-center justify-center rounded-md bg-white">
        <Loader />
      </div>
    );
  return (
    <AttributesProvider>
      {/* @ts-ignore */}
      <Variation product={product} setVariationPrice={setVariationPrice} />
    </AttributesProvider>
  );
};

export default ProductVariation;
