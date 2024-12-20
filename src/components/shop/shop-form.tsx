import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { EditIcon } from '@/components/icons/edit';
import * as socialIcons from '@/components/icons/social';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import { useCreateShopMutation, useUpdateShopMutation } from '@/data/shop';
import {
  BalanceInput,
  IImage,
  ItemProps,
  Shop,
  ShopSettings,
  ShopSocialInput,
  UserAddressInput,
  BusinessContactdetailInput,
  LoginDetailsInput,
  PrimaryContactdetailInput,
  Attachment,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import { getFormattedImage } from '@/utils/get-formatted-image';
import { getIcon } from '@/utils/get-icon';
import { yupResolver } from '@hookform/resolvers/yup';
import { join, split } from 'lodash';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import OpenAIButton from '../openAI/openAI.button';
import { useAtom } from 'jotai';
import { locationAtom } from '@/utils/use-location';
import { useModalAction } from '../ui/modal/modal.context';
import { shopValidationSchema } from './shop-validation-schema';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';

// const socialIcon = [
//   {
//     value: 'FacebookIcon',
//     label: 'Facebook',
//   },
//   {
//     value: 'InstagramIcon',
//     label: 'Instagram',
//   },
//   {
//     value: 'TwitterIcon',
//     label: 'Twitter',
//   },
//   {
//     value: 'YouTubeIcon',
//     label: 'Youtube',
//   },
// ];

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex items-center justify-center w-4 h-4">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  slug: string;
  description: string;
  cover_image: any;
  logo: any;
  balance: BalanceInput;
  address: UserAddressInput;
  businessContactdetail: BusinessContactdetailInput;
  loginDetails: LoginDetailsInput;
  primary_contact_detail: PrimaryContactdetailInput;
  settings: ShopSettings;
  isShopUnderMaintenance?: boolean;
};
const ShopForm = ({ initialValues }: { initialValues?: Shop }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
  const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
  // const { permissions } = getAuthCredentials();
  // let permission = hasAccess(adminAndOwnerOnly, permissions);
  console.log("initialValues",initialValues);
  
  const { permissions } = getAuthCredentials();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch,
    setValue,
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues
      ? {
          defaultValues: {
            ...initialValues,
            logo: getFormattedImage(initialValues?.logo as IImage),
            cover_image: getFormattedImage(
              initialValues?.cover_image as IImage,
            ),
          },
        }
      : {}),
    // @ts-ignore
    resolver: yupResolver(shopValidationSchema),
  });
  const router = useRouter();

  const { openModal } = useModalAction();
  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const generateName = watch('name');
  const shopDescriptionSuggestionLists = useMemo(() => {
    return ShopDescriptionSuggestion({ name: generateName ?? '' });
  }, [generateName]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
    }
  }, [errors]);
  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: generateName,
      set_value: setValue,
      key: 'description',
      suggestion: shopDescriptionSuggestionLists as ItemProps[],
    });
  }, [generateName]);

  const slugAutoSuggest = formatSlug(watch('name'));

  const startDate = useWatch({
    name: 'settings.shopMaintenance.start',
    control,
  });
  const untilDate = useWatch({
    name: 'settings.shopMaintenance.until',
    control,
  });
  console.log({ startDate });
  const isMaintenanceMode = watch('settings.isShopUnderMaintenance');

  const today = new Date();

  const { t } = useTranslation();
  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: 'settings.socials',
  // });

  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const isSlugEditable =
    (router?.query?.action === 'edit' || router?.pathname === '/[shop]/edit') &&
    router?.locale === Config.defaultLanguage;

  // function onSubmit(values: FormValues) {
  //   console.log('onSubmitclicked', values.loginDetails);
  //   const updatedValues = {
  //     ...values,
  //     loginDetails: {
  //       ...values.loginDetails,
  //       password_confirmation: values.loginDetails.password, // Set password_confirmation to match password
  //     },
  //   };
  //   if (initialValues) {
  //     const { ...restAddress } = values.address;
  //     updateShop({
  //       id: initialValues?.id as string,
  //       ...values,
  //       address: restAddress,
  //       // settings,
  //       balance: {
  //         id: initialValues.balance?.id,
  //         ...values.balance,
  //       },
  //     });
  //   } else {
  //     createShop({
  //       ...updatedValues,
  //     balance: {
  //       ...updatedValues.balance,
  //     },
  //     });
  //   }
  // }
  function onSubmit(values: FormValues) {
    console.log('onSubmit clicked', values);
    // Add the `password_confirmation` field dynamically
    const updatedValues = {
      ...values,
      loginDetails: {
        ...values.loginDetails,
        "password_confirmation": values.loginDetails.password, // Set password_confirmation to match password
      },
    };
    console.log('Updated Values:', updatedValues);
    if (initialValues) {
      const { ...restAddress } = updatedValues.address;
      updateShop({
        id: initialValues?.id as string,
        ...updatedValues,
        address: restAddress,
        balance: {
          id: initialValues.balance?.id,
          ...updatedValues.balance,
        },
      });
    } else {
      createShop({
        ...updatedValues,
        balance: {
          ...updatedValues.balance,
        },
      });
    }
  }
  
  const isGoogleMapActive = options?.useGoogleMap;
  const askForAQuote = watch('settings.askForAQuote.enable');

  const coverImageInformation = (
    <span>
      {t('form:shop-cover-image-help-text')} <br />
      {t('form:cover-image-dimension-help-text')} &nbsp;
      <span className="font-bold">1170 x 435{t('common:text-px')}</span>
    </span>
  );

  let sameDay = useMemo(() => {
    return isSameDay(new Date(untilDate), new Date(startDate));
  }, [untilDate, startDate]);

  const filterUntilTime = (date: Date) => {
    if (sameDay) {
      const isPastTime =
        addMinutes(new Date(startDate), 15).getTime() > date.getTime();
      return !isPastTime;
    }
    return true;
  };

  const filterStartTime = (date: Date) => {
    let today = isToday(new Date(startDate));
    if (today) {
      const isPastTime = new Date(startDate).getTime() > date.getTime();
      return !isPastTime;
    }
    return true;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
          {/* <Description
            title={t('form:input-label-logo')}
            details={t('form:shop-logo-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          /> */}

          <Card className="w-full sm:w-8/12 md:w-60 rounded-full">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </div>

        {/* <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
          <Description
            title={t('form:shop-cover-image-title')}
            details={coverImageInformation}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <FileInput name="cover_image" control={control} multiple={false} />
          </Card>
        </div> */}

        <div className="flex w-full gap-4">
          <div className=" w-3/6 pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('Business Detail')}
              details={t('form:shop-basic-info-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-full">
              <Input
                label={t('Company Name')}
                {...register('name')}
                variant="outline"
                className="mb-5"
                error={t(errors.name?.message!)}
                required
              />
              <Input
                label={t('Company Address')}
                {...register('address.street_address')}
                variant="outline"
                className="mb-5"
                error={t(errors.address?.zip?.message!)}
                required
              />

              <Input
                label={t('form:input-label-country')}
                {...register('address.country')}
                variant="outline"
                className="mb-5"
                error={t(errors.address?.country?.message!)}
                required
              />
              <Input
                label={t('form:input-label-state')}
                {...register('address.state')}
                variant="outline"
                className="mb-5"
                error={t(errors.address?.state?.message!)}
                required
              />
              <Input
                label={t('form:input-label-city')}
                {...register('address.city')}
                variant="outline"
                className="mb-5"
                error={t(errors.address?.city?.message!)}
                required
              />

              <Input
                label={t('Post Code')}
                {...register('address.zip')}
                variant="outline"
                className="mb-5"
                error={t(errors.address?.zip?.message!)}
                required
              />
              {/* <TextArea
              label={t('form:input-label-street-address')}
              {...register('address.street_address')}
              variant="outline"
              error={t(errors.address?.street_address?.message!)}
            /> */}

              {/* {isSlugEditable ? (
              <div className="relative mb-5">
                <Input
                  label={t('form:input-label-slug')}
                  {...register('slug')}
                  error={t(errors.slug?.message!)}
                  variant="outline"
                  disabled={isSlugDisable}
                />
                <button
                  className="absolute top-[27px] right-px z-0 flex h-[46px] w-11 items-center justify-center rounded-tr rounded-br border-l border-solid border-border-base bg-white px-2 text-body transition duration-200 hover:text-heading focus:outline-none"
                  type="button"
                  title={t('common:text-edit')}
                  onClick={() => setIsSlugDisable(false)}
                >
                  <EditIcon width={14} />
                </button>
              </div>
            ) : (
              <Input
                label={t('form:input-label-slug')}
                {...register('slug')}
                value={slugAutoSuggest}
                variant="outline"
                className="mb-5"
                disabled
              />
            )} */}

              <div className="relative">
                {options?.useAi && (
                  <OpenAIButton
                    title={t('form:button-label-description-ai')}
                    onClick={handleGenerateDescription}
                  />
                )}
                {/* <TextArea
                label={t('form:input-label-description')}
                {...register('description')}
                variant="outline"
                error={t(errors.description?.message!)}
              /> */}
              </div>
            </Card>
          </div>
          {/* <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
          <Description
            title={t('form:shop-payment-info')}
            details={t('form:payment-info-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <Input
              label={t('form:input-label-account-holder-name')}
              {...register('balance.payment_info.name')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.name?.message!)}
              required
            />
            <Input
              label={t('form:input-label-account-holder-email')}
              {...register('balance.payment_info.email')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.email?.message!)}
              required
            />
            <Input
              label={t('form:input-label-bank-name')}
              {...register('balance.payment_info.bank')}
              variant="outline"
              className="mb-5"
              error={t(errors.balance?.payment_info?.bank?.message!)}
              required
            />
            <Input
              label={t('form:input-label-account-number')}
              {...register('balance.payment_info.account')}
              variant="outline"
              error={t(errors.balance?.payment_info?.account?.message!)}
              required
            />
          </Card>
        </div> */}
          {/* <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
          <Description
            title={t('form:shop-address')}
            details={t('form:shop-address-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            {isGoogleMapActive && (
              <div className="mb-5">
                <Label>{t('form:input-label-autocomplete')}</Label>
                <Controller
                  control={control}
                  name="settings.location"
                  render={({ field: { onChange, value } }) => (
                    <GooglePlacesAutocomplete
                      // @ts-ignore
                      onChange={(location: any) => {
                        onChange(location);
                        setValue('address.country', location?.country);
                        setValue('address.city', location?.city);
                        setValue('address.state', location?.state);
                        setValue('address.zip', location?.zip);
                        setValue(
                          'address.street_address',
                          location?.street_address,
                        );
                      }}
                      data={getValues('settings.location')!}
                      onChangeCurrentLocation={onChange}
                    />
                  )}
                />
              </div>
            )}
            <Input
              label={t('form:input-label-country')}
              {...register('address.country')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.country?.message!)}
            />
            <Input
              label={t('form:input-label-city')}
              {...register('address.city')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.city?.message!)}
            />
            <Input
              label={t('form:input-label-state')}
              {...register('address.state')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.state?.message!)}
            />
            <Input
              label={t('form:input-label-zip')}
              {...register('address.zip')}
              variant="outline"
              className="mb-5"
              error={t(errors.address?.zip?.message!)}
            />
            <TextArea
              label={t('form:input-label-street-address')}
              {...register('address.street_address')}
              variant="outline"
              error={t(errors.address?.street_address?.message!)}
            />
          </Card>
        </div> */}

          {/* {permissions?.includes(STORE_OWNER) ? (
          <div className="flex flex-wrap pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('form:form-notification-title')}
              details={t('form:form-notification-description')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full mb-5 sm:w-8/12 md:w-2/3">
              <Input
                label={t('form:input-notification-email')}
                {...register('settings.notifications.email')}
                error={t(errors?.settings?.notifications?.email?.message!)}
                variant="outline"
                className="mb-5"
                disabled={permissions?.includes(SUPER_ADMIN)}
                type="email"
              />
              <div className="flex items-center gap-x-4">
                <SwitchInput
                  name="settings.notifications.enable"
                  control={control}
                  disabled={permissions?.includes(SUPER_ADMIN)}
                />
                <Label className="!mb-0.5">
                  {t('form:input-enable-notification')}
                </Label>
              </div>
            </Card>
          </div>
        ) : (
          ''
        )} */}
          <div className="w-3/6 pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
            <Description
              title={t('Business Contact details')}
              details={t('form:shop-settings-helper-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-full">
              <PhoneNumberInput
                label={t('Business Phone No')}
                required
                {...register('businessContactdetail.business_phone')}
                control={control}
                error={t(
                  errors.businessContactdetail?.business_phone?.message!,
                )}
              />
              <PhoneNumberInput
                label={t('Mobile No')}
                required
                {...register('businessContactdetail.mobile')}
                control={control}
                error={t(errors.businessContactdetail?.mobile?.message!)}
              />
              <Input
                label={t('Fax')}
                {...register('businessContactdetail.fax')}
                variant="outline"
                className="mb-5"
                error={t(errors.businessContactdetail?.fax?.message!)}
                required
              />
              <Input
                label={t('Email')}
                type='email'
                {...register('businessContactdetail.email')}
                variant="outline"
                className="mb-5"
                error={t(errors.businessContactdetail?.email?.message!)}
                required
              />
              <Input
                label={t('form:input-label-website')}
                {...register('businessContactdetail.website')}
                variant="outline"
                className="mb-5"
                error={t(errors.businessContactdetail?.website?.message!)}
                required
              />
            </Card>
          </div>
        </div>

        <div className="flex w-full gap-4">
          <div className="w-3/6 pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('Primary Contact Detail')}
              details={t('form:shop-basic-info-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-full">
              <Input
                label={t('First Name')}
                {...register('primary_contact_detail.firstname')}
                variant="outline"
                className="mb-5"
                error={t(errors.primary_contact_detail?.firstname?.message!)}
                required
              />
              <Input
                label={t('Last Name')}
                {...register('primary_contact_detail.lastname')}
                variant="outline"
                className="mb-5"
                error={t(errors.primary_contact_detail?.lastname?.message!)}
              />

              <Input
                label={t('Job Title')}
                {...register('primary_contact_detail.jobtitle')}
                variant="outline"
                className="mb-5"
                error={t(errors.primary_contact_detail?.jobtitle?.message!)}
                required
              />
              <Input
                label={t('Email')}
                {...register('primary_contact_detail.email')}
                variant="outline"
                className="mb-5"
                error={t(errors.primary_contact_detail?.email?.message!)}
                required
              />
              <PhoneNumberInput
                label={t('Contact No')}
                // required
                {...register('primary_contact_detail.contact_no')}
                control={control}
                // error={t(errors.primary_contact_detail?.contact_no?.message!)}
              />
              <PhoneNumberInput
                label={t('Mobile')}
                required
                {...register('primary_contact_detail.mobile')}
                control={control}
                error={t(errors.primary_contact_detail?.mobile?.message!)}
              />
            </Card>
          </div>
          <div className="w-3/6 pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
            <Description
              title={t('Login Detail')}
              details={t('form:shop-basic-info-help-text')}
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
            />
            <Card className="w-full sm:w-8/12 md:w-full">
              <Input
                label={t('Username or Email')}
                {...register('loginDetails.username or email')}
                variant="outline"
                className="mb-5"
                // error={t(errors.loginDetails?.username!)}
                // required
              />
              <Input
                label={t('Password')}
                type="password"
                {...register('loginDetails.password', {
                  required: t('Password is required'),
                  minLength: {
                    value: 6,
                    message: t('Password must be at least 6 characters'),
                  },
                })}
                variant="outline"
                className="mb-5"
                error={t(errors.loginDetails?.password?.message!)}
                required
              />

              <Input
                label={t('Confirm Password')}
                type="password"
                {...register('loginDetails.confirmpassword', {
                  required: t('Confirm Password is required'),
                  validate: (value) =>
                    value === getValues('loginDetails.password') ||
                    t('Passwords do not match'),
                })}
                variant="outline"
                className="mb-5"
                error={t(errors.loginDetails?.confirmpassword?.message!)}
                required
              />
              {/* <Input
                label={t('Password')}
                type="password"
                {...register('loginDetails.password')}
                variant="outline"
                className="mb-5"
                error={t(errors.loginDetails?.password?.message!)}
                required
              />

              <Input
                label={t('Confirm Password')}
                type="password"
                {...register('loginDetails.confirmpassword')}
                variant="outline"
                className="mb-5"
                error={t(errors.loginDetails?.confirmpassword?.message!)}
                required
              /> */}
            </Card>
          </div>
        </div>
        {/* <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
          <Description
            title={t('form:social-settings')}
            details={t('form:social-settings-helper-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          />

          <Card className="w-full sm:w-8/12 md:w-2/3">
            <div>
              {fields?.map(
                (item: ShopSocialInput & { id: string }, index: number) => (
                  <div
                    className="py-5 border-b border-dashed border-border-200 first:mt-0 first:border-t-0 first:pt-0 last:border-b-0 md:py-8 md:first:mt-0"
                    key={item.id}
                  >
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-5">
                      <div className="sm:col-span-2">
                        <Label>{t('form:input-label-select-platform')}</Label>
                        <SelectInput
                          name={`settings.socials.${index}.icon` as const}
                          control={control}
                          options={updatedIcons}
                          isClearable={true}
                          defaultValue={item?.icon!}
                        />
                      </div>
                      <Input
                        className="sm:col-span-2"
                        label={t("form:input-label-icon")}
                        variant="outline"
                        {...register(`settings.socials.${index}.icon` as const)}
                        defaultValue={item?.icon!} // make sure to set up defaultValue
                      />
                      <Input
                        className="sm:col-span-2"
                        label={t('form:input-label-url')}
                        variant="outline"
                        {...register(`settings.socials.${index}.url` as const)}
                        error={t(
                          errors?.settings?.socials?.[index]?.url?.message!,
                        )}
                        defaultValue={item.url!} // make sure to set up defaultValue
                        required
                      />
                      <button
                        onClick={() => {
                          remove(index);
                        }}
                        type="button"
                        className="text-sm text-red-500 transition-colors duration-200 hover:text-red-700 focus:outline-none sm:col-span-1 sm:mt-4"
                      >
                        {t('form:button-label-remove')}
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
            <Button
              type="button"
              onClick={() => append({ icon: '', url: '' })}
              className="w-full text-sm sm:w-auto md:text-base"
            >
              {t('form:button-label-add-social')}
            </Button>
          </Card>
        </div> */}
        {!permissions?.includes(SUPER_ADMIN) ? (
          <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
            <Description
              title="Shop maintenance settings "
              details="Control all the maintenance settings related to this shop."
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <div className="my-5">
                <SwitchInput
                  name="settings.isShopUnderMaintenance"
                  label={t('form:input-label-enable-maintenance-mode')}
                  toolTipText={t('form:input-tooltip-enable-maintenance-mode')}
                  control={control}
                />
              </div>

              <div className="my-5 mt-10">
                <FileInput
                  name="settings.shopMaintenance.image"
                  control={control}
                  multiple={false}
                  disabled={!isMaintenanceMode}
                />
              </div>

              <div className="my-5 mt-10">
                <Input
                  label={t('form:input-label-title')}
                  toolTipText={t('form:input-tooltip-maintenance-title')}
                  {...register('settings.shopMaintenance.title')}
                  error={t(errors?.settings?.shopMaintenance?.title?.message!)}
                  variant="outline"
                  className="mb-5"
                  {...(isMaintenanceMode && {
                    required: true,
                  })}
                  disabled={!isMaintenanceMode}
                />
                <TextArea
                  label={t('form:input-label-description')}
                  toolTipText={t('form:input-tooltip-maintenance-description')}
                  {...register('settings.shopMaintenance.description')}
                  error={t(
                    errors?.settings?.shopMaintenance?.description?.message!,
                  )}
                  variant="outline"
                  className="mb-5"
                  {...(isMaintenanceMode && {
                    required: true,
                  })}
                  disabled={!isMaintenanceMode}
                />
                <div className="mb-5">
                  <DatePicker
                    control={control}
                    name="settings.shopMaintenance.start"
                    minDate={today}
                    startDate={new Date(startDate)}
                    locale={locale}
                    placeholder="Start Date"
                    disabled={!isMaintenanceMode}
                    label={t('form:maintenance-start-time')}
                    toolTipText={t('form:input-tooltip-maintenance-start-time')}
                    {...(isMaintenanceMode && {
                      required: true,
                    })}
                    error={t(
                      errors?.settings?.shopMaintenance?.start?.message!,
                    )}
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    filterTime={filterStartTime}
                  />
                </div>
                <div className="w-full">
                  <DatePicker
                    control={control}
                    name="settings.shopMaintenance.until"
                    disabled={!startDate || !isMaintenanceMode}
                    minDate={new Date(startDate)}
                    placeholder="End Date"
                    locale={locale}
                    {...(isMaintenanceMode && {
                      required: true,
                    })}
                    toolTipText={t('form:input-tooltip-maintenance-end-time')}
                    label={t('form:maintenance-end-date')}
                    error={t(
                      errors?.settings?.shopMaintenance?.until?.message!,
                    )}
                    showTimeSelect
                    timeFormat="h:mm aa"
                    timeIntervals={15}
                    timeCaption="time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                    filterTime={filterUntilTime}
                  />
                </div>
              </div>
            </Card>
          </div>
        ) : (
          ''
        )}
        {!permissions?.includes(SUPER_ADMIN) &&
        !permissions?.includes(STAFF) &&
        !Boolean(initialValues?.is_active) &&
        Boolean(options?.isMultiCommissionRate) ? (
          <div className="flex flex-wrap pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
            <Description
              title="Ask for a quote?"
              details="Set your ask for a quote here."
              className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
            />

            <Card className="w-full sm:w-8/12 md:w-2/3">
              <SwitchInput
                name="settings.askForAQuote.enable"
                control={control}
                label="Ask for a quote?"
                className={askForAQuote ? 'mb-4' : ''}
              />
              {askForAQuote ? (
                <>
                  <Input
                    label="Quote"
                    {...register('settings.askForAQuote.quote')}
                    variant="outline"
                    className="mb-5"
                    error={t(errors?.settings?.askForAQuote?.quote?.message)}
                    required
                  />
                  <TextArea
                    label="Ask for a quote content."
                    {...register('settings.askForAQuote.content')}
                    variant="outline"
                    error={t(errors?.settings?.askForAQuote?.content?.message)}
                    required
                  />
                </>
              ) : (
                ''
              )}
            </Card>
          </div>
        ) : (
          ''
        )}

        <StickyFooterPanel className="z-0">
          <div className="mb-5 text-end">
            <Button
              type="submit"
              loading={creating || updating}
              disabled={creating || updating}
              // onClick={onSubmit}
            >
              {initialValues
                ? t('form:button-label-update')
                : t('form:button-label-save')}
            </Button>
          </div>
        </StickyFooterPanel>
      </form>
    </>
  );
};

export default ShopForm;