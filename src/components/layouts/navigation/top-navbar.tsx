import { SearchIcon } from '@/components/icons/search-icon';
import LanguageSwitcher from '@/components/layouts/navigation/language-switcher';
import MessageBar from '@/components/layouts/topbar/message-bar';
import RecentOrderBar from '@/components/layouts/topbar/recent-order-bar';
import SearchBar from '@/components/layouts/topbar/search-bar';
import StoreNoticeBar from '@/components/layouts/topbar/store-notice-bar';
import VisitStore from '@/components/layouts/topbar/visit-store';
import Alert from '@/components/ui/alert';
import CountdownTimer from '@/components/ui/countdown-timer';
import LinkButton from '@/components/ui/link-button';
import Loader from '@/components/ui/loader/loader';
import Logo from '@/components/ui/logo';
import { useModalAction } from '@/components/ui/modal/modal.context';
import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { useUI } from '@/contexts/ui.context';
import { useSettingsQuery } from '@/data/settings';
import { useShopQuery } from '@/data/shop';
import { useMeQuery } from '@/data/user';
import {
  adminAndOwnerOnly,
  adminOnly,
  getAuthCredentials,
  hasAccess,
} from '@/utils/auth-utils';
import {
  RESPONSIVE_WIDTH,
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
  miniSidebarInitialValue,
  searchModalInitialValues,
} from '@/utils/constants';
import cn from 'classnames';
import { isBefore } from 'date-fns';
import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import AuthorizedMenu from './authorized-menu';
import notification from '@/assets/placeholders/notification.svg';
import Image from 'next/image';


export const isInArray = (array: Date[], value: Date) => {
  return !!array?.find((item) => {
    return item?.getDate() == value?.getDate();
  });
};

