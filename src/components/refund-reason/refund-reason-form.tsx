import { useModalAction } from '@/components//ui/modal/modal.context';
import Card from '@/components/common/card';
import { EditIcon } from '@/components/icons/edit';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import Input from '@/components/ui/input';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import { RefundReason } from '@/types';
import { getErrorMessage } from '@/utils/form-error';
import { formatSlug } from '@/utils/use-slug';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { refundReasonValidationSchema } from './refund-reason-validation-schema';
import {
  useCreateRefunReasonMutation,
  useUpdateRefundReasonMutation,
} from '@/data/refund-reason';
import { RefundReasonSuggestions } from '@/components/refund-reason/refund-reason-ai-prompt';
import StickyFooterPanel from '../ui/sticky-footer-panel';
import { useShopsQuery } from '@/data/shop';

type FormValues = {
  // customer_name: strings
  slug: string;
  name?: string;
  email?: string;
  company_name?: string;
  date?: string;
  invoice_number?: string;
  order_date?: string;
  comment?: string;
  invoicing_issue?: string;
  goods_issue?: string;
  item_code?: string;
  languages: string;
};

type IProps = {
  initialValues?: RefundReason | null;
};

export default function CreateOrUpdateRefundReasonForm({
  initialValues,
}: IProps) {
  const router = useRouter();
  const { locale } = useRouter();
  const { t } = useTranslation();
  const [isSlugDisable, setIsSlugDisable] = useState<boolean>(true);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const isSlugEditable =
    router?.query?.action === 'edit' &&
    router?.locale === Config.defaultLanguage;
  const {
    query: { shop },
  } = router;
  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    shouldUnregister: true,
    //@ts-ignore
    resolver: yupResolver(refundReasonValidationSchema),
    ...(initialValues && {
      defaultValues: {
        ...initialValues,
        languages: router?.locale!,
      } as FormValues,
    }),
  });
  const { openModal } = useModalAction();
  const { settings } = useSettingsQuery({
    language: locale!,
  });

  const { options } = settings!;
  //@ts-ignore
  const { shops, paginatorInfo, loading, error } = useShopsQuery({
    // name: searchTerm,
    limit: 100,
    // page,
    // orderBy,
    // sortedBy,
  });
  const generateName = watch('name');
  //@ts-ignore
  const slugAutoSuggest = formatSlug(generateName);
  const autoSuggestionList = useMemo(() => {
    return RefundReasonSuggestions({ name: generateName ?? '' });
  }, [generateName]);

  const { mutate: createRefundReason, isLoading: creating } =
    useCreateRefunReasonMutation();
  const { mutate: updateRefundReason, isLoading: updating } =
    useUpdateRefundReasonMutation();

  //@ts-ignore
  const handleChange = (event) => {
    const selectedOption = shops.find(
      //@ts-ignore
      (option) => option.name === event.target.value,
    );
    //@ts-ignore
    setSelectedCompanyId(selectedOption?.id || null);
  };
  const onSubmit = async (values: FormValues) => {
    console.log('values', values);

    const input = {
      ...values,
      language: router.locale!,
      // slug: formatSlug(values.slug!),
    };

    try {
      if (
        !initialValues ||
        !initialValues.translated_languages.includes(router.locale!)
      ) {
        //@ts-ignore
        createRefundReason({
          ...input,
        },{
          onSuccess: () => {
            window.location.reload();
          },
        }
        );
      } else {
        updateRefundReason({
          ...input,
          id: initialValues.id!,
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 sm:my-8">
        

        <h1 className="text-md font-semibold text-heading mt-10">
          {t('Customer Information')}
        </h1>
        <div className="grid grid-cols-2 gap-4 p-4">
          
          <Input
            label={`${t('Customer Name')}`}
            {...register('name')}
            placeholder={t('Customer Name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            // required
          />

          <Input
            label={t('Email')}
            type="email"
            {...register('email')}
            placeholder={t('Email')}
            variant="outline"
            className="mb-5"
            error={t(errors?.email?.message!)}
            required
          />
        </div>
        

        <div className="my-4">
          <h1 className="text-md font-semibold text-heading ">
            {t('Order Details')}
          </h1>
          <p className="text-sm">Please check the appropriate boxes below.</p>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <Input
            label={t('Invoice Number')}
            {...register('invoice_number')}
            placeholder={t('#020323004')}
            variant="outline"
            className="mb-5"
            error={t(errors?.invoice_number?.message!)}
            required
          />
         
          <div>
            <label
              htmlFor="userType"
              className="block text-md text-black font-medium"
            >
               Goods Issue<span className="ml-0.5 text-red-500">*</span> 
            </label>
            
            <select
              {...register('goods_issue')}
              className="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              // required
           >
              <option value=""> Select Goods Issue</option>
              <option value="delivery_late">Delivery Late</option>
              <option value="different_design">Different Design</option>
              <option value="faulty">Faulty</option>
              <option value="goods_short_supplied">
                Goods Short Supplied by Warehouse
              </option>
              <option value="incorrectly_picked_returned">
                Incorrectly Picked by Warehouse - Goods Returned
              </option>
              <option value="incorrectly_picked_kept">
                Incorrectly Picked by Warehouse - Goods Kept
              </option>
              <option value="incorrectly_specified">
                Incorrectly Specified by BAT
              </option>
              <option value="not_required">Not Required</option>
              <option value="ordered_incorrectly">Ordered Incorrectly</option>
              <option value="product_recall">Product Recall</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
            <p className="my-2 text-xs text-red-500 text-start">
                {errors?.goods_issue?.message!}
              </p>
          </div>
          <div>
            <label
              htmlFor="userType"
              className="block text-md text-black font-medium"
            >
              Invoicing Issue
            </label>
            <select
              {...register('invoicing_issue')}
              className="my-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
            >
              <option value=""> Select Invoicing Issue</option>
              <option value="duplicated_by_customer_service">
                Duplicated by Customer Service
              </option>
              <option value="freight_charge_reversal">
                Freight Charge Reversal
              </option>
              <option value="goods_lost_in_transit">
                Goods Lost in Transit
              </option>
              <option value="incorrect_order_entry_by_customer_service">
                Incorrect Order Entry by Customer Service
              </option>
              <option value="incorrectly_invoiced_by_customer_service">
                Incorrectly Invoiced by Customer Service
              </option>
              <option value="price_adjustment">Price Adjustment</option>
              <option value="not_applicable">Not Applicable</option>
            </select>
          </div>
          
          <div className="mb-5 w-full">
            <label
              htmlFor="comments"
              className="block text-md text-black font-medium"
            >
              Comments
            </label>
            <textarea
              id="comments"
              {...register('comment', { required: 'Comments are required' })}
              placeholder="Enter your comments..."
              rows={5}
              className={`mt-1 block w-full border 
              ${errors.comment ? 'border-red-500' : 'border-gray-300'}
               rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
            />
            {/* {errors.comment && ( */}
              <p className="mt-2 text-sm text-red-600">{errors?.comment?.message!}</p>
            {/* )} */}
          </div>
        </div>

       
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-refund-reason')
              : t('Submit')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
