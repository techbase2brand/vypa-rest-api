import { useRouter } from 'next/router';
import Logo from '@/components/ui/logo';
import React from 'react';

export default function AuthPageLayout({
  children,
}: React.PropsWithChildren<{}>) {
  // const { locale } = useRouter();
  // const dir = locale === 'ar' || locale === 'he' ? 'rtl' : 'ltr';
  return (
    <div
      className="flex h-screen items-center justify-center bg-black w-100% sm:bg-gray-100"
      // dir={dir}
    >
      <div className="w-full rounded w-10">
        {/* <div className="mb-2 flex justify-center">
          <Logo />
        </div> */}
        {children}
      </div>
    </div>
  );
}
