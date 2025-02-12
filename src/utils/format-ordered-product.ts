export function formatOrderedProduct(product: any) {
  console.log("productproduct",product);
  
  return {
    product_id: product?.productId ? product.productId : product.id,
    ...(product?.variationId
      ? { variation_option_id: product.variationId }
      : {}),
    order_quantity: product.quantity,
    unit_price: product.price,
    subtotal: product.itemTotal +(product?.total_logo_cost ?? 0),

  };
}
