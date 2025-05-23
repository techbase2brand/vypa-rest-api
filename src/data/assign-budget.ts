import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { Shop, ShopPaginator, ShopQueryOptions } from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { shopClient } from './client/shop';
import { useState } from 'react';
import { BudgetClient } from './client/budget';
import { AssignBudgetClient } from './client/assign-budget';

export const useApproveRequestMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(AssignBudgetClient.approve, {
    onSuccess: () => {
      toast.success(t('Approved Budget'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BUDGET_ASSIGN);
    },
  });
};

export const useDisApproveRequestMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(AssignBudgetClient.disapprove, {
    onSuccess: () => {
      toast.success(t('Disapproved Budget'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BUDGET_ASSIGN);
    },
  });
};


export const useCreateAssignBudgetMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(AssignBudgetClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        toast.success("request sent successfully")
        // return router.push(`/budget`);
      }
    //   router.push(Routes.dashboard);
    },
    onError: (error) => {
      console.error("Error creating shop:", error);

    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.BUDGET_ASSIGN);
    },
  });
};

export const useShopQuery = ({ slug }: { slug: string }, options?: any) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.COMPANY, { slug }],
    () => shopClient.get({ slug }),
    options,
  );
};

export const useAssignBudgetsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.BUDGET_ASSIGN, options],
    ({ queryKey, pageParam }) =>
    AssignBudgetClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    budgets: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

