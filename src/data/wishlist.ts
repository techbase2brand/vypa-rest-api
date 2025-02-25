import Router, { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { couponClient } from './client/coupon';
import { Coupon, CouponPaginator, CouponQueryOptions, Shop } from '@/types';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Config } from '@/config';
import { uniformClient } from './client/uniform';
import { wishlistClient } from './client/wishlist';

export const useCreateUniformMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const router = useRouter();

  return useMutation(uniformClient.create, {
    onSuccess: async () => {
      // router.push('/uniforms');
      // const generateRedirectUrl = router.query.shop
      //   ? `/${router.query.shop}${Routes.coupon.list}`
      //   : Routes.coupon.list;
      // await Router.push(generateRedirectUrl, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(t('common:successfully-created'));
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.UNIFORMS);
    },
  });
};

// export const useDeleteUniformMutation = () => {
//   const queryClient = useQueryClient();
//   const { t } = useTranslation();
//   return useMutation(uniformClient.delete, {
//     onSuccess: () => {
//       toast.success(t('common:successfully-deleted'));
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.UNIFORMS);
//     },
//   });
// };

export const useDeleteWishlistMutation = () => {
  // const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(wishlistClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      toast.success(('Item Deleted Successfully!'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WISHLIST);
    },
  });
};

export const useDeleeteAllWishlistMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(wishlistClient.deleteAll, {
    onSuccess: () => {
      // const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
      //  router.push(`/company`);
      // }
     
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WISHLIST);
    },
  });
};
export const useUpdateUnifromMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(uniformClient.update, {
    onSuccess: async (data) => {
      // router.push('/uniforms');
      // const generateRedirectUrl = router.query.shop
      //   ? `/${router.query.shop}${Routes.coupon.list}`
      //   : Routes.coupon.list;
      // await router.push(generateRedirectUrl, undefined, {
      //   locale: Config.defaultLanguage,
      // });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.UNIFORMS);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};

export const useProductWishlistMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation(uniformClient.register, {
    onSuccess: async (data) => {
      // router.push('/uniforms');
      // const generateRedirectUrl = router.query.shop
      //   ? `/${router.query.shop}${Routes.coupon.list}`
      //   : Routes.coupon.list;
      // await router.push(generateRedirectUrl, undefined, {
      //   locale: Config.defaultLanguage,
      // });

      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WISHLIST);
    },
    onError: (error: any) => {
      toast.error(t(`common:${error?.response?.data.message}`));
    },
  });
};



export const useGetProductWishlistMutation = (options: Partial<CouponQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CouponPaginator, Error>(
    [API_ENDPOINTS.WISHLIST, options],
    ({ queryKey, pageParam }) =>
    uniformClient.getWishlist(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    wishlist: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// export const useGetProductWishlistMutation = () => {
//   const { t } = useTranslation();
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   return useMutation(uniformClient.getWishlist, {
//     onSuccess: async (data) => {
//       // router.push('/uniforms');
//       // const generateRedirectUrl = router.query.shop
//       //   ? `/${router.query.shop}${Routes.coupon.list}`
//       //   : Routes.coupon.list;
//       // await router.push(generateRedirectUrl, undefined, {
//       //   locale: Config.defaultLanguage,
//       // });

//       toast.success(t('common:successfully-updated'));
//     },
//     // Always refetch after error or success:
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.WISHLIST);
//     },
//     onError: (error: any) => {
//       toast.error(t(`common:${error?.response?.data.message}`));
//     },
//   });
// };



export const useVerifyCouponMutation = () => {
  return useMutation(uniformClient.verify);
};

// export const useUniformQuery = ({
//   code,
//   language,
// }: {
//   code: string;
//   language: string;
// }) => {
//   const { data, error, isLoading } = useQuery<Coupon, Error>(
//     [API_ENDPOINTS.UNIFORMS, { code, language }],
//     () => uniformClient.get({ code, language }),
//   );

//   return {
//     data: data,
//     error,
//     loading: isLoading,
//   };
// };

export const useUniformQuery = ({ slug }: { slug: string }, options?: any) => {
  console.log('options', options, slug);
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.UNIFORMS, { slug }],
    //@ts-ignore
    () => uniformClient.get({ slug }),
    options,
  );
};

export const useUniformsQuery = (options: Partial<CouponQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CouponPaginator, Error>(
    [API_ENDPOINTS.UNIFORMS, options],
    ({ queryKey, pageParam }) =>
      uniformClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    uniforms: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useApproveCouponMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(uniformClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};
export const useDisApproveCouponMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(uniformClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.COUPONS);
    },
  });
};
