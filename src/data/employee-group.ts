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
import { employeeGroupClient } from './client/employee-group';

export const useApproveEmployeeGroupMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeGroupClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};

export const useDisApproveEmployeeGroupMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeGroupClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};

export const useCreateEmployeeGroupMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeGroupClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/employee-group`);
      }
      router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};
export const useRegisterEmployeeGroupMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeGroupClient.register, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};

export const useUpdateEmployeeGroupMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeGroupClient.update, {
    onSuccess: async (data) => {
      await router.push(`/employee-group`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};
export const useDeleteEmployeeGroupMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeGroupClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('deleted'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};
export const useTransferShopOwnershipMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeGroupClient.transferShopOwnership, {
    onSuccess: (shop: Shop) => {
      toast.success(
        `${t('common:successfully-transferred')}${shop.owner?.name}`,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE_GROUP);
    },
  });
};

export const useEmployeeGroupQuery = (
  { slug }: { slug: string },
  options?: any,
) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.EMPLOYEE_GROUP, { slug }],
    () => employeeGroupClient.get({ slug }),
    options,
  );
};

export const useEmployeeGroupsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.EMPLOYEE_GROUP, options],
    ({ queryKey, pageParam }) =>
      employeeGroupClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    groups: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useInActiveShopsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.NEW_OR_INACTIVE_SHOPS, options],
    ({ queryKey, pageParam }) =>
      employeeGroupClient.newOrInActiveShops(
        Object.assign({}, queryKey[1], pageParam),
      ),
    {
      keepPreviousData: true,
    },
  );

  return {
    shops: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};