const Navbar = () => {
  const { t } = useTranslation();
  const { toggleSidebar } = useUI();
  const { permissions } = getAuthCredentials();
  const { enableMultiLang } = Config;
  const { locale, query } = useRouter();
  const { data } = useMeQuery();
  const { openModal } = useModalAction();
  const [searchModal, setSearchModal] = useAtom(searchModalInitialValues);
  const [miniSidebar, setMiniSidebar] = useAtom(miniSidebarInitialValue);
  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };
  const [isMaintenanceMode, setUnderMaintenance] = useAtom(
    checkIsMaintenanceModeComing,
  );
  const [isMaintenanceModeStart, setUnderMaintenanceStart] = useAtom(
    checkIsMaintenanceModeStart,
  );
  const { width } = useWindowSize();
  const { settings, loading } = useSettingsQuery({ language: locale! });

  const {
    data: shop,
    isLoading: shopLoading,
    error,
  } = useShopQuery(
    {
      slug: query?.shop as string,
    },
    { enabled: Boolean(query?.shop) },
  );

  useEffect(() => {
    if (
      settings?.options?.maintenance?.start &&
      settings?.options?.maintenance?.until &&
      settings?.options?.isUnderMaintenance
    ) {
      const beforeDay = isBefore(
        new Date(),
        new Date(settings?.options?.maintenance?.start as string),
      );
      // Calculate maintenance start time
      const maintenanceStartTime = new Date(
        settings?.options?.maintenance?.start as string,
      );
      const maintenanceEndTime = new Date(
        settings?.options?.maintenance?.until as string,
      );
      maintenanceStartTime.setMinutes(maintenanceStartTime.getMinutes());

      // Check if the current time has passed the maintenance start time
      const currentTime = new Date();
      const checkIsMaintenanceStart =
        currentTime >= maintenanceStartTime &&
        currentTime < maintenanceEndTime &&
        settings?.options?.isUnderMaintenance;
      const checkIsMaintenance =
        beforeDay && settings?.options?.isUnderMaintenance;
      setUnderMaintenance(checkIsMaintenance as boolean);
      setUnderMaintenanceStart(checkIsMaintenanceStart as boolean);
    }
  }, [
    settings?.options?.maintenance?.start,
    settings?.options?.maintenance?.until,
    settings?.options?.isUnderMaintenance,
  ]);

  useEffect(() => {
    if (
      query?.shop &&
      shop?.settings?.shopMaintenance?.start &&
      shop?.settings?.shopMaintenance?.until &&
      shop?.settings?.isShopUnderMaintenance
    ) {
      const beforeDay = isBefore(
        new Date(),
        new Date(shop?.settings?.shopMaintenance?.start as Date),
      );
      // Calculate maintenance start time
      const maintenanceStartTime = new Date(
        shop?.settings?.shopMaintenance?.start as Date,
      );
      const maintenanceEndTime = new Date(
        shop?.settings?.shopMaintenance?.until as Date,
      );
      maintenanceStartTime.setMinutes(maintenanceStartTime.getMinutes());

      // Check if the current time has passed the maintenance start time
      const currentTime = new Date();
      const checkIsMaintenanceStart =
        currentTime >= maintenanceStartTime &&
        currentTime < maintenanceEndTime &&
        shop?.settings?.isShopUnderMaintenance;
      const checkIsMaintenance =
        beforeDay && shop?.settings?.isShopUnderMaintenance;
      setUnderMaintenance(checkIsMaintenance as boolean);
      setUnderMaintenanceStart(checkIsMaintenanceStart as boolean);
    }
  }, [
    query?.shop,
    shop?.settings?.shopMaintenance?.start,
    shop?.settings?.shopMaintenance?.until,
    shop?.settings?.isShopUnderMaintenance,
  ]);

  if (loading || shopLoading) {
    return <Loader showText={false} />;
  }

  const { options } = settings!;

  function handleClick() {
    openModal('SEARCH_VIEW');
    setSearchModal(true);
  }

  return (
    <header className="fixed top-0 z-40 w-full bg-white shadow">
      {width >= RESPONSIVE_WIDTH && isMaintenanceMode ? (
        <Alert
          message={
            (settings?.options?.isUnderMaintenance &&
              `Site ${t('text-maintenance-mode-title')}`) ||
            (shop?.settings?.isShopUnderMaintenance &&
              `${shop?.name} ${t('text-maintenance-mode-title')}`)
          }
          variant="info"
          className="sticky top-0 left-0 z-50"
          childClassName="flex justify-center items-center w-full gap-4 font-bold"
        >
          <CountdownTimer
            date={
              (settings?.options?.isUnderMaintenance &&
                new Date(options?.maintenance?.start)) ||
              (shop?.settings?.isShopUnderMaintenance &&
                new Date(shop?.settings?.shopMaintenance?.start as Date))
            }
            className="text-blue-600 [&>p]:bg-blue-200 [&>p]:p-2 [&>p]:text-xs [&>p]:text-blue-600"
          />
        </Alert>
      ) : (
        ''
      )}
      {width >= RESPONSIVE_WIDTH && isMaintenanceModeStart ? (
        <Alert
          message={t('text-maintenance-mode-start-title')}
          className="py-[1.375rem]"
          childClassName="text-center w-full font-bold"
        />
      ) : (
        ''
      )}
      <nav className="flex items-center pr-5 md:pr-8">
        <div className="relative flex w-full flex-1 items-center">
          <div className="flex items-center">
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={toggleSidebar}
              className="group flex h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-4 focus:text-accent focus:outline-none lg:hidden"
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span className="h-0.5 w-3/4 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent" />
            </motion.button>
            <div
              className={cn(
                'flex h-16 shrink-0 transition-[width] duration-300 me-4 w-100 lg:h-[76px] lg:border-solid lg:border-gray-200/80 lg:me-8 lg:border-e',
                miniSidebar ? 'lg:w-[100px]' : 'lg:w-[257px]',
              )}
            >
              <Logo />
            </div>
            <button
              className="group hidden h-5 w-5 shrink-0 cursor-pointer flex-col justify-center space-y-1 me-6 lg:flex"
              onClick={() => setMiniSidebar(!miniSidebar)}
            >
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-2/4',
                )}
              />
              <span className="h-0.5 w-full rounded-full bg-gray-600 group-hover:bg-accent" />
              <span
                className={cn(
                  'h-0.5 rounded-full bg-gray-600 transition-[width] group-hover:bg-accent',
                  miniSidebar ? 'w-full' : 'w-3/4',
                )}
              />
            </button>
          </div>
          <div
            className="relative ml-auto mr-1.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 py-4 text-gray-600 hover:border-transparent hover:border-gray-200 hover:bg-white hover:text-accent sm:mr-6 lg:hidden xl:hidden"
            onClick={handleClick}
          >
            <SearchIcon className="h-4 w-4" />
          </div>
          <div className="relative hidden w-full max-w-[710px] py-4 me-6 lg:block 2xl:me-auto">
            {/* <SearchBar /> */}
          </div>

          <div className="flex shrink-0 grow-0 basis-auto items-center">
          <div
            className="relative ml-auto mr-1.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-gray-50 py-4 text-gray-600 hover:border-transparent hover:border-gray-200 hover:bg-white hover:text-accent sm:mr-6 lg:hidden xl:hidden"
            onClick={handleClick}
          >
            {/* <SearchIcon className="h-4 w-4" /> */}
          </div>
          <div className="relative hidden w-full max-w-[710px] py-4 me-6 lg:block 2xl:me-auto">
            <SearchBar />
          </div>
         
          <div className='mx-6 cursor-pointer relative'onClick={toggleNotification} >
          <Image
            src={notification}
            alt={"notification"}
            width={100}
            height={100}
            className="mt-2"
            // loading="eager"
          />
           {showNotification && (
          <div className="absolute top-[80px] right-[0px]">
  <div className="bg-white w-96  rounded-2xl shadow-lg overflow-hidden">
    <div className="flex justify-between items-center px-6 py-4 border-b">
      <h2 className="text-lg font-semibold">Notification</h2>
      <button className="text-gray-400 hover:text-gray-600">
      <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.15171 6.5L0.175936 1.52543C0.120157 1.46965 0.0759114 1.40343 0.0457242 1.33055C0.0155371 1.25767 5.87722e-10 1.17956 0 1.10068C-5.87722e-10 1.0218 0.0155371 0.943689 0.0457242 0.870811C0.0759113 0.797933 0.120157 0.731714 0.175936 0.675936C0.231714 0.620157 0.297933 0.575911 0.370811 0.545724C0.443689 0.515537 0.521799 0.5 0.600682 0.5C0.679565 0.5 0.757675 0.515537 0.830553 0.545724C0.903431 0.575911 0.96965 0.620157 1.02543 0.675936L6 5.65171L10.9746 0.675936C11.0872 0.563286 11.24 0.5 11.3993 0.5C11.5586 0.5 11.7114 0.563286 11.8241 0.675936C11.9367 0.788585 12 0.941371 12 1.10068C12 1.25999 11.9367 1.41278 11.8241 1.52543L6.84829 6.5L11.8241 11.4746C11.9367 11.5872 12 11.74 12 11.8993C12 12.0586 11.9367 12.2114 11.8241 12.3241C11.7114 12.4367 11.5586 12.5 11.3993 12.5C11.24 12.5 11.0872 12.4367 10.9746 12.3241L6 7.34829L1.02543 12.3241C0.912779 12.4367 0.759993 12.5 0.600682 12.5C0.441371 12.5 0.288585 12.4367 0.175936 12.3241C0.0632858 12.2114 0 12.0586 0 11.8993C0 11.74 0.0632858 11.5872 0.175936 11.4746L5.15171 6.5Z" fill="black"/>
      </svg> 
      </button>
    </div>
    <div className="space-y-4 p-4 h-[280px]  overflow-auto"> 
      <div className="flex items-start space-x-4"> 
        <div className='border border-black rounded p-2'>
        <svg style={{background:'#EEC3A8', borderRadius:'50px', padding:'3px'}}  width="24" height="25" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.796875 15.44C0.796875 20.1716 4.8496 20.5675 9.00076 20.5675C13.1519 20.5675 17.2047 20.1716 17.2047 15.44C17.2047 10.8411 13.864 8.08422 12.3165 7.05395C12.4961 6.92969 12.6313 6.75135 12.7025 6.54491C12.7737 6.33846 12.7771 6.11468 12.7122 5.90615C12.6474 5.69763 12.5177 5.51525 12.342 5.38557C12.1663 5.25589 11.9538 5.18568 11.7354 5.18517H11.6158L12.5729 3.35297C12.6775 3.16624 12.7405 2.95912 12.7576 2.74578C12.7747 2.53244 12.7455 2.31793 12.672 2.11691C12.6037 1.92616 12.4951 1.75238 12.3535 1.60744C12.2119 1.46249 12.0407 1.3498 11.8516 1.27704C11.5557 1.16639 11.2443 1.10295 10.9287 1.08904C10.7323 0.757344 10.4487 0.485831 10.1088 0.304009C9.76892 0.122186 9.38568 0.0370103 9.00076 0.0577392C8.61658 0.0378382 8.23427 0.123411 7.89523 0.305192C7.55619 0.486974 7.27334 0.758038 7.07729 1.08904C6.76113 1.10284 6.4491 1.16629 6.15265 1.27704C5.96356 1.34982 5.79239 1.46252 5.65081 1.60746C5.50923 1.7524 5.40058 1.92617 5.33226 2.11691C5.25902 2.31624 5.22951 2.52899 5.24573 2.74073C5.26195 2.95246 5.32352 3.15823 5.42626 3.34408L6.38577 5.18517H6.26613C6.04776 5.18568 5.83525 5.25589 5.65955 5.38557C5.48385 5.51525 5.35414 5.69763 5.28929 5.90615C5.22445 6.11468 5.22787 6.33846 5.29905 6.54491C5.37022 6.75135 5.50545 6.92969 5.68502 7.05395C4.13757 8.08422 0.796875 10.8411 0.796875 15.44ZM6.02685 3.019C5.97038 2.91807 5.93641 2.80612 5.92726 2.69083C5.91812 2.57554 5.93402 2.45964 5.97387 2.35107C6.00799 2.25229 6.06334 2.1622 6.13605 2.08713C6.20875 2.01207 6.29703 1.95386 6.39466 1.9166C6.59403 1.84256 6.80272 1.79654 7.01474 1.77987L7.29846 3.20256C7.31422 3.27977 7.35617 3.34917 7.41721 3.399C7.47826 3.44883 7.55465 3.47604 7.63345 3.47603C7.65641 3.47616 7.67933 3.47387 7.70181 3.46919C7.74581 3.46022 7.78761 3.44267 7.82482 3.41754C7.86203 3.39242 7.89393 3.3602 7.91869 3.32275C7.94345 3.28529 7.96059 3.24332 7.96912 3.19924C7.97766 3.15516 7.97743 3.10982 7.96844 3.06583L7.64883 1.4671C7.78214 1.23037 7.98004 1.03643 8.21942 0.907936C8.4588 0.779439 8.72979 0.721679 9.00076 0.741396C9.27184 0.721777 9.5429 0.779691 9.7823 0.908376C10.0217 1.03706 10.2195 1.2312 10.3527 1.46812L10.0331 3.06583C10.0241 3.10982 10.0239 3.15516 10.0324 3.19924C10.0409 3.24332 10.0581 3.28529 10.0828 3.32275C10.1076 3.3602 10.1395 3.39242 10.1767 3.41754C10.2139 3.44267 10.2557 3.46022 10.2997 3.46919C10.3222 3.47388 10.3451 3.47618 10.3681 3.47603C10.4468 3.47596 10.5231 3.44872 10.5841 3.39889C10.6451 3.34906 10.687 3.27971 10.7027 3.20256L10.9871 1.7809C11.199 1.79757 11.4076 1.84358 11.6069 1.91763C11.7046 1.95482 11.7929 2.01301 11.8657 2.08808C11.9385 2.16315 11.9939 2.25327 12.028 2.35209C12.0681 2.46228 12.0837 2.57988 12.0737 2.6967C12.0637 2.81352 12.0284 2.92677 11.9702 3.02857L10.8446 5.18517H7.15694L6.02685 3.019ZM6.26613 5.86883H11.7354C11.8261 5.86883 11.913 5.90484 11.9771 5.96895C12.0412 6.03305 12.0772 6.12 12.0772 6.21066C12.0772 6.30131 12.0412 6.38826 11.9771 6.45236C11.913 6.51647 11.8261 6.55248 11.7354 6.55248H6.26613C6.17548 6.55248 6.08853 6.51647 6.02442 6.45236C5.96032 6.38826 5.9243 6.30131 5.9243 6.21066C5.9243 6.12 5.96032 6.03305 6.02442 5.96895C6.08853 5.90484 6.17548 5.86883 6.26613 5.86883ZM6.69342 7.23614H11.3081C11.9234 7.57284 16.521 10.2596 16.521 15.44C16.521 19.1759 13.878 19.8838 9.00076 19.8838C4.12355 19.8838 1.48053 19.1759 1.48053 15.44C1.48053 10.2596 6.0771 7.57284 6.69342 7.23614Z" fill="black"/>
        <path d="M8.65843 13.9968V16.4436C8.1061 16.4137 7.58251 16.1879 7.18173 15.8067C7.12108 15.7393 7.03613 15.6988 6.94558 15.694C6.85503 15.6892 6.7663 15.7206 6.69889 15.7813C6.63149 15.8419 6.59094 15.9269 6.58616 16.0174C6.58139 16.108 6.61278 16.1967 6.67343 16.2641C7.2042 16.79 7.9119 17.0994 8.65843 17.1317V17.83C8.65843 17.9207 8.69444 18.0076 8.75854 18.0717C8.82265 18.1358 8.9096 18.1718 9.00025 18.1718C9.09091 18.1718 9.17786 18.1358 9.24196 18.0717C9.30607 18.0076 9.34208 17.9207 9.34208 17.83V17.131C10.7094 17.0182 11.7349 16.2422 11.7349 15.2663C11.7349 14.1215 10.5142 13.7476 9.34208 13.4594V11.0126C9.89441 11.0424 10.418 11.2682 10.8188 11.6494C10.8794 11.7168 10.9644 11.7574 11.0549 11.7621C11.1455 11.7669 11.2342 11.7355 11.3016 11.6749C11.369 11.6142 11.4096 11.5293 11.4143 11.4387C11.4191 11.3482 11.3877 11.2595 11.3271 11.192C10.7963 10.6661 10.0886 10.3568 9.34208 10.3245V9.62613C9.34208 9.53547 9.30607 9.44853 9.24196 9.38442C9.17786 9.32032 9.09091 9.2843 9.00025 9.2843C8.9096 9.2843 8.82265 9.32032 8.75854 9.38442C8.69444 9.44853 8.65843 9.53547 8.65843 9.62613V10.3252C7.29111 10.438 6.26562 11.2139 6.26562 12.1898C6.26562 13.3346 7.4863 13.7086 8.65843 13.9968ZM11.0512 15.2663C11.0512 15.8474 10.2992 16.3458 9.34208 16.4439V14.1649C10.3881 14.4333 11.0512 14.6958 11.0512 15.2663ZM8.65843 11.0122V13.2912C7.61243 13.0229 6.94928 12.7604 6.94928 12.1898C6.94928 11.6087 7.70301 11.1104 8.65843 11.0122Z" fill="black"/>
        </svg>
        </div>
        <div className="flex-1">
          <div className="  justify-between">
            <h3 className="font-medium">Your Budget Expired <span className='text-red-500'>●</span></h3>
            <span className="text-gray-400 text-xs"> Just Now</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Lorem ipsum may be used as a placeholder before the final copy is available.
          </p>
          <span className="text-gray-400 text-xs block mt-1">June 15, 2024</span>
        </div>
      </div>
 
      <div className="flex items-start space-x-4">
      <div className='border border-black rounded p-2'>
        <svg style={{background:'#EEC3A8', borderRadius:'50px', padding:'3px'}}  width="24" height="25" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.796875 15.44C0.796875 20.1716 4.8496 20.5675 9.00076 20.5675C13.1519 20.5675 17.2047 20.1716 17.2047 15.44C17.2047 10.8411 13.864 8.08422 12.3165 7.05395C12.4961 6.92969 12.6313 6.75135 12.7025 6.54491C12.7737 6.33846 12.7771 6.11468 12.7122 5.90615C12.6474 5.69763 12.5177 5.51525 12.342 5.38557C12.1663 5.25589 11.9538 5.18568 11.7354 5.18517H11.6158L12.5729 3.35297C12.6775 3.16624 12.7405 2.95912 12.7576 2.74578C12.7747 2.53244 12.7455 2.31793 12.672 2.11691C12.6037 1.92616 12.4951 1.75238 12.3535 1.60744C12.2119 1.46249 12.0407 1.3498 11.8516 1.27704C11.5557 1.16639 11.2443 1.10295 10.9287 1.08904C10.7323 0.757344 10.4487 0.485831 10.1088 0.304009C9.76892 0.122186 9.38568 0.0370103 9.00076 0.0577392C8.61658 0.0378382 8.23427 0.123411 7.89523 0.305192C7.55619 0.486974 7.27334 0.758038 7.07729 1.08904C6.76113 1.10284 6.4491 1.16629 6.15265 1.27704C5.96356 1.34982 5.79239 1.46252 5.65081 1.60746C5.50923 1.7524 5.40058 1.92617 5.33226 2.11691C5.25902 2.31624 5.22951 2.52899 5.24573 2.74073C5.26195 2.95246 5.32352 3.15823 5.42626 3.34408L6.38577 5.18517H6.26613C6.04776 5.18568 5.83525 5.25589 5.65955 5.38557C5.48385 5.51525 5.35414 5.69763 5.28929 5.90615C5.22445 6.11468 5.22787 6.33846 5.29905 6.54491C5.37022 6.75135 5.50545 6.92969 5.68502 7.05395C4.13757 8.08422 0.796875 10.8411 0.796875 15.44ZM6.02685 3.019C5.97038 2.91807 5.93641 2.80612 5.92726 2.69083C5.91812 2.57554 5.93402 2.45964 5.97387 2.35107C6.00799 2.25229 6.06334 2.1622 6.13605 2.08713C6.20875 2.01207 6.29703 1.95386 6.39466 1.9166C6.59403 1.84256 6.80272 1.79654 7.01474 1.77987L7.29846 3.20256C7.31422 3.27977 7.35617 3.34917 7.41721 3.399C7.47826 3.44883 7.55465 3.47604 7.63345 3.47603C7.65641 3.47616 7.67933 3.47387 7.70181 3.46919C7.74581 3.46022 7.78761 3.44267 7.82482 3.41754C7.86203 3.39242 7.89393 3.3602 7.91869 3.32275C7.94345 3.28529 7.96059 3.24332 7.96912 3.19924C7.97766 3.15516 7.97743 3.10982 7.96844 3.06583L7.64883 1.4671C7.78214 1.23037 7.98004 1.03643 8.21942 0.907936C8.4588 0.779439 8.72979 0.721679 9.00076 0.741396C9.27184 0.721777 9.5429 0.779691 9.7823 0.908376C10.0217 1.03706 10.2195 1.2312 10.3527 1.46812L10.0331 3.06583C10.0241 3.10982 10.0239 3.15516 10.0324 3.19924C10.0409 3.24332 10.0581 3.28529 10.0828 3.32275C10.1076 3.3602 10.1395 3.39242 10.1767 3.41754C10.2139 3.44267 10.2557 3.46022 10.2997 3.46919C10.3222 3.47388 10.3451 3.47618 10.3681 3.47603C10.4468 3.47596 10.5231 3.44872 10.5841 3.39889C10.6451 3.34906 10.687 3.27971 10.7027 3.20256L10.9871 1.7809C11.199 1.79757 11.4076 1.84358 11.6069 1.91763C11.7046 1.95482 11.7929 2.01301 11.8657 2.08808C11.9385 2.16315 11.9939 2.25327 12.028 2.35209C12.0681 2.46228 12.0837 2.57988 12.0737 2.6967C12.0637 2.81352 12.0284 2.92677 11.9702 3.02857L10.8446 5.18517H7.15694L6.02685 3.019ZM6.26613 5.86883H11.7354C11.8261 5.86883 11.913 5.90484 11.9771 5.96895C12.0412 6.03305 12.0772 6.12 12.0772 6.21066C12.0772 6.30131 12.0412 6.38826 11.9771 6.45236C11.913 6.51647 11.8261 6.55248 11.7354 6.55248H6.26613C6.17548 6.55248 6.08853 6.51647 6.02442 6.45236C5.96032 6.38826 5.9243 6.30131 5.9243 6.21066C5.9243 6.12 5.96032 6.03305 6.02442 5.96895C6.08853 5.90484 6.17548 5.86883 6.26613 5.86883ZM6.69342 7.23614H11.3081C11.9234 7.57284 16.521 10.2596 16.521 15.44C16.521 19.1759 13.878 19.8838 9.00076 19.8838C4.12355 19.8838 1.48053 19.1759 1.48053 15.44C1.48053 10.2596 6.0771 7.57284 6.69342 7.23614Z" fill="black"/>
        <path d="M8.65843 13.9968V16.4436C8.1061 16.4137 7.58251 16.1879 7.18173 15.8067C7.12108 15.7393 7.03613 15.6988 6.94558 15.694C6.85503 15.6892 6.7663 15.7206 6.69889 15.7813C6.63149 15.8419 6.59094 15.9269 6.58616 16.0174C6.58139 16.108 6.61278 16.1967 6.67343 16.2641C7.2042 16.79 7.9119 17.0994 8.65843 17.1317V17.83C8.65843 17.9207 8.69444 18.0076 8.75854 18.0717C8.82265 18.1358 8.9096 18.1718 9.00025 18.1718C9.09091 18.1718 9.17786 18.1358 9.24196 18.0717C9.30607 18.0076 9.34208 17.9207 9.34208 17.83V17.131C10.7094 17.0182 11.7349 16.2422 11.7349 15.2663C11.7349 14.1215 10.5142 13.7476 9.34208 13.4594V11.0126C9.89441 11.0424 10.418 11.2682 10.8188 11.6494C10.8794 11.7168 10.9644 11.7574 11.0549 11.7621C11.1455 11.7669 11.2342 11.7355 11.3016 11.6749C11.369 11.6142 11.4096 11.5293 11.4143 11.4387C11.4191 11.3482 11.3877 11.2595 11.3271 11.192C10.7963 10.6661 10.0886 10.3568 9.34208 10.3245V9.62613C9.34208 9.53547 9.30607 9.44853 9.24196 9.38442C9.17786 9.32032 9.09091 9.2843 9.00025 9.2843C8.9096 9.2843 8.82265 9.32032 8.75854 9.38442C8.69444 9.44853 8.65843 9.53547 8.65843 9.62613V10.3252C7.29111 10.438 6.26562 11.2139 6.26562 12.1898C6.26562 13.3346 7.4863 13.7086 8.65843 13.9968ZM11.0512 15.2663C11.0512 15.8474 10.2992 16.3458 9.34208 16.4439V14.1649C10.3881 14.4333 11.0512 14.6958 11.0512 15.2663ZM8.65843 11.0122V13.2912C7.61243 13.0229 6.94928 12.7604 6.94928 12.1898C6.94928 11.6087 7.70301 11.1104 8.65843 11.0122Z" fill="black"/>
        </svg>
        </div>
        <div className="flex-1">
          <div className="  justify-between">
            <h3 className="font-medium">Integer vitae leo quis urna pulvinar tristique.</h3>
            <span className="text-gray-400 text-xs">09:20 PM - 19-02-2024</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Lorem ipsum may be used as a placeholder before the final copy is available.
          </p>
        </div>
      </div>
    </div>
  </div>
          </div>
          )}
          </div>
            {hasAccess(adminAndOwnerOnly, permissions) && (
              <>
                {/* <div className="hidden border-gray-200/80 px-6 py-5 border-e 2xl:block">
                  <LinkButton
                    href={Routes.shop.create}
                    size="small"
                    className="px-3.5"
                  >
                    {t('common:text-create-shop')}
                  </LinkButton>
                </div> */}

                {/* <div className="hidden px-6 py-5 2xl:block">
                  <VisitStore />
                </div> */}

                {options?.pushNotification?.all?.order ||
                options?.pushNotification?.all?.message ||
                options?.pushNotification?.all?.storeNotice ? (
                  <div className="flex items-center gap-3 px-0.5 py-3 sm:relative sm:border-gray-200/80 sm:py-3.5 sm:px-6 sm:border-s lg:py-5">
                    {options?.pushNotification?.all?.order ? (
                      <RecentOrderBar user={data} />
                    ) : (
                      ''
                    )}

                    {options?.pushNotification?.all?.message ? (
                      <MessageBar user={data} />
                    ) : (
                      ''
                    )}

                    {!hasAccess(adminOnly, permissions) ? (
                      options?.pushNotification?.all?.storeNotice ? (
                        <StoreNoticeBar user={data} />
                      ) : (
                        ''
                      )
                    ) : null}
                  </div>
                ) : null}
              </>
            )}
          </div>

          {enableMultiLang ? <LanguageSwitcher /> : null}

          <AuthorizedMenu />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
