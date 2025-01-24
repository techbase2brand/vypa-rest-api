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
import { employeeClient } from './client/employee';

export const useApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useDisApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/employee`);
      }
      router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE);
    },
  });
};
export const useRegisterEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeClient.register, {
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
      queryClient.invalidateQueries(API_ENDPOINTS.COMPANY);
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.update, {
    onSuccess: async (data) => {
      await router.push(`/employee`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};
export const useDeleteEmployeeMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('Employee Deleted Successfully!'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};
export const useTransferShopOwnershipMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.transferShopOwnership, {
    onSuccess: (shop: Shop) => {
      toast.success(
        `${t('common:successfully-transferred')}${shop.owner?.name}`,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useEmployeeQuery = ({ slug }: { slug: string }, options?: any) => {
  console.log('slug1123', slug);

  return useQuery<Shop, Error>(
    [API_ENDPOINTS.GET_EMPLOYEE, { slug }],
    () => employeeClient.get({ slug }),
    options,
  );
};

export const useEmployeesQuery = (options: Partial<EmployeeQueryOptions>) => {
  console.log('options', options);

  const { data, error, isLoading } = useQuery<EmployeePaginator, Error>(
    [API_ENDPOINTS.GET_EMPLOYEE, options],
    ({ queryKey, pageParam }) =>
      employeeClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    employee: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// export const useInActiveShopsQuery = (options: Partial<ShopQueryOptions>) => {
//   const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
//     [API_ENDPOINTS.NEW_OR_INACTIVE_SHOPS, options],
//     ({ queryKey, pageParam }) =>
//     employeeClient.newOrInActiveShops(Object.assign({}, queryKey[1], pageParam)),
//     {
//       keepPreviousData: true,
//     },
//   );

//   return {
//     shops: data?.data ?? [],
//     paginatorInfo: mapPaginatorData(data),
//     error,
//     loading: isLoading,
//   };
// };
