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
import { SortOrder } from '@/types';
import {
  useApproveNotificationMutation,
  useNotificationsQuery,
  useUpdateNotificationMutation,
} from '@/data/notification';

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
  const router = useRouter();
  const [orderBy, setOrder] = useState('created_at');
  const [sortedBy, setColumn] = useState<SortOrder>(SortOrder.Desc);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const { notifications, paginatorInfo } = useNotificationsQuery({
    //@ts-ignore
    language: locale,
    limit: 3,
    page,
    code: searchTerm,
    orderBy,
    sortedBy,
    refreshKey,
    //@ts-ignore
  });
  const { mutate: updateNotification, isLoading: updating } =
    useApproveNotificationMutation();
  console.log('notificationsnotifications', notifications);

  const toggleNotification = () => {
    setShowNotification(true);
  };
  const toggleOffNotification = () => {
    console.log('Cross button clicked!');
    setShowNotification(false);
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

  const handleUpdate = (id: any) => {
    console.log('ididididid', id);
    updateNotification(
      //@ts-ignore
      {
        id: id,
      },
      {
        onSuccess: () => {
          //@ts-ignore
          setRefreshKey((prev) => prev + 1); // Increment the key to refresh the query
        },
      },
    );
  };

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
              {/* <SearchBar /> */}
            </div>

            <div
              className="mx-6 cursor-pointer relative"
              onClick={toggleNotification}
            >
              <Image
                src={notification}
                alt={'notification'}
                width={150}
                height={150}
                className="mt-2"
                // loading="eager"
              />
              {/* <div  className='bg-red-500 rounded-full '>
                3
              </div> */}
              {/* @ts-ignore */}
              {/* {notifications?.length > 0 && (
                <div className="absolute top-4 right-2 bg-red-500 rounded-full flex items-center justify-center w-5 h-5 text-white text-xs">
                 
                  {notifications.length}
                </div>
              )} */}
              {/* @ts-ignore */}
              {notifications?.filter((n) => n.markAsRead === 0).length > 0 && (
                <div className="absolute top-4 right-2 bg-red-500 rounded-full flex items-center justify-center w-5 h-5 text-white text-xs">
                  {/* @ts-ignore */}
                  {notifications.filter((n) => n.markAsRead === 0).length}
                </div>
              )}

              {showNotification && (
                <div className="absolute top-[80px] right-[0px]">
                  <div className="bg-white w-96  rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex justify-between items-center px-6 py-4 border-b">
                      <h2 className="text-lg font-semibold">Notification</h2>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOffNotification();
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.15171 6.5L0.175936 1.52543C0.120157 1.46965 0.0759114 1.40343 0.0457242 1.33055C0.0155371 1.25767 5.87722e-10 1.17956 0 1.10068C-5.87722e-10 1.0218 0.0155371 0.943689 0.0457242 0.870811C0.0759113 0.797933 0.120157 0.731714 0.175936 0.675936C0.231714 0.620157 0.297933 0.575911 0.370811 0.545724C0.443689 0.515537 0.521799 0.5 0.600682 0.5C0.679565 0.5 0.757675 0.515537 0.830553 0.545724C0.903431 0.575911 0.96965 0.620157 1.02543 0.675936L6 5.65171L10.9746 0.675936C11.0872 0.563286 11.24 0.5 11.3993 0.5C11.5586 0.5 11.7114 0.563286 11.8241 0.675936C11.9367 0.788585 12 0.941371 12 1.10068C12 1.25999 11.9367 1.41278 11.8241 1.52543L6.84829 6.5L11.8241 11.4746C11.9367 11.5872 12 11.74 12 11.8993C12 12.0586 11.9367 12.2114 11.8241 12.3241C11.7114 12.4367 11.5586 12.5 11.3993 12.5C11.24 12.5 11.0872 12.4367 10.9746 12.3241L6 7.34829L1.02543 12.3241C0.912779 12.4367 0.759993 12.5 0.600682 12.5C0.441371 12.5 0.288585 12.4367 0.175936 12.3241C0.0632858 12.2114 0 12.0586 0 11.8993C0 11.74 0.0632858 11.5872 0.175936 11.4746L5.15171 6.5Z"
                            fill="black"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-4 p-4 h-[280px] overflow-auto">
                      {/* @ts-ignore */}
                      {notifications?.length > 0 ? (
                        <div className="items-start space-x-4">
                          {/* @ts-ignore */}
                          {notifications?.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => handleUpdate(notification.id)}
                              className="justify-between border-b pb-2 mb-2"
                            >
                              <h3 className="font-medium">
                                {notification.name}{' '}
                                {notification.markAsRead === 0 && (
                                  <span className="text-red-500">●</span>
                                )}
                              </h3>
                              <span className="text-gray-400 text-xs">
                                {new Date(
                                  notification.created_at,
                                ).toLocaleString()}
                              </span>
                              <p className="text-gray-500 text-sm mt-1">
                                {notification.notification}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        'No Notification Find'
                      )}
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
