export function formatOrderedProduct(product: any) {
  console.log("formatOrderedProduct",product);
  
  return {
    product_id: product?.productId ? product.productId : product.id,
    ...(product?.variationId
      ? { variation_option_id: product.variationId }
      : {}),
    order_quantity: product.quantity,
    unit_price: product.price,
    subtotal: product.itemTotal +(product?.total_logo_cost ?? 0),
    // employee_details:product.employee_details,
    // employee:product.employee,
    // logoUrl:product.logoUrl,
    // total_logo_cost:product.total_logo_cost,
    // selectlogo:product.selectlogo,
  };
}
