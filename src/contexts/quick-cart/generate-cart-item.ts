import isEmpty from 'lodash/isEmpty';
interface Item {
  id: string | number;
  name: string;
  slug: string;
  image: {
    thumbnail: string;
    [key: string]: unknown;
  };
  price: number;
  sale_price?: number;
  quantity?: number;
  shop_id?: any,
  employee?: any,
  selectlogo?: any,
  total_logo_cost?: any,
  logoUrl?:any
  employee_details?:any
  [key: string]: unknown;
}
interface Variation {
  id: string | number;
  title: string;
  price: number;
  sale_price?: number;
  quantity: number;
  [key: string]: unknown;
  sku?:any
}
export function generateCartItem(item: Item, variation: Variation) {
  const {
    id,
    name,
    slug,
    image,
    price,
    sale_price,
    min_price,
    quantity,
    unit,
    is_digital,
    shop_id,
    empoyee,
    selectlogo,
    total_logo_cost,logoUrl,employee_details
  } = item;
  if (!isEmpty(variation)) {
    return {
      id: `${id}.${variation.id}`,
      productId: id,
      name: `${name} - ${variation.title}`,
      slug,
      unit,
      is_digital,
      stock: variation.quantity,
      price: variation?.min_price ? variation?.min_price : variation?.price,
      sale_price: variation?.sale_price,
      image: image?.thumbnail,
      variationId: variation?.id,
      sku:variation?.sku,
      shop_id,
      empoyee,
      selectlogo,
      total_logo_cost,
      employee_details,
      logoUrl
    };
  }
  return {
    id,
    name,
    slug,
    unit,
    is_digital,
    image: image?.thumbnail,
    stock: quantity,
    price: min_price ? min_price : price,
    sale_price: sale_price,
    shop_id,
    empoyee,
    selectlogo,
    employee_details,
    total_logo_cost,
  };
}
