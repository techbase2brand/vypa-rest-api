import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import {
  EmployeePaginator,
  EmployeeQueryOptions,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
} from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { contactClient } from './client/contact';
import { useState } from 'react';
import { companySetingClient } from './client/comapny-setting';

export const useApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(contactClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};

export const useDisApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(contactClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};



export const useCreateCompanySettingMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(companySetingClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/`);
      }
      router.push(Routes.dashboard);
    },

   
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COMPANY_SETTING);
    },
  });
};
export const useRegisterEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(contactClient.register, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
      // return router.push(`/company`);
      // }
      toast.success('Company Register successfully');
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('/contact');
    },
  });
};






export const useCompanySettingQuery = ({ slug }: { slug: string }, options?: any) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.COMPANY_SETTING, { slug }],
    () => companySetingClient.get({ slug }),
    options,
  );
};

export const useCompanySettingsQuery = (options: Partial<EmployeeQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EmployeePaginator, Error>(
    [API_ENDPOINTS.COMPANY_SETTING, options],
    ({ queryKey, pageParam }) =>
    companySetingClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    companySetting: data?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};


