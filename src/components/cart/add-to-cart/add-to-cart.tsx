import Counter from '@/components/ui/counter';
import AddToCartBtn from '@/components/cart/add-to-cart/add-to-cart-btn';
import { cartAnimation } from '@/utils/cart-animation';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { generateCartItem } from '@/contexts/quick-cart/generate-cart-item';

interface Props {
  data: any;
  variant?: 'helium' | 'neon' | 'argon' | 'oganesson' | 'single' | 'big';
  counterVariant?:
    | 'helium'
    | 'neon'
    | 'argon'
    | 'oganesson'
    | 'single'
    | 'details';
  counterClass?: string;
  variation?: any;
  disabled?: boolean;
}

export const AddToCart = ({
  data,
  variant = 'helium',
  counterVariant,
  counterClass,
  variation,
  disabled,
}: Props) => {
  const {
    addItemToCart,
    removeItemFromCart,
    isInStock,
    getItemFromCart,
    isInCart,
  } = useCart();
  const item = generateCartItem(data, variation);
console.log("item",item,data);

  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
  ) => {
    e.stopPropagation();
    //@ts-ignore
    addItemToCart(item, 1);
    if (!isInCart(item.id)) {
      cartAnimation(e);
    }
  };
  // const handleAddClick = (
  //   e: React.MouseEvent<HTMLButtonElement | MouseEvent>,
  // ) => {
  //   e.stopPropagation();
  //   // Get current quantity from the cart and increment by 1 dynamically
  //   const currentQuantity = getItemFromCart(item.id)?.quantity || 0;
  //   const incrementQuantity = currentQuantity + 1; // Increment quantity dynamically
  //   addItemToCart(item, incrementQuantity); // Pass the dynamic quantity to the action

  //   if (!isInCart(item.id)) {
  //     cartAnimation(e);
  //   }
  // };

  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    removeItemFromCart(item.id);
  };

  const outOfStock = isInCart(item?.id) && !isInStock(item.id);
  return !isInCart(item?.id) ? (
    <AddToCartBtn
      disabled={disabled || outOfStock}
      variant={variant}
      onClick={handleAddClick}
    />
  ) : (
    <>
      <Counter
        value={getItemFromCart(item.id).quantity}
        onDecrement={handleRemoveClick}
        onIncrement={handleAddClick}
        variant={counterVariant || variant}
        className={counterClass}
        disabled={outOfStock}
      />
    </>
  );
};
