import { useTranslation } from 'next-i18next';
import {
  billingAddressAtom,
  customerAtom,
  shippingAddressAtom,
} from '@/contexts/checkout';
import dynamic from 'next/dynamic';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import Layout from '@/components/layouts/admin';
import { adminOnly, getAuthCredentials } from '@/utils/auth-utils';
import CustomerGrid from '@/components/checkout/customer/customer-grid';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import Loader from '@/components/ui/loader/loader';
import { useUserQuery } from '@/data/user';
import { AddressType } from '@/types';
import Multiselect from 'multiselect-react-dropdown';

import FileInput from '@/components/ui/file-input';
import Card from '@/components/common/card';
import { FormValues } from '@/components/shop/approve-shop';
import { useForm } from 'react-hook-form';
import PaymentGrid from '@/components/checkout/payment/payment-grid';
import { useShopsQuery } from '@/data/shop';
import { useCart } from '@/contexts/quick-cart/cart.context';
import Button from '@/components/ui/button';

const ScheduleGrid = dynamic(
  () => import('@/components/checkout/schedule/schedule-grid'),
);
const AddressGrid = dynamic(() => import('@/components/checkout/address-grid'));
const ContactGrid = dynamic(
  () => import('@/components/checkout/contact/contact-grid'),
);
const RightSideView = dynamic(
  () => import('@/components/checkout/right-side-view'),
);

