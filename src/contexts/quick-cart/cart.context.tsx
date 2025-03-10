import React, { useCallback } from 'react';
import { cartReducer, State, initialState } from './cart.reducer';
import { Item, UpdateItemInput, getItem, inStock } from './cart.utils';
import { useLocalStorage } from '@/utils/use-local-storage';
import { CART_KEY } from '@/utils/constants';
import { useAtom } from 'jotai';
import { verifiedResponseAtom } from '@/contexts/checkout';
interface CartProviderState extends State {
  addItemToCart: (item: Item, quantity: number) => void;
  removeItemFromCart: (id: Item['id']) => void;
  clearItemFromCart: (id: Item['id']) => void;
  updateCartItem: (id: Item['id'], updates: Partial<Item>) => void; 
  getItemFromCart: (id: Item['id']) => any | undefined;
  isInCart: (id: Item['id']) => boolean;
  isInStock: (id: Item['id']) => boolean;
  resetCart: () => void;
}
export const cartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

cartContext.displayName = 'CartContext';

export const useCart = () => {
  const context = React.useContext(cartContext);
  if (context === undefined) {
    throw new Error(`useCart must be used within a CartProvider`);
  }
  return context;
};

export const CartProvider: React.FC<{ children?: React.ReactNode }> = (
  props
) => {
  const [savedCart, saveCart] = useLocalStorage(
    CART_KEY,
    JSON.stringify(initialState)
  );
  
  const [state, dispatch] = React.useReducer(
    cartReducer,
    JSON.parse(savedCart!)
  );
  const [, emptyVerifiedResponse] = useAtom(verifiedResponseAtom);
  React.useEffect(() => {
    emptyVerifiedResponse(null);
  }, [emptyVerifiedResponse, state]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const addItemToCart = (item: Item, quantity: number) =>
    dispatch({ type: 'ADD_ITEM_WITH_QUANTITY', item, quantity });

    
  const removeItemFromCart = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM_OR_QUANTITY', id });
  const clearItemFromCart = (id: Item['id']) =>
    dispatch({ type: 'REMOVE_ITEM', id });
  const isInCart = useCallback(
    (id: Item['id']) => !!getItem(state.items, id),
    [state.items]
  );
  // const updateCartItem = (id: Item['id'], item: UpdateItemInput) =>
  // console.log('UpdateCartItem Called:', id, item);
  // //@ts-ignore
  //   dispatch({ type: 'UPDATE_CART_ITEM', id, item });

  // const updateCartItem = useCallback(
  //   (id: Item['id'], item: Partial<Item>) => {
  //     console.log('UpdateCartItem Called:', id, item);
  //     //@ts-ignore
  //     dispatch({ type: 'UPDATE_CART_ITEM', id, item });
  //   },
  //   [dispatch]
  // );

  const updateCartItem = useCallback(
    (id: Item['id'], item: Partial<Item>) => {
      console.log('UpdateCartItem Called:', id, item);
      //@ts-ignore
      dispatch({ type: 'UPDATE_ITEM', id, item }); // Corrected action type
    },
    [dispatch]
  );
  
  const getItemFromCart = useCallback(
    (id: Item['id']) => getItem(state.items, id),
    [state.items]
  );
  const isInStock = useCallback(
    (id: Item['id']) => inStock(state.items, id),
    [state.items]
  );
  const resetCart = () => dispatch({ type: 'RESET_CART' });
  const value = React.useMemo(
    () => ({
      ...state,
      addItemToCart,
      removeItemFromCart,
      clearItemFromCart,
      getItemFromCart,
      updateCartItem,
      isInCart,
      isInStock,
      resetCart,
    }),
    [getItemFromCart, isInCart, isInStock, state]
  );
  return <cartContext.Provider value={value} {...props} />;
};
