export interface Item {
  id: string | number;
  price: number;
  sale_price?: number; 
  quantity?: number;
  stock?: number;
  shop_id?: any;
  empoyee?: any;
  selectlogo?: any;
  logoUrl?: any;
  total_logo_cost?: any;
  employee_details?: any;
  [key: string]: any;
}

export interface UpdateItemInput extends Partial<Omit<Item, 'id'>> {}

// export function addItemWithQuantity(
//   items: Item[],
//   item: Item,
//   quantity: number
// ) {
//   if (quantity <= 0)
//     throw new Error("cartQuantity can't be zero or less than zero");
//   const existingItemIndex = items.findIndex(
//     (existingItem) => existingItem.id === item.id
//   );

//   if (existingItemIndex > -1) {
//     const newItems = [...items];
//     newItems[existingItemIndex].quantity! += quantity;
//     return newItems;
//   }
//   return [...items, { ...item, quantity }];
// }

export function addItemWithQuantity(
  items: Item[],
  item: Item,
  quantity: number,
  shop_id?: any,
  empoyee?: any,
  selectlogo?: any,
  total_logo_cost?: any,
) {
  const existingItem = items.find(
    (existingItem) => existingItem.id === item.id,
  );
  if (existingItem) {
    // If the item already exists, increment the quantity by the specified amount
    return items.map((existingItem) =>
      existingItem.id === item.id
        ? //@ts-ignore
          { ...existingItem, quantity: existingItem.quantity + quantity }
        : existingItem,
    );
  } else {
    // If the item does not exist, add it with the given quantity
    return [...items, { ...item, quantity }];
  }
}

export function removeItemOrQuantity(
  items: Item[],
  id: Item['id'],
  quantity: number,
) {
  return items.reduce((acc: Item[], item) => {
    if (item.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
// Simple CRUD for Item
export function addItem(items: Item[], item: Item) {
  console.log('items:', items, item);

  return [...items, item];
}

export function getItem(items: Item[], id: Item['id']) {
  return items.find((item) => item.id === id);
}

// export function updateItem(
//   items: Item[],
//   id: Item['id'],
//   item: Item,
// ) {
//   console.log('updateItem:', items, id, item);
//   return items.map((existingItem) =>
//     existingItem.id === id ? item  : existingItem,
//   );
// }
export function updateItem(
  items: Item[],
  id: Item['id'],
  updates: Partial<Item>, // Accept partial updates
) {
  return items.map((existingItem) =>
    existingItem.id === id
      ? { ...existingItem, ...updates } // Merge updates
      : existingItem,
  );
}
export function removeItem(items: Item[], id: Item['id']) {
  return items.filter((existingItem) => existingItem.id !== id);
}
export function inStock(items: Item[], id: Item['id']) {
  const item = getItem(items, id);
  if (item) return item['quantity']! < item['stock']!;
  return false;
}
export const calculateItemTotals = (items: Item[]) =>
  items.map((item) => {
    const effectivePrice = item.sale_price ?? item.price; 
    return {
      ...item,
      itemTotal: effectivePrice * item.quantity!,
    };
  });

// export const calculateTotal = (items: Item[]) =>{
// console.log("calculateTotal",items);
// items.reduce((total, item) => total + item.quantity! * item.price, 0);
//   // items.reduce((total, item) => total + item.quantity! * item.price, 0);
// }
export const calculateTotal = (items: Item[]) => {
  const total = items.reduce((total, item) => {
    const itemPrice = item.sale_price ?? item.price ?? 0; 
    const logoCost = item.total_logo_cost ?? 0;
    const quantity = item.quantity ?? 1;
    const itemTotal = quantity * itemPrice;

    return total + itemTotal + logoCost * quantity;
  }, 0);

  return total;
};

export const calculateTotalItems = (items: Item[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: Item[]) => items.length;

interface PriceValues {
  totalAmount: number;
  tax: number;
  shipping_charge: number;
}
export const calculatePaidTotal = (
  { totalAmount, tax, shipping_charge }: PriceValues,
  discount?: number,
) => {
  let paidTotal = totalAmount + tax + shipping_charge;
  if (discount) {
    paidTotal = paidTotal - discount;
  }
  return paidTotal;
};
