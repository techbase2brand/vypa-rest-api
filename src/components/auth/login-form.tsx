import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import PasswordInput from '@/components/ui/password-input';
import { useTranslation } from 'next-i18next';
import * as yup from 'yup';
import Link from '@/components/ui/link';
import Form from '@/components/ui/forms/form';
import { Routes } from '@/config/routes';
import { useLogin } from '@/data/user';
import type { LoginInput } from '@/types';
import { useState } from 'react';
import Alert from '@/components/ui/alert';
import Router from 'next/router';
import {
  allowedRoles,
  hasAccess,
  setAuthCredentials,
} from '@/utils/auth-utils';
import profile from '@/assets/placeholders/profile.svg';
import Image from 'next/image';

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Username or Email is required'),
  password: yup.string().required('form:error-password-required'),
});

const LoginForm = () => {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: login, isLoading, error } = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  function onSubmit({ email, password }: LoginInput) {
    login(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          if (data?.token) {
            if (hasAccess(allowedRoles, data?.permissions)) {
              setAuthCredentials(data?.token, data?.permissions, data?.role);
              Router.push(Routes.dashboard);
              return;
            }
            setErrorMessage('form:error-enough-permission');
          } else {
            setErrorMessage('form:error-credential-wrong');
          }
        },
        onError: () => {},
      },
    );
  }

  return (
    <div className="w-full px-40">
      <Form<LoginInput> validationSchema={loginFormSchema} onSubmit={onSubmit}>
        {({ register, formState: { errors } }) => (
          <>
            <h1 className="text-4xl font-bold text-center mb-4">
              Welcome Back
            </h1>
            <p className="text-center text-black-600 mb-8">
              Login into your account
            </p>
            <div className="relative">
              <Input
                label={t('Email')}
                {...register('email')}
                type="email"
                variant="outline"
                className="mb-4 w-200 text-black-600"
                error={t(errors?.email?.message!)}
              />
              <label className="absolute top-12 -mt-2  text-body end-4">
                {/* Profile Icon */}
                <Image
                  src={profile}
                  alt="Construction Background"
                  width={15}
                  height={15}
                  objectFit="cover"
                  quality={100}
                  priority
                />
              </label>
            </div>
            <PasswordInput
              label={t('form:input-label-password')}
              forgotPassHelpText={t('form:input-forgot-password-label')}
              {...register('password')}
              error={t(errors?.password?.message!)}
              variant="outline"
              className="mb-4"
              forgotPageLink={Routes.forgotPassword}
            />

            {/* Toggle Switch */}
            <div className="flex items-center justify-between mb-6 mt-3">
              <label className="flex items-center cursor-pointer">
                <div
                  className={`relative w-10 h-5 rounded-full ${
                    rememberMe ? 'bg-black' : 'bg-gray-300'
                  } transition`}
                  onClick={() => setRememberMe(!rememberMe)}
                >
                  <div
                    className={`absolute w-5 h-5 bg-white rounded-full shadow-md transition transform ${
                      rememberMe ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
                <span className="ml-3 text-black-700 font-medium">
                  Remember me
                </span>
              </label>
            </div>

            <Button
              className="w-full bg-black"
              loading={isLoading}
              disabled={isLoading}
            >
               Log In
            </Button>

            {/* <div className="relative mt-8 mb-6 flex flex-col items-center justify-center text-sm text-heading sm:mt-11 sm:mb-8">
              <hr className="w-full" />
              <span className="absolute -top-2.5 bg-light px-2 -ms-4 start-2/4">
                {t('common:text-or')}
              </span>
            </div> */}

            {/* <div className="text-center text-sm text-body sm:text-base">
              {t('form:text-no-account')}{' '}
              <Link
                href={Routes.register}
                className="font-semibold text-accent underline transition-colors duration-200 ms-1 hover:text-accent-hover hover:no-underline focus:text-accent-700 focus:no-underline focus:outline-none"
              >
                {t('form:link-register-shop-owner')}
              </Link>
            </div> */}
          </>
        )}
      </Form>
      {errorMessage ? (
        <Alert
          message={t(errorMessage)}
          variant="error"
          closeable={true}
          className="mt-5"
          onClose={() => setErrorMessage(null)}
        />
      ) : null}
    </div>
  );
};

export default LoginForm;

{
  /* {errorMsg ? (
          <Alert
            message={t(errorMsg)}
            variant="error"
            closeable={true}
            className="mt-5"
            onClose={() => setErrorMsg('')}
          />
        ) : null} */
}
