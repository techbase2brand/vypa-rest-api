import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import TextArea from '@/components/ui/text-area';
import { useSettingsQuery } from '@/data/settings';
import { useCreateShopMutation, useUpdateShopMutation } from '@/data/shop';
import {
  BalanceInput,
  IImage,
  Shop,
  ShopSettings,
  UserAddressInput,
  BusinessContactdetailInput,
  LoginDetailsInput,
  PrimaryContactdetailInput,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { getFormattedImage } from '@/utils/get-formatted-image';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAtom } from 'jotai';
import { locationAtom } from '@/utils/use-location';
import { addshopValidationSchema } from './shop-validation-schema';
import PhoneNumberInput from '@/components/ui/phone-input';
import * as yup from 'yup';
import { useCreateContactMutation } from '@/data/contact';

type FormValues = {
  name: string;
  email: string;
  phone_no: string;
  company_name: string;
  subject: string;
  question: string;
};

export const contactValidationSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  question: yup.string().required('Questions are required'),
});

const ContactForm = ({ initialValues }: { initialValues?: any }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createContact, isLoading: creating } = useCreateContactMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
          },
        }
      : {}),
    // @ts-ignore
    resolver: yupResolver(contactValidationSchema),
  });
  const router = useRouter();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);
  useEffect(() => {
    reset({
      name: initialValues?.name || '',
      email: initialValues?.email || '',

      company_name: initialValues?.managed_shop?.name || '',
    });
    // reset(initialValues); // Reset ensures inputs are updated when initialValues change
  }, [initialValues, reset]);
  const { t } = useTranslation();

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    createContact({
        //@ts-ignore
        ...values,
      });
  
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex w-full gap-4 mt-4">
          <div className="w-full pb-8 mb-5 border-b border-dashed border-border-base">
            <Input
              label={t('Your Name')}
              {...register('name')}
              variant="outline"
              className="mb-5"
              error={t(errors.name?.message!)}
              required
            />
            <Input
              label={t('Your Email')}
              {...register('email')}
              variant="outline"
              className="mb-5"
              error={t(errors?.email?.message!)}
              required
            />
            <PhoneNumberInput
              label={t('Phone No.')}
              {...register('phone_no')}
              control={control}
            />
            <div className="flex w-full gap-6">
              <div className="w-1/2">
                <Input
                  label={t('Your Company ')}
                  {...register('company_name')}
                  variant="outline"
                  className="mb-5"
                />
              </div>
              <div className="w-1/2">
                <Input
                  label={t('Subject')}
                  {...register('subject')}
                  variant="outline"
                  className="mb-5"
                />
              </div>
            </div>

            <TextArea
              label={t('Your Question')}
              {...register('question')}
              variant="outline"
              required
              error={t(errors.question?.message!)}
            />
          </div>
        </div>
        <Button
          type="submit"
          loading={creating || updating}
          disabled={creating || updating}
          // onClick={onSubmit}
        >
          {t('Submit')}
        </Button>
      </form>
    </>
  );
};

export default ContactForm;
