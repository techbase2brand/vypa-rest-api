import { useModalAction } from '@/components/ui/modal/modal.context';
import { RadioGroup } from '@headlessui/react';
import { useAtom, WritableAtom } from 'jotai';
import { useEffect } from 'react';
import AddressCard from '@/components/address/address-card';
import { AddressHeader } from '@/components/address/address-header';
import { useTranslation } from 'next-i18next';
import { Address } from '@/types';

interface AddressesProps {
  addresses: Address[] | undefined;
  label: string;
  atom: WritableAtom<Address | null, any, Address>;
  className?: string;
  userId: string;
  count: number;
  type: string;
  employeeId: any;
}

export const AddressGrid: React.FC<AddressesProps> = ({
  addresses,
  label,
  atom,
  className,
  userId,
  count,
  type,
  employeeId,
}) => {
  const { t } = useTranslation('common');
  const [selectedAddress, setAddress] = useAtom(atom);
  const { openModal } = useModalAction();

  useEffect(() => {
    if (addresses?.length) {
      if (selectedAddress?.id) {
        const index = addresses?.findIndex((a) => a.id === selectedAddress.id);
        setAddress(addresses[index]);
      } else {
        setAddress(addresses?.[0]);
      }
    }
  }, [addresses, addresses?.length, selectedAddress?.id, setAddress]);

  function onAdd() {
    openModal('ADD_OR_UPDATE_ADDRESS', { customerId: userId, type });
  }

  return (
    <div className={className}>
    { addresses?.length ==0
     && <AddressHeader onAdd={onAdd} count={count} label={label} />}
      {addresses && addresses?.length ? (
        <RadioGroup value={selectedAddress} onChange={setAddress}>
          <RadioGroup.Label className="font-bold">{label}</RadioGroup.Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {/* {addresses?.map((address) => (
              <RadioGroup.Option value={address} key={address.id}>
                {({ checked }) => (
                  <AddressCard
                    checked={checked}
                    address={address}
                    userId={userId}
                  />
                )}
              </RadioGroup.Option>
            ))} */}
            {addresses?.length > 0 && (
              <RadioGroup.Option
                value={addresses[addresses.length - 1]}
                key={addresses[addresses.length - 1].id}
              >
                {({ checked }) => (
                  <AddressCard
                    checked={checked}
                    address={addresses[addresses.length - 1]}
                    userId={userId}
                  />
                )}
              </RadioGroup.Option>
            )}
          </div>
        </RadioGroup>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('text-no-address')}
          </span>
        </div>
      )}
    </div>
  );
};
export default AddressGrid;
