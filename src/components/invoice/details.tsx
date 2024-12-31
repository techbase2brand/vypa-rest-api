import Pagination from '@/components/ui/pagination';
import Image from 'next/image';
import { Table } from '@/components/ui/table';
import { SortOrder } from '@/types';
import { siteSettings } from '@/settings/site.settings';
import usePrice from '@/utils/use-price';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import TitleWithSort from '@/components/ui/title-with-sort';
import { Coupon, MappedPaginatorInfo, Attachment } from '@/types';
import { Routes } from '@/config/routes';
import LanguageSwitcher from '@/components/ui/lang-action/action';
import { NoDataFound } from '@/components/icons/no-data-found';
import { useIsRTL } from '@/utils/locals';
import Badge from '../ui/badge/badge';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import LinkButton from '../ui/link-button';
import Link from 'next/link';
import Card from '../common/card';
import PageHeading from '@/components/common/page-heading';
import Button from '../ui/button';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

type IProps = {
  // coupons: CouponPaginator | null | undefined;
  coupons: Coupon[] | undefined;
  paginatorInfo: MappedPaginatorInfo | null;
  onPagination: (current: number) => void;
  onSort: (current: any) => void;
  onOrder: (current: string) => void;
};
const InvoiceDetails = ({
  coupons,
  paginatorInfo,
  onPagination,
  onSort,
  onOrder,
}: IProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    query: { shop },
  } = router;
  const { alignLeft } = useIsRTL();

  const [sortingObj, setSortingObj] = useState<{
    sort: SortOrder;
    column: string | null;
  }>({
    sort: SortOrder.Desc,
    column: null,
  });
 

 

  return (
    <>
      <div className="mb-6 overflow-hidden rounded shadow">
        <p className='mb-4'>Order #36071 was placed on 24/01/2024 and is currently completed</p>
        <Card>
        <PageHeading title='Invoice Details' />
        <div className="grid grid-cols-2 gap-4 border-b pb-3">
          <div className='mt-4'>
          <p>Product</p>
          <small>DNC 3710 HI-VIS X BACK & BIO-MOTION TAPED POLO</small>
          <p className='pt-2'><b>Size:</b> <span>Size Medium</span></p>
          <p><b>Color:</b> <span>Rail Orange</span></p>
          </div>
          <p className='mt-5'>$42.50</p> 
        </div>

        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2">
          <b>Subtotal:</b>  
          <p>$42.50</p>  
        </div>
        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2">
          <b>Shipping:</b>  
          <p>$42.50</p>  
        </div>
        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2">
          <b>GST:</b>  
          <p>$42.50</p>  
        </div>
        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2">
          <b>Payment Method:</b>  
          <div>
          <p>Purchase Order</p>  
          <p>PO Number:1234567</p>  
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2">
          <b>Tracking ID:</b>  
          <p>LP-12345-628-110</p>  
        </div>
        <div className="grid grid-cols-2 gap-4  pb-3 pt-2">
          <b>Total</b>  
          <b>$74.75</b>  
        </div>

        <Button className='bg-black mt-4 hover:bg-black'>Order Again</Button>

        </Card>
        <div className="grid grid-cols-2 gap-4 border-b pb-3 pt-2 mt-3">
        <Card>
        <PageHeading title='Billing Address' />
          <p className='mt-2'>Ross Noakes</p>
          <p>VYPA</p>
          <p>115 Lackey Road</p>
          <p>Moss Vale New South Wales 2577</p> 
        </Card>
        <Card>
        <PageHeading title='Shipping Address' />
          <p className='mt-2'>Ross Noakes</p>
          <p>VYPA</p>
          <p>115 Lackey Road</p>
          <p>Moss Vale New South Wales 2577</p> 
        </Card>
        </div>
      </div>

  



    </>
  );
};

export default InvoiceDetails;
