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
const ComapnySetupForm = ({ initialValues }: { initialValues?: Shop }) => {
    const [location] = useAtom(locationAtom);
    const { mutate: createShop, isLoading: creating } = useCreateShopMutation();
    const { mutate: updateShop, isLoading: updating } = useUpdateShopMutation();
    // const { permissions } = getAuthCredentials();
    // let permission = hasAccess(adminAndOwnerOnly, permissions);
    console.log("initialValues", initialValues);

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
                <div className="flex flex-wrap pb-6 my-5 border-b border-border-base sm:my-8">
                    {/* <Description
            title={t('form:input-label-logo')}
            details={t('form:shop-logo-help-text')}
            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
          /> */}

                    <div className="flex w-full gap-4">
                        <div className="w-1/6 pb-8 sm:my-8">
                            <Card className="w-full sm:w-8/12 md:w-60 rounded-full">
                                <FileInput name="logo" control={control} multiple={false} error={t(errors.logo?.message!)} />
                            </Card>
                        </div>
                        <div className=" w-4/6 pb-2 my-5 border-l pl-8 border-border-base sm:my-8">
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label={t('Customer Id')}
                                    {...register('name')}
                                    variant="outline"
                                    className=" w-full"
                                    error={t(errors.name?.message!)}
                                />
                                <Input
                                    label={t('Balance')}
                                    {...register('address.street_address')}
                                    variant="outline"
                                    className=" w-full"
                                    error={t(errors.address?.street_address?.message!)}
                                />

                                <Input
                                    label={t('Customer Status')}
                                    {...register('address.country')}
                                    variant="outline"
                                    className=" w-full"
                                    error={t(errors.address?.country?.message!)}

                                />
                                <Input
                                    label={t('Prepayment Balance')}
                                    {...register('address.state')}
                                    variant="outline"
                                    className=" w-full"
                                    error={t(errors.address?.state?.message!)}

                                />
                                <div className="col-span-1">

                                    <Input
                                        label={t('Customer Class')}
                                        {...register('address.city')}
                                        variant="outline"
                                        error={t(errors.address?.city?.message!)}

                                    />
                                </div>
                            </div>
                        </div>

                    </div>
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

                <div className="flex w-full gap-6">
                    <div className=" w-3/4 pb-8 my-5 border-b border-dashed border-border-base sm:my-8">
                        <Description
                            title={t('Account Info')}
                            className="w-full px-0  sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
                        />
                        <Input
                            label={t('Account Name ')}
                            {...register('name')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.name?.message!)}
                            required
                        />

                        <Description
                            title={t('Account Address')}
                            className="w-full px-0  sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
                        />

                        <Input
                            label={t('Address Line 1')}
                            {...register('address.street_address')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.address?.street_address?.message!)}

                        />

                        <Input
                            label={t('Address Line 2')}
                            {...register('address.country')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.address?.country?.message!)}

                        />
                        <Input
                            label={t('City')}
                            {...register('address.state')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.address?.state?.message!)}

                        />
                        <div className="relative">
                            <Input
                                label={t('State')}
                                {...register('address.city')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.city?.message!)}

                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82311 1.06445C4.85219 1.06445 3.90308 1.35236 3.09579 1.89178C2.2885 2.43119 1.6593 3.19788 1.28774 4.09489C0.916189 4.9919 0.818974 5.97894 1.00839 6.9312C1.19781 7.88346 1.66535 8.75817 2.35189 9.44471C3.03843 10.1313 3.91314 10.5988 4.8654 10.7882C5.81766 10.9776 6.80471 10.8804 7.70172 10.5089C8.59873 10.1373 9.36541 9.5081 9.90482 8.70081C10.4442 7.89352 10.7321 6.94441 10.7321 5.97349C10.7321 4.67156 10.2148 3.42298 9.29423 2.50237C8.37362 1.58176 7.12504 1.06454 5.82311 1.06445Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" />
                                    <path d="M9.48438 9.63574L12.9128 13.0642" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <Input
                            label={t('Postal Code')}
                            {...register('address.zip')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.address?.zip?.message!)}

                        />
                        <div className="relative">

                            <Input
                                label={t('Country')}
                                {...register('address.zip')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.zip?.message!)}
                                required
                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82311 1.06445C4.85219 1.06445 3.90308 1.35236 3.09579 1.89178C2.2885 2.43119 1.6593 3.19788 1.28774 4.09489C0.916189 4.9919 0.818974 5.97894 1.00839 6.9312C1.19781 7.88346 1.66535 8.75817 2.35189 9.44471C3.03843 10.1313 3.91314 10.5988 4.8654 10.7882C5.81766 10.9776 6.80471 10.8804 7.70172 10.5089C8.59873 10.1373 9.36541 9.5081 9.90482 8.70081C10.4442 7.89352 10.7321 6.94441 10.7321 5.97349C10.7321 4.67156 10.2148 3.42298 9.29423 2.50237C8.37362 1.58176 7.12504 1.06454 5.82311 1.06445Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" />
                                    <path d="M9.48438 9.63574L12.9128 13.0642" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <Description
                            title={t('Additional Account Info')}
                            className="w-full px-0  sm:w-4/12 md:w-full"
                        />
                        <div className="flex gap-4">
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>Business 1</option>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="w-3/4">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-3"

                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>Business 2</option>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="w-3/4">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-3"

                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>Fax</option>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="w-3/4">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-5"

                                />
                            </div>
                        </div>
                        <div className="relative">
                            <Input
                                label={t('Account Email')}
                                {...register('address.zip')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.zip?.message!)}

                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.7712 0.0644531H2.05692C1.75382 0.0644531 1.46312 0.184861 1.2488 0.399188C1.03447 0.613515 0.914063 0.904206 0.914062 1.20731V10.3502C0.914063 10.6533 1.03447 10.944 1.2488 11.1583C1.46312 11.3726 1.75382 11.493 2.05692 11.493H15.7712C16.0743 11.493 16.365 11.3726 16.5793 11.1583C16.7937 10.944 16.9141 10.6533 16.9141 10.3502V1.20731C16.9141 0.904206 16.7937 0.613515 16.5793 0.399188C16.365 0.184861 16.0743 0.0644531 15.7712 0.0644531ZM14.5141 1.20731L8.91406 5.0816L3.31406 1.20731H14.5141ZM2.05692 10.3502V1.72731L8.58835 6.24731C8.684 6.31367 8.79764 6.34923 8.91406 6.34923C9.03048 6.34923 9.14412 6.31367 9.23978 6.24731L15.7712 1.72731V10.3502H2.05692Z" fill="black" />
                                </svg>
                            </div>
                        </div>
                        <div className="relative">

                            <Input
                                label={t('Web')}
                                {...register('address.zip')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.zip?.message!)}
                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '42px', right: '15px' }}>
                                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.7714 16.0641H3.05673C1.8554 16.0641 0.914062 15.3001 0.914062 14.3241V10.0641C0.914062 9.88732 0.984301 9.71775 1.10932 9.59272C1.23435 9.4677 1.40392 9.39746 1.58073 9.39746C1.75754 9.39746 1.92711 9.4677 2.05213 9.59272C2.17716 9.71775 2.2474 9.88732 2.2474 10.0641V14.3241C2.2474 14.4675 2.55473 14.7308 3.05673 14.7308H14.7714C15.2734 14.7308 15.5807 14.4675 15.5807 14.3241V10.0641C15.5807 9.88732 15.651 9.71775 15.776 9.59272C15.901 9.4677 16.0706 9.39746 16.2474 9.39746C16.4242 9.39746 16.5938 9.4677 16.7188 9.59272C16.8438 9.71775 16.9141 9.88732 16.9141 10.0641V14.3241C16.9141 15.3001 15.9727 16.0641 14.7714 16.0641Z" fill="#1D1D1B" />
                                    <path d="M15.2317 5.57079L9.74366 0.58212C9.66588 0.51352 9.57989 0.454849 9.48766 0.407453C9.43247 0.303853 9.35015 0.217207 9.24952 0.156789C9.14888 0.0963701 9.0337 0.0644531 8.91632 0.0644531C8.79894 0.0644531 8.68377 0.0963701 8.58313 0.156789C8.48249 0.217207 8.40017 0.303853 8.34499 0.407453C8.2525 0.454765 8.16627 0.513442 8.08832 0.58212L2.60099 5.57079C2.5362 5.62971 2.48366 5.70081 2.44635 5.78004C2.40904 5.85926 2.38771 5.94506 2.38356 6.03254C2.37941 6.12001 2.39254 6.20744 2.42218 6.28984C2.45182 6.37225 2.4974 6.448 2.55632 6.51279C2.61524 6.57757 2.68635 6.63012 2.76557 6.66743C2.8448 6.70473 2.9306 6.72607 3.01807 6.73022C3.10554 6.73436 3.19298 6.72124 3.27538 6.6916C3.35778 6.66196 3.43354 6.61637 3.49832 6.55745L8.24966 2.23812V10.7308C8.24966 10.9076 8.31989 11.0772 8.44492 11.2022C8.56994 11.3272 8.73951 11.3975 8.91632 11.3975C9.09313 11.3975 9.2627 11.3272 9.38773 11.2022C9.51275 11.0772 9.58299 10.9076 9.58299 10.7308V2.23812L14.3343 6.55745C14.3991 6.61637 14.4749 6.66196 14.5573 6.6916C14.6397 6.72124 14.7271 6.73436 14.8146 6.73022C14.902 6.72607 14.9878 6.70473 15.0671 6.66743C15.1463 6.63012 15.2174 6.57757 15.2763 6.51279C15.3352 6.448 15.3808 6.37225 15.4105 6.28984C15.4401 6.20744 15.4532 6.12001 15.4491 6.03254C15.4449 5.94506 15.4236 5.85926 15.3863 5.78004C15.349 5.70081 15.2964 5.62971 15.2317 5.57079Z" fill="#1D1D1B" />
                                </svg>

                            </div>
                        </div>

                        <Description
                            title={t('Loyalty Number')}
                            className="w-full px-0  sm:w-4/12 md:w-full"
                        />
                        <div className="relative">

                            <Input
                                label={t('Customer Loyalty Nbr.')}
                                {...register('address.zip')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.zip?.message!)}

                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82311 1.06445C4.85219 1.06445 3.90308 1.35236 3.09579 1.89178C2.2885 2.43119 1.6593 3.19788 1.28774 4.09489C0.916189 4.9919 0.818974 5.97894 1.00839 6.9312C1.19781 7.88346 1.66535 8.75817 2.35189 9.44471C3.03843 10.1313 3.91314 10.5988 4.8654 10.7882C5.81766 10.9776 6.80471 10.8804 7.70172 10.5089C8.59873 10.1373 9.36541 9.5081 9.90482 8.70081C10.4442 7.89352 10.7321 6.94441 10.7321 5.97349C10.7321 4.67156 10.2148 3.42298 9.29423 2.50237C8.37362 1.58176 7.12504 1.06454 5.82311 1.06445Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" />
                                    <path d="M9.48438 9.63574L12.9128 13.0642" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <Input
                            label={t('Exl Ref Nbr.')}
                            {...register('address.zip')}
                            variant="outline"
                            className="mb-5"
                            error={t(errors.address?.zip?.message!)}

                        />
                        <div className="relative">

                            <Input
                                label={t('Locale.')}
                                {...register('address.zip')}
                                variant="outline"
                                className="mb-5"
                                error={t(errors.address?.zip?.message!)}

                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82311 1.06445C4.85219 1.06445 3.90308 1.35236 3.09579 1.89178C2.2885 2.43119 1.6593 3.19788 1.28774 4.09489C0.916189 4.9919 0.818974 5.97894 1.00839 6.9312C1.19781 7.88346 1.66535 8.75817 2.35189 9.44471C3.03843 10.1313 3.91314 10.5988 4.8654 10.7882C5.81766 10.9776 6.80471 10.8804 7.70172 10.5089C8.59873 10.1373 9.36541 9.5081 9.90482 8.70081C10.4442 7.89352 10.7321 6.94441 10.7321 5.97349C10.7321 4.67156 10.2148 3.42298 9.29423 2.50237C8.37362 1.58176 7.12504 1.06454 5.82311 1.06445Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" />
                                    <path d="M9.48438 9.63574L12.9128 13.0642" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>


                        <Description
                            title={t('Account Personal Data Privacy')}
                            className="w-full px-0  sm:w-4/12 md:w-full"
                        />

                        <div className='flex items-center'>
                            <input type="checkbox" id="Consented" name="Consented" value="Consented" className="w-5 h-5" />
                            <label htmlFor="Consented" className="ml-2">Consented to the Processing of Personal Data</label>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-3/4">
                                <label>Date of Conset</label>

                            </div>
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>10/20/2024</option>
                                    <option>10/22/2024</option>
                                    <option>10/23/2024</option>
                                    <option>10/24/2024</option>
                                </select>
                            </div>
                        </div>

                    </div>
                    <div className="w-3/4 pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
                        <Description
                            title={t('Primary Contact')}
                            className="w-full px-0 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
                        />
                        <div className="relative">
                            <Input
                                label={t('Name')}
                                {...register('businessContactdetail.fax')}
                                variant="outline"
                                className="mb-5"
                            // error={t(errors.businessContactdetail?.fax?.message!)}
                            // required
                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.82311 1.06445C4.85219 1.06445 3.90308 1.35236 3.09579 1.89178C2.2885 2.43119 1.6593 3.19788 1.28774 4.09489C0.916189 4.9919 0.818974 5.97894 1.00839 6.9312C1.19781 7.88346 1.66535 8.75817 2.35189 9.44471C3.03843 10.1313 3.91314 10.5988 4.8654 10.7882C5.81766 10.9776 6.80471 10.8804 7.70172 10.5089C8.59873 10.1373 9.36541 9.5081 9.90482 8.70081C10.4442 7.89352 10.7321 6.94441 10.7321 5.97349C10.7321 4.67156 10.2148 3.42298 9.29423 2.50237C8.37362 1.58176 7.12504 1.06454 5.82311 1.06445Z" stroke="black" stroke-width="1.5" stroke-miterlimit="10" />
                                    <path d="M9.48438 9.63574L12.9128 13.0642" stroke="black" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>
                        <Input
                            label={t('Job Title')}
                            {...register('businessContactdetail.website')}
                            variant="outline"
                            className="mb-5"
                        />
                        <div className="relative">
                            <Input
                                label={t('Email')}
                                type='email'
                                {...register('businessContactdetail.email')}
                                variant="outline"
                                className="mb-0"
                                error={t(errors.businessContactdetail?.email?.message!)}

                            />
                            <div className="overlap__icon" style={{ position: 'absolute', top: '44px', right: '15px' }}>
                                <svg width="17" height="12" viewBox="0 0 17 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.7712 0.0644531H2.05692C1.75382 0.0644531 1.46312 0.184861 1.2488 0.399188C1.03447 0.613515 0.914063 0.904206 0.914062 1.20731V10.3502C0.914063 10.6533 1.03447 10.944 1.2488 11.1583C1.46312 11.3726 1.75382 11.493 2.05692 11.493H15.7712C16.0743 11.493 16.365 11.3726 16.5793 11.1583C16.7937 10.944 16.9141 10.6533 16.9141 10.3502V1.20731C16.9141 0.904206 16.7937 0.613515 16.5793 0.399188C16.365 0.184861 16.0743 0.0644531 15.7712 0.0644531ZM14.5141 1.20731L8.91406 5.0816L3.31406 1.20731H14.5141ZM2.05692 10.3502V1.72731L8.58835 6.24731C8.684 6.31367 8.79764 6.34923 8.91406 6.34923C9.03048 6.34923 9.14412 6.31367 9.23978 6.24731L15.7712 1.72731V10.3502H2.05692Z" fill="black" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>Business 1</option>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="w-3/4">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-0"

                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-3/4">
                                <select className="rounded px-4 w-full mt-3 h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>Cell</option>
                                    <option>Admin</option>
                                    <option>Manager</option>
                                    <option>Staff</option>
                                </select>
                            </div>
                            <div className="w-3/4">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-3"

                                />
                            </div>
                        </div>

                    </div>
                    <div className="w-3/4 pb-8 my-5 border-b border-gray-300 border-dashed sm:my-8">
                        <Description
                            title={t('So Quote Information')}
                            className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-full md:pe-5"
                        />

                        <div className="flex items-center gap-4">
                            <div className="w-3/4">
                                <label>Date of Conset</label>
                            </div>
                            <div className="w-3/5">
                                <select className="rounded px-4 w-full h-12" style={{ border: '1px solid #d1d5db' }}>
                                    <option>10/20/2024</option>
                                    <option>10/22/2024</option>
                                    <option>10/23/2024</option>
                                    <option>10/24/2024</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-3/4">
                                <label>Days Since Last Order/Quote date:</label>
                            </div>
                            <div className="w-3/5">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-0"
                                    error={t(errors.address?.zip?.message!)}

                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-3/4">
                                <label>Followup In days</label>
                            </div>
                            <div className="w-3/5">
                                <Input
                                    {...register('address.zip')}
                                    variant="outline"
                                    className="mb-5"
                                    error={t(errors.address?.zip?.message!)}

                                />
                            </div>
                        </div>
                    </div>
                </div>



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

export default ComapnySetupForm;
