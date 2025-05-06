import { useMemo } from 'react';
import { getVariations } from './get-variations';
import { isVariationSelected } from './is-variation-selected';
import VariationGroups from './variation-groups';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { AttributesProvider, useAttributes } from './attributes.context';
import { AddToCart } from '@/components/cart/add-to-cart/add-to-cart';
import { useProductQuery, useProductsQuery } from '@/data/product';
import { Config } from '@/config';
import { useRouter } from 'next/router';
import Loader from '@/components/ui/loader/loader';
import { ProductStatus } from '@/types';

interface Props {
  product: any;
}

const Variation = ({
  selectedSizeOptions,
  selectedColorOptions,
  product,
  setVariationPrice,
  setSelectedVariation,
  setSelectedVariationSku,
  stockQuntity,
  setMoveCart,
  selectedIds
}: {
  product: any;
  setVariationPrice: any;
  setSelectedVariationSku:any;
  selectedColorOptions:any;
  selectedSizeOptions:any;
  stockQuntity:any;
  setMoveCart:any;
  selectedIds:any;
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
    if (setVariationPrice || setSelectedVariation) {
      setVariationPrice(Number(selectedVariation.sale_price ?? selectedVariation?.price) || 0);
      setSelectedVariationSku(selectedVariation?.sku)
      setSelectedVariation(selectedVariation?.id);
    }
  }
  

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
        <VariationGroups variations={variations} 
        //@ts-ignore
        selectedColorOptions={selectedColorOptions}
        selectedSizeOptions={selectedSizeOptions} />
      </div>
      <AddToCart
        data={product}
        variant="big"
        //@ts-ignore
        setMoveCart={setMoveCart}
        stockQuntity={stockQuntity}
        variation={selectedVariation}
        disabled={selectedVariation?.is_disable || !isSelected}
      />
    </div>
  );
};

const ProductVariation = ({
  selectedColorOptions,
  selectedSizeOptions,
  productSlug,
  setVariationPrice,
  setSelectedVariation,
  setSelectedVariationSku,
  stockQuntity,
  setMoveCart,
  selectedIds
}: {
  productSlug: string;
  setVariationPrice: any;
  selectedColorOptions:any;
  selectedSizeOptions:any;
  stockQuntity:any;
  setMoveCart:any;
  selectedIds:any;
  setSelectedVariation: React.Dispatch<React.SetStateAction<any>>;
  setSelectedVariationSku:any;
}) => {
  const { locale } = useRouter();

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
      <Variation
        product={product}
        //@ts-ignore
        selectedIds={selectedIds}
        setMoveCart={setMoveCart}
        stockQuntity={stockQuntity}
        selectedColorOptions={selectedColorOptions}
        selectedSizeOptions={selectedSizeOptions}
        setVariationPrice={setVariationPrice}
        setSelectedVariation={setSelectedVariation}
        //@ts-ignore
        setSelectedVariationSku={setSelectedVariationSku}
      />
    </AttributesProvider>
  );
};

export default ProductVariation;
