import Navbar from '@/components/layouts/navigation/top-navbar';
import { miniSidebarInitialValue } from '@/utils/constants';
import Footer from '@/components/layouts/footer/footer-bar';
import MobileNavigation from '@/components/layouts/navigation/mobile-navigation';
import { siteSettings } from '@/settings/site.settings';
import { useTranslation } from 'next-i18next';
import SidebarItem from '@/components/layouts/navigation/sidebar-item';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import cn from 'classnames';
import Scrollbar from '@/components/ui/scrollbar';
import { useWindowSize } from '@/utils/use-window-size';
import { RESPONSIVE_WIDTH } from '@/utils/constants';
import {
  checkIsMaintenanceModeComing,
  checkIsMaintenanceModeStart,
} from '@/utils/constants';
import { getAuthCredentials } from '@/utils/auth-utils';

interface MenuItemsProps {
  [key: string]: {
    href: string;
    label: string;
    icon: string;
    childMenu: {
      href: string;
      label: string;
      icon: string;
    }[];
  };
}

const SidebarItemMap = ({ menuItems }: any) => {
  const { t } = useTranslation();
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const { childMenu } = menuItems;
  const { width } = useWindowSize();
  return (
    <div className="space-y-1">
      {childMenu?.map(
        ({
          href,
          label,
          icon,
          childMenu,
        }: {
          href: string;
          label: string;
          icon: string;
          childMenu: any;
        }) => (
          <SidebarItem
            href={href}
            key={label}
            label={t(label)}
            icon={icon}
            childMenu={childMenu}
            miniSidebar={miniSidebar && width >= RESPONSIVE_WIDTH}
          />
        ),
      )}
    </div>
  );
};

export const SideBarGroup = () => {
  const { role } = getAuthCredentials();

  const { t } = useTranslation();
  // @ts-ignore
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  // const menuItems: MenuItemsProps =
  //   role == 'employee'
  //     ? siteSettings?.sidebarLinks?.employee
  //     : siteSettings?.sidebarLinks?.admin;
  const menuItems: MenuItemsProps =
    role === 'employee'
      ? siteSettings?.sidebarLinks?.employee
      : role === 'company'
        ? siteSettings?.sidebarLinks?.company
        : siteSettings?.sidebarLinks?.admin;

  const menuKeys = Object?.keys(menuItems);
  const { width } = useWindowSize();

  return (
    <>
      {menuKeys?.map((menu, index) => (
        <div
          className={cn(
            'flex flex-col px-2',
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? 'border-b border-dashed border-gray-200 py-5'
              : 'pt-1 pb-',
          )}
          key={index}
        >
          {/* <div
            className={cn(
              'px-3 pb-5 text-xs font-semibold uppercase tracking-[0.05em] text-white',
              miniSidebar && width >= RESPONSIVE_WIDTH ? 'hidden' : '',
            )}
          >
            {t(menuItems[menu]?.label)}
          </div> */}
          <SidebarItemMap menuItems={menuItems[menu]} />
        </div>
      ))}
    </>
  );
};

const AdminLayout: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const { locale } = useRouter();

  const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  const [miniSidebar, _] = useAtom(miniSidebarInitialValue);
  const [underMaintenance] = useAtom(checkIsMaintenanceModeComing);
  const [underMaintenanceStart] = useAtom(checkIsMaintenanceModeStart);
  const { width } = useWindowSize();

  return (
    <div
      className="flex min-h-screen flex-col bg-gray-100 transition-colors duration-150"
      dir={dir}
    >
      <Navbar />
      <MobileNavigation>
        <SideBarGroup />
      </MobileNavigation>
      <div className="flex  flex-1">
        <aside
          className={cn(
            'fixed bottom-0 z-10 hidden h-full w-64 bg-white pt-16 shadow transition-[width] duration-300 ltr:left-0 ltr:right-auto rtl:right-0 rtl:left-auto lg:block',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'lg:pt-[8.75rem]'
              : 'pt-16',
            miniSidebar && width >= RESPONSIVE_WIDTH ? 'lg:w-24' : 'lg:w-68',
          )}
        >
          <div className="sidebar-scrollbar h-full w-full pt-5 overflow-x-hidden bg-dark text-white">
            <Scrollbar
              className="h-full w-full"
              options={{
                scrollbars: {
                  autoHide: 'never',
                },
              }}
            >
              <SideBarGroup />
            </Scrollbar>
          </div>
        </aside>
        <main
          className={cn(
            'relative flex w-full flex-col justify-start pt-[72px] transition-[padding] duration-300 lg:pt-20',
            width >= RESPONSIVE_WIDTH &&
              (underMaintenance || underMaintenanceStart)
              ? 'lg:pt-[8.75rem]'
              : 'pt-[72px] lg:pt-20',
            miniSidebar && width >= RESPONSIVE_WIDTH
              ? 'ltr:lg:pl-24 rtl:lg:pr-24'
              : 'ltr:xl:pl-76 rtl:xl:pr-76 ltr:lg:pl-72 rtl:lg:pr-72 rtl:lg:pl-0',
          )}
          style={{ paddingLeft: '16rem' }}
        >
          <div className="h-full p-5 md:p-8">{children}</div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