export default function CheckoutPage() {
  const [customer] = useAtom(customerAtom);
  // State to handle the selected options
  const { items, isEmpty: isEmptyCart } = useCart();
  const { role } = getAuthCredentials();
  const employeeId =
    items?.length === 1 ||
    items?.every((item) => item?.employee === items[0]?.employee)
      ? items[0]?.employee
      : items[0]?.owner_id;

  console.log('Selected Employee ID:', employeeId);
  console.log('rolerolerole', items);

  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState([]);
  const [activeTab, setActiveTab] = useState('first');
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [orderBy, setOrder] = useState('created_at');
  const { t } = useTranslation();
  const {
    data: user,
    // isLoading: loading,
    refetch,
  } = useUserQuery({ id: customer?.value });

  useEffect(() => {
    if (customer?.value) {
      refetch(customer?.value);
    }
  }, [customer?.value]);

  //@ts-ignore
  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    name: searchTerm,
    limit: 100,
    page,
    orderBy,
  });

  // if (loading) return <Loader text={t('common:text-loading')} />;
  const groups = [
    { name: 'John Doe', id: 1 },
    { name: 'Jane Smith', id: 2 },
    { name: 'Mike Johnson', id: 3 },
    { name: 'Emily Davis', id: 4 },
  ];

  return (
    <div className="bg-gray-100">
      <div className="flex">
        <div className="tabs__checkout w-[15%]">
          <div
            className={`p-8 rounded text-center mb-4 cursor-pointer ${
              activeTab === 'first'
                ? 'bg-black text-white'
                : 'bg-white border border-black text-black'
            }`}
            onClick={() => setActiveTab('first')}
          >
            <svg
              className="m-auto"
              width="97"
              height="53"
              viewBox="0 0 97 53"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M83.4724 52.672C81.8455 52.6732 80.2549 52.1918 78.9016 51.2889C77.5484 50.3859 76.4933 49.1019 75.8699 47.5992C75.2466 46.0966 75.0828 44.4428 75.3995 42.847C75.7161 41.2513 76.4989 39.7853 77.6489 38.6346C78.7988 37.4838 80.2642 36.6999 81.8597 36.3821C83.4552 36.0643 85.1091 36.2268 86.6122 36.8491C88.1153 37.4714 89.4001 38.5255 90.3041 39.8781C91.208 41.2307 91.6905 42.821 91.6905 44.4478C91.6895 46.6276 90.8235 48.7179 89.2827 50.2599C87.7419 51.8018 85.6522 52.6693 83.4724 52.672ZM83.4724 39.2237C82.4389 39.2225 81.4283 39.5279 80.5684 40.1012C79.7085 40.6745 79.038 41.49 78.6416 42.4445C78.2453 43.3989 78.141 44.4495 78.3419 45.4633C78.5428 46.4771 79.0399 47.4085 79.7702 48.1397C80.5006 48.8709 81.4314 49.369 82.445 49.5711C83.4585 49.7731 84.5092 49.67 85.4641 49.2748C86.4191 48.8796 87.2353 48.21 87.8096 47.3508C88.3839 46.4916 88.6905 45.4813 88.6905 44.4478C88.6899 43.0635 88.1402 41.7359 87.1619 40.7565C86.1836 39.7771 84.8567 39.2258 83.4724 39.2237Z"
                fill="currentColor"
              />
              <path
                d="M40.1345 52.672C38.5076 52.6735 36.9167 52.1926 35.5632 51.2898C34.2097 50.3871 33.1544 49.1032 32.5307 47.6006C31.907 46.098 31.743 44.4441 32.0594 42.8483C32.3758 41.2524 33.1585 39.7862 34.3083 38.6353C35.4582 37.4843 36.9236 36.7002 38.5191 36.3822C40.1147 36.0643 41.7687 36.2267 43.2719 36.8489C44.7752 37.4711 46.0601 38.5252 46.9641 39.8779C47.8681 41.2305 48.3507 42.8209 48.3507 44.4478C48.3491 46.6271 47.4832 48.7168 45.943 50.2586C44.4027 51.8003 42.3138 52.6683 40.1345 52.672ZM40.1345 39.2237C39.1009 39.2221 38.0901 39.5272 37.23 40.1002C36.3698 40.6733 35.699 41.4886 35.3024 42.4431C34.9057 43.3975 34.8011 44.4482 35.0018 45.4621C35.2025 46.476 35.6994 47.4076 36.4297 48.139C37.16 48.8704 38.0908 49.3687 39.1044 49.5709C40.118 49.7732 41.1688 49.6702 42.1238 49.275C43.0789 48.8798 43.8953 48.2103 44.4696 47.351C45.044 46.4917 45.3506 45.4814 45.3506 44.4478C45.3496 43.064 44.7999 41.737 43.8222 40.7578C42.8444 39.7785 41.5183 39.2269 40.1345 39.2237Z"
                fill="currentColor"
              />
              <path
                d="M94.2921 45.9478H90.19C89.7922 45.9478 89.4106 45.7897 89.1293 45.5084C88.848 45.2271 88.69 44.8456 88.69 44.4477C88.69 44.0499 88.848 43.6684 89.1293 43.3871C89.4106 43.1057 89.7922 42.9477 90.19 42.9477H93.8681V34.9936C93.8671 33.9181 93.5917 32.8608 93.0681 31.9215L84.9479 17.3632C84.8785 17.239 84.7773 17.1355 84.6546 17.0634C84.5319 16.9913 84.3922 16.9533 84.2499 16.9532H73.1837V42.9537H76.7557C77.1536 42.9537 77.5351 43.1118 77.8164 43.3931C78.0977 43.6744 78.2558 44.0559 78.2558 44.4537C78.2558 44.8516 78.0977 45.2331 77.8164 45.5144C77.5351 45.7957 77.1536 45.9538 76.7557 45.9538H71.6836C71.2858 45.9538 70.9043 45.7957 70.6229 45.5144C70.3416 45.2331 70.1836 44.8516 70.1836 44.4537V15.4532C70.1836 15.0553 70.3416 14.6738 70.6229 14.3925C70.9043 14.1112 71.2858 13.9531 71.6836 13.9531H84.2499C84.9266 13.9528 85.5911 14.1332 86.1748 14.4757C86.7585 14.8181 87.2401 15.3102 87.5699 15.9012L95.6881 30.4615C96.4599 31.8474 96.8654 33.4072 96.8661 34.9936V43.3737C96.8651 44.0561 96.5935 44.7102 96.111 45.1927C95.6285 45.6752 94.9744 45.9467 94.2921 45.9478Z"
                fill="currentColor"
              />
              <path
                d="M33.4175 45.9474H19.0352C18.6374 45.9474 18.2558 45.7894 17.9745 45.5081C17.6932 45.2268 17.5352 44.8452 17.5352 44.4474V32.9112C17.5352 32.5133 17.6932 32.1318 17.9745 31.8505C18.2558 31.5692 18.6374 31.4111 19.0352 31.4111C19.433 31.4111 19.8146 31.5692 20.0959 31.8505C20.3772 32.1318 20.5352 32.5133 20.5352 32.9112V42.9474H33.4175C33.8153 42.9474 34.1968 43.1054 34.4782 43.3867C34.7595 43.668 34.9175 44.0496 34.9175 44.4474C34.9175 44.8452 34.7595 45.2268 34.4782 45.5081C34.1968 45.7894 33.8153 45.9474 33.4175 45.9474Z"
                fill="currentColor"
              />
              <path
                d="M19.0352 27.5898C18.6374 27.5898 18.2558 27.4318 17.9745 27.1505C17.6932 26.8692 17.5352 26.4876 17.5352 26.0898V16.0176C17.5352 15.6198 17.6932 15.2382 17.9745 14.9569C18.2558 14.6756 18.6374 14.5176 19.0352 14.5176C19.433 14.5176 19.8146 14.6756 20.0959 14.9569C20.3772 15.2382 20.5352 15.6198 20.5352 16.0176V26.0958C20.5336 26.4926 20.3749 26.8726 20.0938 27.1526C19.8126 27.4326 19.432 27.5898 19.0352 27.5898Z"
                fill="currentColor"
              />
              <path
                d="M71.6863 45.948H46.8518C46.4539 45.948 46.0724 45.79 45.7911 45.5086C45.5098 45.2273 45.3517 44.8458 45.3517 44.448C45.3517 44.0501 45.5098 43.6686 45.7911 43.3873C46.0724 43.106 46.4539 42.9479 46.8518 42.9479H70.1862V3.70514H20.5352V9.88326C20.5352 10.2811 20.3772 10.6626 20.0959 10.9439C19.8146 11.2253 19.433 11.3833 19.0352 11.3833C18.6374 11.3833 18.2558 11.2253 17.9745 10.9439C17.6932 10.6626 17.5352 10.2811 17.5352 9.88326V3.42913C17.5362 2.70665 17.8238 2.01409 18.3349 1.5034C18.846 0.99271 19.5387 0.705607 20.2612 0.705078H70.4622C71.1844 0.706136 71.8766 0.993473 72.3873 1.5041C72.8979 2.01473 73.1852 2.70699 73.1863 3.42913V44.448C73.1863 44.8458 73.0282 45.2273 72.7469 45.5086C72.4656 45.79 72.0841 45.948 71.6863 45.948Z"
                fill="currentColor"
              />
              <path
                d="M24.9642 34.4112H5.92581C5.52798 34.4112 5.14644 34.2532 4.86513 33.9718C4.58382 33.6905 4.42578 33.309 4.42578 32.9112C4.42578 32.5133 4.58382 32.1318 4.86513 31.8505C5.14644 31.5692 5.52798 31.4111 5.92581 31.4111H24.9642C25.362 31.4111 25.7436 31.5692 26.0249 31.8505C26.3062 32.1318 26.4642 32.5133 26.4642 32.9112C26.4642 33.309 26.3062 33.6905 26.0249 33.9718C25.7436 34.2532 25.362 34.4112 24.9642 34.4112Z"
                fill="currentColor"
              />
              <path
                d="M40.133 27.5899H13.5664C13.1686 27.5899 12.7871 27.4319 12.5058 27.1506C12.2244 26.8692 12.0664 26.4877 12.0664 26.0899C12.0664 25.692 12.2244 25.3105 12.5058 25.0292C12.7871 24.7479 13.1686 24.5898 13.5664 24.5898H40.133C40.5308 24.5898 40.9124 24.7479 41.1937 25.0292C41.475 25.3105 41.633 25.692 41.633 26.0899C41.633 26.4877 41.475 26.8692 41.1937 27.1506C40.9124 27.4319 40.5308 27.5899 40.133 27.5899Z"
                fill="currentColor"
              />
              <path
                d="M12.7414 19.669H2.36722C1.96939 19.669 1.58785 19.511 1.30654 19.2297C1.02523 18.9483 0.867188 18.5668 0.867188 18.169C0.867188 17.7711 1.02523 17.3896 1.30654 17.1083C1.58785 16.827 1.96939 16.6689 2.36722 16.6689H12.7414C13.1393 16.6689 13.5208 16.827 13.8021 17.1083C14.0834 17.3896 14.2415 17.7711 14.2415 18.169C14.2415 18.5668 14.0834 18.9483 13.8021 19.2297C13.5208 19.511 13.1393 19.669 12.7414 19.669Z"
                fill="currentColor"
              />
              <path
                d="M29.3749 11.3829H11.0625C10.6647 11.3829 10.2832 11.2248 10.0018 10.9435C9.72054 10.6622 9.5625 10.2807 9.5625 9.88284C9.5625 9.48501 9.72054 9.10347 10.0018 8.82216C10.2832 8.54085 10.6647 8.38281 11.0625 8.38281H29.3749C29.7727 8.38281 30.1543 8.54085 30.4356 8.82216C30.7169 9.10347 30.8749 9.48501 30.8749 9.88284C30.8749 10.2807 30.7169 10.6622 30.4356 10.9435C30.1543 11.2248 29.7727 11.3829 29.3749 11.3829Z"
                fill="currentColor"
              />
            </svg>
            <p className="mt-4">Shipping Info</p>
          </div>
          {/* {role !== 'super_admin' && (
            <div
              className={`p-8 rounded text-center mb-4 cursor-pointer ${
                activeTab === 'second'
                  ? 'bg-black text-white'
                  : 'bg-white border border-black text-black'
              }`}
              onClick={() => setActiveTab('second')}
            >
              <svg
                className="m-auto"
                width="75"
                height="66"
                viewBox="0 0 75 66"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M69.5815 0.253907H14.0028C12.5994 0.253424 11.2533 0.813137 10.2596 1.81021C9.26602 2.80729 8.70613 4.16027 8.70285 5.57224V16.2232H6.1529C4.75147 16.2246 3.40784 16.7854 2.41688 17.7825C1.42592 18.7795 0.868587 20.1315 0.867188 21.5415V56.1769C0.868587 57.587 1.42592 58.9389 2.41688 59.936C3.40784 60.9331 4.75147 61.4939 6.1529 61.4953H44.0382C44.3845 61.489 44.7146 61.3462 44.9574 61.0975C45.2001 60.8489 45.3361 60.5142 45.3361 60.1657C45.3361 59.8171 45.2001 59.4825 44.9573 59.2338C44.7145 58.9852 44.3844 58.8423 44.0381 58.8361H6.1529C5.45225 58.8352 4.78056 58.5547 4.28512 58.0563C3.78969 57.5578 3.51095 56.8819 3.51004 56.1769V26.8845H64.3887V33.5208C64.3887 33.8734 64.5279 34.2116 64.7757 34.4609C65.0235 34.7103 65.3596 34.8504 65.7101 34.8504C66.0606 34.8504 66.3967 34.7103 66.6445 34.4609C66.8923 34.2116 67.0315 33.8734 67.0315 33.5208V21.5415C67.0301 20.1315 66.4728 18.7795 65.4818 17.7825C64.4909 16.7854 63.1472 16.2246 61.7458 16.2232H11.3457V5.57224C11.3485 4.86538 11.6298 4.18848 12.1279 3.68999C12.626 3.1915 13.3002 2.91211 14.0028 2.91308H69.5815C70.2821 2.91399 70.9538 3.19445 71.4492 3.69294C71.9447 4.19143 72.2234 4.86727 72.2243 5.57224V38.334C72.2299 38.6829 72.3716 39.0157 72.6188 39.2604C72.8661 39.5052 73.199 39.6423 73.5458 39.6423C73.8926 39.6423 74.2255 39.5051 74.4727 39.2604C74.7199 39.0156 74.8616 38.6829 74.8672 38.334V5.57224C74.8658 4.16217 74.3085 2.81024 73.3175 1.81317C72.3265 0.81609 70.9829 0.255315 69.5815 0.253907ZM61.7458 18.8824C62.4465 18.8833 63.1182 19.1637 63.6136 19.6622C64.109 20.1607 64.3878 20.8366 64.3887 21.5415V24.2254H3.51004V21.5415C3.51095 20.8366 3.78969 20.1607 4.28512 19.6622C4.78056 19.1637 5.45225 18.8833 6.1529 18.8824H61.7458Z"
                  fill="currentColor"
                />
                <path
                  d="M10.1538 46.6953C9.45024 46.6962 8.77577 46.9833 8.27829 47.4936C7.7808 48.0038 7.50091 48.6956 7.5 49.4172V52.139C7.50091 52.8606 7.7808 53.5523 8.27829 54.0626C8.77577 54.5728 9.45024 54.8599 10.1538 54.8608H18.1152C18.8187 54.8599 19.4932 54.5728 19.9907 54.0626C20.4882 53.5523 20.7681 52.8606 20.769 52.139V49.4172C20.7681 48.6956 20.4882 48.0038 19.9907 47.4936C19.4932 46.9833 18.8187 46.6962 18.1152 46.6953H10.1538ZM10.1538 52.139V49.4172H18.1152L18.1165 52.139H10.1538Z"
                  fill="currentColor"
                />
                <path
                  d="M60.3222 36.4883C56.466 36.4928 52.7691 38.0306 50.0424 40.7643C47.3157 43.4979 45.7819 47.2042 45.7773 51.0702C46.5675 70.4167 74.0798 70.411 74.867 51.0701C74.8624 47.2041 73.3285 43.4978 70.6018 40.7642C67.8751 38.0306 64.1783 36.4928 60.3222 36.4883ZM60.3222 63.0009C57.1668 62.9984 54.1413 61.7406 51.9101 59.5037C49.6789 57.2668 48.4244 54.2337 48.4219 51.0702C49.0688 35.248 71.578 35.2525 72.2225 51.0703C72.22 54.2337 70.9654 57.2669 68.7342 59.5037C66.503 61.7406 63.4776 62.9984 60.3222 63.0009Z"
                  fill="currentColor"
                />
                <path
                  d="M62.3991 57.8667H61.8421V49.0197C61.8422 48.8484 61.8096 48.6788 61.7461 48.5206C61.6826 48.3624 61.5894 48.2186 61.472 48.0975C61.3546 47.9764 61.2151 47.8804 61.0617 47.8149C60.9082 47.7494 60.7438 47.7157 60.5777 47.7158H58.7563C58.4251 47.7223 58.1096 47.8625 57.8776 48.1064C57.6456 48.3502 57.5156 48.6781 57.5156 49.0197C57.5156 49.3613 57.6456 49.6893 57.8776 49.9331C58.1096 50.1769 58.4252 50.3171 58.7564 50.3236H59.3132V57.8667H58.7563C58.4252 57.8734 58.1099 58.0137 57.878 58.2575C57.6461 58.5013 57.5163 58.8291 57.5163 59.1706C57.5163 59.5121 57.6462 59.8399 57.878 60.0837C58.1099 60.3275 58.4253 60.4678 58.7564 60.4744H62.3991C62.7303 60.468 63.0458 60.3277 63.2778 60.0839C63.5098 59.8401 63.6398 59.5122 63.6398 59.1706C63.6398 58.829 63.5098 58.501 63.2778 58.2572C63.0458 58.0134 62.7303 57.8732 62.3991 57.8667Z"
                  fill="currentColor"
                />
                <path
                  d="M62.1101 43.8888C62.1025 43.4127 61.8841 42.9585 61.5021 42.6242C61.1201 42.2899 60.6052 42.1025 60.0688 42.1025C59.5323 42.1025 59.0175 42.2899 58.6354 42.6242C58.2534 42.9584 58.035 43.4127 58.0273 43.8887C58.035 44.3648 58.2534 44.819 58.6354 45.1533C59.0174 45.4876 59.5323 45.6749 60.0687 45.675C60.6051 45.675 61.12 45.4876 61.502 45.1533C61.884 44.8191 62.1025 44.3648 62.1101 43.8888Z"
                  fill="black"
                />
              </svg>
              <p className="mt-4">Payment Info</p>
            </div>
          )} */}
          <div
            className={`p-8 rounded text-center mb-4 cursor-pointer ${
              activeTab === 'third'
                ? 'bg-black text-white'
                : 'bg-white border border-black text-black'
            }`}
            onClick={() => setActiveTab('third')}
          >
            <svg
              className="m-auto"
              width="62"
              height="62"
              viewBox="0 0 62 62"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M44.0366 24.1729C44.8041 23.3532 44.7617 22.0664 43.9419 21.299C43.1222 20.5315 41.8354 20.5739 41.068 21.3937L27.324 36.0748L21.67 30.0354C20.9026 29.2156 19.6158 29.1732 18.7961 29.9406C17.9762 30.708 17.9338 31.9948 18.7013 32.8146L25.8395 40.4395C26.224 40.8503 26.7615 41.0833 27.324 41.0833C27.8865 41.0833 28.4239 40.8503 28.8083 40.4395L44.0366 24.1729Z"
                fill="currentColor"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M37.2836 2.75283C33.9546 -0.362921 28.7798 -0.362921 25.4508 2.75283L22.5681 5.45082C21.7556 6.21126 20.6946 6.65073 19.5825 6.68753L15.6363 6.81809C11.0792 6.96887 7.42004 10.628 7.26926 15.1851L7.1387 19.1313C7.10191 20.2434 6.66243 21.3044 5.902 22.117L3.204 24.9996C0.0882508 28.3286 0.0882508 33.5034 3.204 36.8324L5.902 39.715C6.66243 40.5276 7.10191 41.5886 7.1387 42.7008L7.26926 46.6469C7.42004 51.204 11.0792 54.8632 15.6363 55.0139L19.5825 55.1445C20.6946 55.1813 21.7556 55.6208 22.5681 56.3812L25.4508 59.0792C28.7798 62.195 33.9546 62.195 37.2836 59.0792L40.1662 56.3812C40.9787 55.6208 42.0397 55.1813 43.1519 55.1445L47.0981 55.0139C51.6552 54.8632 55.3143 51.204 55.4651 46.6469L55.5957 42.7008C55.6325 41.5886 56.072 40.5276 56.8323 39.715L59.5304 36.8324C62.6461 33.5034 62.6461 28.3286 59.5304 24.9996L56.8323 22.117C56.072 21.3044 55.6325 20.2434 55.5957 19.1313L55.4651 15.1851C55.3143 10.628 51.6552 6.96887 47.0981 6.81809L43.152 6.68753C42.0397 6.65073 40.9787 6.21125 40.1662 5.45082L37.2836 2.75283ZM28.2296 5.72191C29.9951 4.06961 32.7393 4.06961 34.5047 5.72191L37.3874 8.41991C38.9194 9.85383 40.9202 10.6826 43.0175 10.752L46.9635 10.8825C49.3802 10.9625 51.3207 12.903 51.4007 15.3196L51.5312 19.2657C51.6006 21.363 52.4293 23.3638 53.8633 24.8958L56.5613 27.7785C58.2136 29.5439 58.2136 32.2881 56.5613 34.0535L53.8633 36.9362C52.4293 38.4682 51.6006 40.469 51.5312 42.5663L51.4007 46.5124C51.3207 48.929 49.3802 50.8695 46.9635 50.9495L43.0175 51.0801C40.9202 51.1494 38.9194 51.9782 37.3874 53.4121L34.5047 56.1101C32.7393 57.7624 29.9951 57.7624 28.2296 56.1101L25.347 53.4121C23.815 51.9782 21.8142 51.1494 19.7169 51.0801L15.7708 50.9495C13.3542 50.8695 11.4137 48.929 11.3337 46.5124L11.2031 42.5663C11.1338 40.469 10.305 38.4682 8.87108 36.9362L6.17308 34.0535C4.52078 32.2881 4.52078 29.5439 6.17308 27.7785L8.87108 24.8958C10.305 23.3638 11.1338 21.363 11.2031 19.2657L11.3337 15.3196C11.4137 12.903 13.3542 10.9625 15.7708 10.8825L19.7169 10.752C21.8142 10.6826 23.815 9.85383 25.347 8.41991L28.2296 5.72191Z"
                fill="currentColor"
              />
            </svg>
            <p className="mt-4">Confirmation</p>
          </div>
        </div>
        <div className="w-[85%]">
          {activeTab === 'first' && (
            <div className="firstTabShow pl-8 pr-8">
              <h1 className="text-xl font-bold max-w-5xl m-auto pb-8">
                Checkout
              </h1>
              <div className="m-auto grid grid-cols-2 w-full max-w-5xl gap-4 items-center   mb-5 border-b border-gray-500 pb-3 mb-3">
                {/* <div>
                  <p className="mb-2">Select Company</p>
                  <Multiselect
                    placeholder="Select Company"
                    displayValue="name"
                    onSelect={(selectedList) =>
                      setSelectedCompany(selectedList)
                    }
                    onRemove={(selectedList) =>
                      setSelectedCompany(selectedList)
                    }
                    options={groups}
                    showCheckbox
                  />
                </div> */}
                {/* <div>
                  <p className="mb-2">Select Employee</p>
                  <Multiselect
                    placeholder="Select Employee"
                    displayValue="name"
                    onSelect={(selectedList) =>
                      setSelectedEmployees(selectedList)
                    }
                    onRemove={(selectedList) =>
                      setSelectedEmployees(selectedList)
                    }
                    options={groups}
                    showCheckbox
                  />
                </div> */}
              </div>
              <div className="lg:space-s-8 m-auto flex w-full max-w-5xl flex-col items-center lg:flex-row lg:items-start">
                <div className="w-full space-y-6 lg:max-w-1xl">
                  <CustomerGrid
                    className="border-b border-black pb-4"
                    //@ts-ignore
                    // contact={user?.profile?.contact}
                    // employeeId={items?.[0]?.employee}
                    employeeId={
                      items.length === 1 ||
                      items.every((item) => item.employee === items[0].employee)
                        ? items[0]?.employee
                        : items[0]?.owner_id
                    }
                    label={t('text-customer')}
                    // count={1}
                  />
                  {/* @ts-ignore */}
                  <ContactGrid
                    className="border-b border-black pb-4"
                    //@ts-ignore
                    employeeId={
                      items.length === 1 ||
                      items.every((item) => item.employee === items[0].employee)
                        ? items[0].employee
                        : items[0].owner_id
                    }
                    // contact={user?.profile?.contact}
                    label={t('text-contact-number')}
                  />
                  <AddressGrid
                    // userId={items?.[0]?.employee!}
                    // userId={items?.[0]?.employee!}

                    className="border-b border-black pb-4"
                    label={t('text-billing-address')}
                    //@ts-ignore
                    addresses={user?.address?.filter(
                      (address) =>
                        address?.type === AddressType.Billing ||
                        address?.type === AddressType.For_both,
                    )}
                    //@ts-ignore
                    userId={
                      items.length === 1 ||
                      items.every((item) => item.employee === items[0].employee)
                        ? items[0].employee!
                        : items[0].owner_id!
                    }
                    // employeeId={items?.[0]?.employee}
                    //@ts-ignore
                    atom={billingAddressAtom}
                    type={AddressType.Billing}
                  />
                  <AddressGrid
                    userId={
                      items.length === 1 ||
                      items.every((item) => item.employee === items[0].employee)
                        ? items[0].employee!
                        : items[0].owner_id!
                    }
                    className="border-b border-black pb-4"
                    label={t('text-shipping-address')}
                    //@ts-ignore
                    addresses={user?.address?.filter(
                      (address) =>
                        address?.type === AddressType.Shipping ||
                        address?.type === AddressType.For_both,
                    )}
                    //@ts-ignore
                    atom={shippingAddressAtom}
                    type={AddressType.Shipping}
                  />
                  {/* <ScheduleGrid
            className="border-b border-black pb-4"
            label={t('text-delivery-schedule')} 
          /> */}
                  <div className="flex justify-end mt-4">
                    <Button onClick={() => setActiveTab('third')}> Next</Button>
                  </div>
                </div>
                {/* <div className="mb-10 mt-10 w-full sm:mb-12 lg:mb-0 lg:w-96">
          <RightSideView />
        </div> */}
              </div>
            </div>
          )}
          {/* {activeTab === 'second' && (
            <div className="secoundTabShow m-auto w-full max-w-5xl mb-5 border-b border-gray-500 pb-3 mb-3 pl-8 pr-8">
              <h1 className="text-xl font-bold">Payment Info</h1>
              <PaymentGrid className="mt-5 w-full" />
            </div>
          )} */}
          {activeTab === 'third' && (
            <div className="thirdTabShow m-auto w-full max-w-5xl mb-5 border-b border-gray-500 pb-3 mb-3 pl-8 pr-8">
              {/* @ts-ignore */}
              <RightSideView
                // employeeId={items?.[0]?.employee}
                employeeId={
                  items.length === 1 ||
                  items.every((item) => item?.employee === items[0].employee)
                    ? items[0].employee
                    : items[0].owner_id
                }
              />
            </div>
          )}
        </div>
        {/* <div className='w-[15%] border-l border-gray-500 pl-5'>
      <div className="payment_note  mt-4 w-full">
        <div className="mb-4">
          <b >Note</b>
          <textarea
            name=""
            id=""  
            placeholder="Add a note for the cart"
            className="appearance-none mt-3 h-[100px] block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          ></textarea>
        </div> 
        <form noValidate>
          
          <div className='choose_logo'>
          <b>Upload Logo</b>
          <input
            type="file"
            className='appearance-none block w-full mt-3 bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
        
          />
        </div> 
        </form>
      </div>
      </div> */}
      </div>
    </div>
  );
}
CheckoutPage.authenticate = {
  permissions: adminOnly,
};
CheckoutPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['table', 'common', 'form'])),
  },
});
