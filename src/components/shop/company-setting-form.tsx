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
import FileInput from '../ui/file-input';
import Card from '../common/card';
import { useCreateCompanySettingMutation, useCompanySettingQuery } from '@/data/comapny-setting';
import { useMeQuery } from '@/data/user';

type FormValues = {
  name: string;
  front_logo: string;
  rear_logo: string;
  logo: any;
};

const CompanySettingForm = () => {
  const [location] = useAtom(locationAtom);
  const {data:me } = useMeQuery()
  const { mutate: createSetting, isLoading: creating } =
    useCreateCompanySettingMutation();
    const { data, isLoading, error } = useCompanySettingQuery({
      slug: me?.shop?.slug as string,
    });
       
    const {
      register,
      handleSubmit,
      formState: { errors },
      control,
      reset,
    } = useForm<FormValues>({
      shouldUnregister: true,
      defaultValues: {
        front_logo: '', // Default value before data is fetched
        rear_logo: '',  // Default value before data is fetched
        name: '',       // Default value before data is fetched
      },
    });
  
    // Effect to update form values once data is available
    useEffect(() => {
      if (data) {
        reset({
          front_logo: data.front_logo || '',
          rear_logo: data.rear_logo || '',
          name: data.name || '',
        });
      }
    }, [data, reset]);
  
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

  const { t } = useTranslation();

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    createSetting({
      ...values,
      //@ts-ignore
      // shop_id:me?.shops?.[0].id
    },
    {
      onSuccess: () => {
        reset({
            front_logo:  '',
            rear_logo:  '',
            name:  '',
          });
      },
    })

    // window.location.reload();
    // reset({
    //   front_logo:  '',
    //   rear_logo:  '',
    //   name:  '',
    // });

  }

  

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex w-full gap-4 mt-4">
          <div className="w-full pb-8 mb-5 border-b border-dashed border-border-base">
            {/* <Card className="w-1/2 rounded">
              <FileInput
                name="logo"
                control={control}
                multiple={false}
                //   error={t(errors?.logo?.message!)}
              />
            </Card> */}
            <Input
              label={t('Front Logo')}
              {...register('front_logo')}
              type="number"
              variant="outline"
              className="mb-5"
              placeholder="$"
              //   error={t(errors.name?.message!)}
              //   required
            />
            <Input
              label={t('Rear Logo')}
              type="number"
              {...register('rear_logo')}
              variant="outline"
              className="mb-5"
              placeholder="$"
              //   error={t(errors.name?.message!)}
              //   required
            />
            <Input
              label={t('Name')}
              type="number"
              {...register('name')}
              variant="outline"
              className="mb-5"
              placeholder="$"
              //   error={t(errors.name?.message!)}
              //   required
            />
          </div>
        </div>
        <Button
          type="submit"
          // loading={creating || updating}
          // disabled={creating || updating}
          onClick={onSubmit}
        >
          {t('Submit')}
        </Button>
      </form>
    </>
  );
};

export default CompanySettingForm;
