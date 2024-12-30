import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import RegistrationForm from '@/components/auth/registration-form';
import { useRouter } from 'next/router';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import AuthPageLayout from '@/components/layouts/auth-layout';
import Image from 'next/image';
import sign_up from '@/assets/placeholders/sign_up.png';
import LogO from '@/assets/placeholders/vypa-logo-svg.svg';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function RegisterPage() {
  const router = useRouter();
  const { token, permissions } = getAuthCredentials();
  if (isAuthenticated({ token, permissions })) {
    router.replace(Routes.dashboard);
  }
  const { t } = useTranslation('common');
  return (
    <AuthPageLayout>
      {/* <h3 className="mb-6 mt-4 text-center text-base italic text-gray-500">
        {t('admin-register-title')}
      </h3> */}

      <div className="flex flex-col h-screen">
        {/* Navbar */}

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Left Section */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="flex items-center justify-between p-4 bg-black text-white">
              {/* <div className="text-3xl font-bold">
                <span className="text-white">VYPA</span>
              </div> */}
              <Image
                src={LogO}
                alt={'vypa_logo'}
                width={100}
                height={100}
                className="object-cover"
                loading="eager"
              />
              <div>
                <span className="text-gray-300 mr-2">have an account?</span>
                <a href="/login" className="text-blue-500 hover:underline">
                  Sign in!
                </a>
              </div>
            </nav>

            {/* left Section */}
            <div
              className="px-10"
              style={{ height: '100vh', overflow: 'auto' }}
            >
              <style>
                {`
      /* For Chrome, Edge, Safari */
      div::-webkit-scrollbar {
        display: none;
      }
    `}
              </style>
              <RegistrationForm />
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden lg:block fixed flex-1 relative">
            <Image
              src={sign_up} // Place your image in the public folder
              alt="Construction Background"
              layout="fill"
              objectFit="cover"
              quality={100}
              priority
            />
          </div>
        </div>
      </div>
    </AuthPageLayout>
  );
}
