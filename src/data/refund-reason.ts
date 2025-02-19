import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  RefundReasonQueryOptions,
  RefundReasonPaginator,
  GetParams,
  RefundReason,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { RefundReasonClient } from '@/data/client/refund-reason';
import { Config } from '@/config';


export const useApproveRefundMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(RefundReasonClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUND_REASONS);
    },
  });
};

export const useDisApproveRefundMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(RefundReasonClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUND_REASONS);
    },
  });
};
export const useCreateRefunReasonMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(RefundReasonClient.create, {
    onSuccess: async () => {
      // router.push('/returns');
      toast.success(t('Return submit successfully'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUND_REASONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useDeleteRefundReasonMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(RefundReasonClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUND_REASONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useUpdateRefundReasonMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(RefundReasonClient.update, {
    onSuccess: async (data) => {
      // const generateRedirectUrl = router.query.shop
      //   ? `/${router.query.shop}${Routes.refundReasons.list}`
      //   : Routes.refundReasons.list;
      // await router.push(
      //   `${generateRedirectUrl}/${data?.slug!}/edit`,
      //   undefined,
      //   {
      //     locale: Config.defaultLanguage,
      //   }
      // );
      router.push('/returns');
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.REFUND_REASONS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useRefundReasonQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<RefundReason, Error>(
    [API_ENDPOINTS.REFUND_REASONS, { slug, language }],
    () => RefundReasonClient.get({ slug, language }),
  );

  return {
    refundReason: data,
    error,
    loading: isLoading,
  };
};

export const useRefundReasonsQuery = (
  options: Partial<RefundReasonQueryOptions>,
) => {
  const { data, error, isLoading } = useQuery<RefundReasonPaginator, Error>(
    [API_ENDPOINTS.REFUND_REASONS, options],
    ({ queryKey, pageParam }) =>
      RefundReasonClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    refundReasons: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
