import usePrice from '@/utils/use-price';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
interface Props {
  item: any;
  notAvailable?: boolean;
}

const ItemCard = ({ item, notAvailable }: Props) => {
  const { t } = useTranslation('common');
  const { price } = usePrice({
    amount: item.itemTotal,
  });
  
  return (
    <div className={cn('flex  justify-between items-start py-2 border-b border-gray-500')} key={item.id}>
      <div className='flex gap-4 items-start  '>
      <img src="https://images-na.ssl-images-amazon.com/images/I/61ICqngjm6L._AC_UX679_.jpg" alt="" className='w-[80px] rounded p-3 bg-white' />
      <p className="flex items-center justify-between text-base">
        <span
          className={cn('text-sm', notAvailable ? 'text-red-500' : 'text-body')}
        >
        
          <p className='text-md font-bold mb-3 text-[#000]'>{item.name}</p>  <span>{item.unit}</span>
          {/* <span
            className={cn(
              'text-sm font-bold',
              notAvailable ? 'text-red-500' : 'text-heading'
            )}
          >
            {item.quantity} X
          </span> */}
          <span>SKU: VP11255</span> 
        </span>
      </p>
      </div>
      <span
        className={cn('text-md text-[#000]', notAvailable ? 'text-red-500' : 'text-body')}
      >
        {!notAvailable ? price : t('text-unavailable')}
      </span>
    </div>
  );
};

export default ItemCard;
