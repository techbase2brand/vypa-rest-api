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

export const useApproveShopMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};

export const useDisApproveShopMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};

export const useCreateShopMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(shopClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/company`);
      }
      router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COMPANY);
    },
  });
};
// export const useRegisterShopMutation = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const queryClient = useQueryClient();
//   const router = useRouter();

//   return useMutation(shopClient.create, {
//     onSuccess: () => {
//       // if (hasAccess(adminOnly, permissions)) {
//       // return router.push(`/company`);
//       // }
//       // router.push(`/thanks`);
//       setModalVisible(true)
//       toast.success('Company Register successfully');
//       // router.push(Routes.dashboard);
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.COMPANY);
//     },
    
//   });
  
// };
export const useRegisterShopMutation = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: registerUser } = useMutation(shopClient.create, {
    onSuccess: () => {
      console.log("Mutation success, opening modal...");
      setModalVisible(true); // Open the modal on success
      toast.success('Company registered successfully');
      // Optionally navigate to a "thank you" page after registration
      // router.push('/thanks');
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COMPANY); // Refetch queries
    },
  });

  return {
    registerUser,
    isModalVisible,    // Ensure we are returning this state
    setModalVisible,   // This allows you to modify modal visibility from other components
  };
};

export const useUpdateShopMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(shopClient.update, {
    onSuccess: async (data) => {
      await router.push(`/company`, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};
export const useDeleteShopMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(shopClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('Company Deleted Successfully!'));
      
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
    },
  });
};
export const useTransferShopOwnershipMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(shopClient.transferShopOwnership, {
    onSuccess: (shop: Shop) => {
      toast.success(
        `${t('common:successfully-transferred')}${shop.owner?.name}`,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SHOPS);
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

export const useShopsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.SHOPS, options],
    ({ queryKey, pageParam }) =>
      shopClient.paginated(Object.assign({}, queryKey[1], pageParam)),
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

export const useInActiveShopsQuery = (options: Partial<ShopQueryOptions>) => {
  const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
    [API_ENDPOINTS.NEW_OR_INACTIVE_SHOPS, options],
    ({ queryKey, pageParam }) =>
      shopClient.newOrInActiveShops(Object.assign({}, queryKey[1], pageParam)),
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
