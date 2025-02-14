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
import {
  useCreateNotificationMutation,
  useUpdateNotificationMutation,
} from '@/data/notification';

type FormValues = {
  name:string;
  selectedfor: any;
  notification: string;
};

const NotificationForm = ({ initialValues }: { initialValues?: any }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createNotification, isLoading: creating } =
    useCreateNotificationMutation();
  const { mutate: updateNotification, isLoading: updating } =
    useUpdateNotificationMutation();

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
    // resolver: yupResolver(contactValidationSchema),
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
      // name: initialValues?.name || '',
      // email: initialValues?.email || '',

      // company_name: initialValues?.managed_shop?.name || '',
    });
    // reset(initialValues); // Reset ensures inputs are updated when initialValues change
  }, [initialValues, reset]);
  const { t } = useTranslation();

  // function onSubmit(values: FormValues) {
  //   console.log('onSubmit clicked', values);
  //   if (initialValues) {
  //     //@ts-ignore
  //     updateNotification({
  //       ...values,
  //       id: initialValues.id,
  //     });
  //   } else {
  //       //@ts-ignore
  //     createNotification({
  //       ...values,
  //     });
  //   }
  // }

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);

    let selectedForPayload;

    if (values.selectedfor === 'All') {
      selectedForPayload = ['Company', 'Employee'];
    } else {
      selectedForPayload = [values.selectedfor];
    }

    const payload = {
      ...values,
      selectedfor: selectedForPayload,
    };

    if (initialValues) {
      updateNotification({
        ...payload,
        id: initialValues.id,
      });
    } else {
      //@ts-ignore
      createNotification(payload);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex w-full gap-4 mt-4">
          <div className="w-full pb-8 mb-5 border-b border-dashed border-border-base">
          <Input
              label={t('Heading')}
              {...register('name')}
              variant="outline"
              className="mb-5"
              // error={t(errors.name?.message!)}
              // required
            />
            <div>
              <select
                {...register('selectedfor')}
                className="ps-4 pe-4 h-12 mb-20 flex items-center w-full rounded-md appearance-none transition duration-300 ease-in-out text-heading text-sm focus:outline-none focus:ring-0 border border-border-base focus:border-accent"
              >
                 <option value={""}>Select Notification</option>
                <option value={"All"} >All</option>
                <option value={'Company'}>Company</option>
                <option value={'Employee'}>Employee</option>
              </select>
            </div>

            <TextArea
              label={t('Notification')}
              {...register('notification')}
              variant="outline"
              required
              // error={t(errors.question?.message!)}
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

export default NotificationForm;
