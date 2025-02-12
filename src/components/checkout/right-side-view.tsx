import { verifiedResponseAtom } from '@/contexts/checkout';
import { useAtom } from 'jotai';
import isEmpty from 'lodash/isEmpty';
import dynamic from 'next/dynamic';

const UnverifiedItemList = dynamic(
  () => import('@/components/checkout/item/unverified-item-list')
);
const VerifiedItemList = dynamic(
  () => import('@/components/checkout/item/verified-item-list')
);

export const RightSideView = (employeeId:any) => {
  const [verifiedResponse] = useAtom(verifiedResponseAtom);
  if (isEmpty(verifiedResponse)) {
    return <UnverifiedItemList />;
  }
  //@ts-ignore
  return <VerifiedItemList employeeId={employeeId}/>;
};

export default RightSideView;
