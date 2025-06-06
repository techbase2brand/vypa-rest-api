import Coupon from '@/components/checkout/coupon';
import usePrice from '@/utils/use-price';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import { useTranslation } from 'next-i18next';
import { useCart } from '@/contexts/quick-cart/cart.context';
import {
  calculatePaidTotal,
  calculateTotal,
} from '@/contexts/quick-cart/cart.utils';
import { useAtom } from 'jotai';
import {
  couponAtom,
  discountAtom,
  payableAmountAtom,
  paymentGatewayAtom,
  verifiedResponseAtom,
  walletAtom,
} from '@/contexts/checkout';
import ItemCard from '@/components/checkout/item/item-card';
import { ItemInfoRow } from '@/components/checkout/item/item-info-row';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { PlaceOrderAction } from '@/components/checkout/place-order-action';
import Wallet from '@/components/checkout/wallet/wallet';
import { CouponType } from '@/types';
import { useSettingsQuery } from '@/data/settings';
import { useRouter } from 'next/router';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useState } from 'react';
interface Props {
  className?: string;
  employeeId?: any;
}
const VerifiedItemList: React.FC<Props> = ({ className, employeeId }) => {
  const { t } = useTranslation('common');
  const { locale } = useRouter();
  const { role } = getAuthCredentials();
  const { items, isEmpty: isEmptyCart } = useCart();
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  const [coupon, setCoupon] = useAtom(couponAtom);
  const [discount] = useAtom(discountAtom);
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedqutation, setIsCheckedQutation] = useState(false);

  const [payableAmount] = useAtom(payableAmountAtom);
  const [use_wallet] = useAtom(walletAtom);
  const [payment_gateway, setUsePaymentGateway] = useAtom(paymentGatewayAtom);
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const available_items = items?.filter(
    (item) => !verifiedResponse?.unavailable_products?.includes(item.id),
  );
  const { price: tax } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.total_tax ?? 0,
    },
  );

  const { price: shipping } = usePrice(
    verifiedResponse && {
      amount: verifiedResponse.shipping_charge ?? 0,
    },
  );

  const base_amount = calculateTotal(available_items);
  const { price: sub_total } = usePrice(
    verifiedResponse && {
      amount: base_amount,
    },
  );

  // Calculate Discount base on coupon type
  let calculateDiscount = 0;

  switch (coupon?.type) {
    case CouponType.PERCENTAGE:
      //@ts-ignore
      calculateDiscount = (base_amount * Number(discount)) / 100;
      break;
    case CouponType.FREE_SHIPPING:
      calculateDiscount = verifiedResponse
        ? verifiedResponse.shipping_charge
        : 0;
      break;
    default:
      calculateDiscount = Number(discount);
  }

  const { price: discountPrice } = usePrice(
    //@ts-ignore
    discount && {
      amount: Number(calculateDiscount),
    },
  );
  let freeShippings =
    options?.freeShipping && Number(options?.freeShippingAmount) <= base_amount;
  const totalPrice = verifiedResponse
    ? calculatePaidTotal(
        {
          totalAmount: base_amount,
          tax: verifiedResponse?.total_tax,
          shipping_charge: verifiedResponse?.shipping_charge,
        },
        Number(calculateDiscount),
      )
    : 0;
  const { price: total } = usePrice(
    verifiedResponse && {
      amount: totalPrice <= 0 ? 0 : totalPrice,
    },
  );

  return (
    <div className={className}>
      <div className="mb-4 flex flex-col space-s-4">
        <span className="text-xl font-bold text-heading">
          {t('text-your-order')}
        </span>
      </div>
      <div className="flex justify-between mb-5 bg-[#D3D0D0] p-3 rounded">
        <div className="flex gap-9">
          <b>Product</b>
          <b>Product Desc</b>
        </div>
        <b>Price</b>
      </div>
      <div className="flex flex-col border-b border-border-200 pb-2">
        {!isEmptyCart ? (
          items?.map((item) => {
            const notAvailable = verifiedResponse?.unavailable_products?.find(
              (d: any) => d === item.id,
            );
            return (
              <ItemCard
                item={item}
                key={item.id}
                notAvailable={!!notAvailable}
              />
            );
          })
        ) : (
          <EmptyCartIcon />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <ItemInfoRow title={t('text-sub-total')} value={sub_total} />
        <ItemInfoRow title={t('text-tax')} value={tax} />
        <div className="flex justify-between">
          <p className="text-sm text-body">
            {t('text-shipping')}{' '}
            <span className="text-xs font-semibold text-accent">
              {freeShippings && `(${t('text-free-shipping')})`}
            </span>
          </p>
          <span className="text-sm text-[#000] font-bold"> {shipping}</span>
        </div>
        {discount && coupon ? (
          <div className="flex justify-between">
            <p className="flex items-center gap-1 text-sm text-body me-2">
              {t('text-discount')}{' '}
              <span className="-mt-px text-xs font-semibold text-accent">
                {coupon?.type === CouponType.FREE_SHIPPING &&
                  `(${t('text-free-shipping')})`}
              </span>
            </p>
            <span className="flex items-center text-xs font-semibold text-red-500 me-auto">
              ({coupon?.code})
              <button onClick={() => setCoupon(null)}>
                <CloseIcon className="h-3 w-3 ms-2" />
              </button>
            </span>
            <span className="flex items-center gap-1 text-sm text-body">
              {calculateDiscount > 0 ? (
                <span className="-mt-0.5">-</span>
              ) : null}{' '}
              {discountPrice}
            </span>
          </div>
        ) : (
          <div className="mt-5 !mb-4 flex justify-between">
            {/* @ts-ignore */}

            <Coupon subtotal={base_amount} />
          </div>
        )}
        <div className="flex justify-between border-t-4 border-double border-border-200 pt-3">
          <p className="text-base font-semibold text-heading">
            {t('text-total')}
          </p>
          <span className="text-[#000] font-bold text-heading">{total}</span>
        </div>
      </div>
      {verifiedResponse && role !== 'super_admin' && (
        <Wallet
          totalPrice={totalPrice}
          walletAmount={verifiedResponse?.wallet_amount}
          walletCurrency={verifiedResponse?.wallet_amount}
          // walletCurrency={verifiedResponse?.wallet_currency}
        />
      )}
      {role !== 'super_admin' && (
        <div className="mt-10 w-full max-w-5xl mb-5 border-b border-gray-500 pb-3 mb-3 pr-8">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isCheckedqutation}
              onChange={(e) => setIsCheckedQutation(e.target.checked)}
              className="h-5 w-5 appearance-none border border-gray-500 rounded-md checked:bg-black checked:border-black focus:ring-2 focus:ring-black"
            />
            <span className="text-sm text-body">Quotation</span>
          </label>
          {isCheckedqutation && (
            <span className="text-sm text-body mt-10">
              Please Pay After You Receive Your Goods!
            </span>
          )}
        </div>
      )}
      {role !== 'super_admin' && (
        <div className="  mt-10 w-full max-w-5xl mb-5 border-b border-gray-500 pb-3 mb-3 pr-8">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={payment_gateway === 'EWAY'}
              onChange={(e) =>
                setUsePaymentGateway(e.target.checked ? 'EWAY' : 'CASH')
              }
              // onChange={setUsePaymentGateway}
              className="h-5 w-5 appearance-none border border-gray-500 rounded-md checked:bg-black checked:border-black focus:ring-2 focus:ring-black"
            />
            <span className="text-sm text-body">Use Credit Card</span>
          </label>
          {payment_gateway && (
            <PaymentGrid className="mt-10 border border-gray-200 bg-light p-5" />
          )}
        </div>
      )}
      <PlaceOrderAction>{t('text-place-order')}</PlaceOrderAction>
    </div>
  );
};

export default VerifiedItemList;
