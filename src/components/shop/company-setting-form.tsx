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
import { useCreateCompanySettingMutation } from '@/data/comapny-setting';
import { useMeQuery } from '@/data/user';

type FormValues = {
  name: string;
  front_logo: string;
  rear_logo: string;
  logo: any;
};

const CompanySettingForm = () => {
  const [location] = useAtom(locationAtom);
  const { mutate: createSetting, isLoading: creating } =
    useCreateCompanySettingMutation();
  // const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
const {data:me } = useMeQuery()
console.log("meeeeeeeeeee", me?.shops?.[0]?.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    shouldUnregister: true,
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

  const { t } = useTranslation();

  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    createSetting({
      ...values,
      //@ts-ignore
      // shop_id:me?.shops?.[0].id
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex w-full gap-4 mt-4">
          <div className="w-full pb-8 mb-5 border-b border-dashed border-border-base">
            <Card className="w-1/2 rounded">
              <FileInput
                name="logo"
                control={control}
                multiple={false}
                //   error={t(errors?.logo?.message!)}
              />
            </Card>
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
          // onClick={onSubmit}
        >
          {t('Submit')}
        </Button>
      </form>
    </>
  );
};

export default CompanySettingForm;
