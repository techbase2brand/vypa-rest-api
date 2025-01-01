import LoginForm from '@/components/auth/login-form';
import { useTranslation } from 'next-i18next';
import type { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { getAuthCredentials, isAuthenticated } from '@/utils/auth-utils';
import { useRouter } from 'next/router';
import AuthPageLayout from '@/components/layouts/auth-layout';
import { Routes } from '@/config/routes';
import Image from 'next/image';
import login_img from '@/assets/placeholders/login_img.png';
import Link from 'next/link';
import LogO from '@/assets/placeholders/vypa-logo-svg.svg';


export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale!, ['common', 'form'])),
  },
});

export default function LoginPage() {
  const router = useRouter();
  const { token, permissions } = getAuthCredentials();
  if (isAuthenticated({ token, permissions })) {
    router.replace(Routes.dashboard);
  }
  const { t } = useTranslation('common');

  return (
    <AuthPageLayout>
      {/* <h3 className="mb-6 mt-4 text-center text-base italic bg-red-100 text-body">
        {t('admin-login-title')}
      </h3> */}
      {/* <LoginForm /> */}

      <div className="flex flex-col h-screen">
        {/* Navbar */}

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Left Section */}
          <div className="flex-1 bg-gray-50 flex flex-col">
            {/* Navbar */}
            <nav className="flex items-center justify-between p-4 bg-black text-white">
            <Image
                src={LogO}
                alt={'vypa_logo'}
                width={100}
                height={100}
                className="object-cover"
                loading="eager"
              />
              <div>
                <span className="text-gray-300 mr-2">
                  Don’t have an account?
                </span>
                <Link href={Routes.register} className="text-green-500 hover:underline">
                  Sign up!
                </Link>
              </div>
            </nav>

            {/* Main Content */}
            {/* <div className="flex flex-1 justify-center items-center p-6">
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold text-center mb-4">Welcome Back</h1>
            <p className="text-center text-gray-600 mb-8">Login into your account</p>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Username or Email</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your username or email"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 11V9a4 4 0 10-8 0v2m-2 0a6 6 0 0112 0v2a3 3 0 11-6 0m6 3v1a3 3 0 11-6 0v-1"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                  <span className="absolute right-3 top-2.5 text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3l18 18M3 21l18-18"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Remember me</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                Log In
              </button>
            </form>
          </div>
        </div> */}

            <div className="flex flex-1 justify-center items-center ">
              <LoginForm />
            </div>
          </div>

          {/* Right Section */}
          {/* <div
          className="hidden lg:block flex-1 bg-cover bg-center"
          style={{
            backgroundImage: "url('/background.jpg')", // Add your image path here
          }}
        /> */}

          <div className="hidden lg:block flex-1 relative">
            <Image
              src={login_img} // Place your image in the public folder
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
{
  /* <div className="flex flex-1 justify-center items-center p-6">
<LoginForm/>
</div> */
}
