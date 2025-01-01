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
      <div className="mb-6 overflow-hidden rounded">
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

        <Button className='bg-black mt-4 hover:bg-green-500'>
        <svg className="mr-1" fill="#fff" width="20px" height="20px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z"></path><path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z"></path></svg>
          Order Again</Button>

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
