import {
    Coupon,
    getWishlist,
    CouponInput,
    CouponPaginator,
    CouponQueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { wishlistCrudFactory } from './wishlist-crud';
  import { HttpClient } from './http-client';
  import { VerifyCouponInputType, VerifyCouponResponse } from '@/types';
  
  export const wishlistClient = {
    ...wishlistCrudFactory<Coupon, any, CouponInput>(API_ENDPOINTS.WISHLIST),
    get({ code, language }: { code: string; language: string }) {
      return HttpClient.get<Coupon>(`${API_ENDPOINTS.UNIFORMS}/${code}`, {
        language,
      });
    },
    // uniformWishlist: ({ code, ...params }: Partial<CouponQueryOptions>) => {
    //   return HttpClient.put<CouponPaginator>(API_ENDPOINTS.WISHLIST, {
    //     searchJoin: 'and',
    //     ...params,
    //     search: HttpClient.formatSearchParams({ code }),
    //   });
    // },
    register(payload: { uniform_id: any; product_id: any; variation_option_id: any }) {
      return HttpClient.post(`${API_ENDPOINTS.WISHLIST}`, payload);
    },
    
    getWishlist: ({ code, ...params }: Partial<CouponQueryOptions>) => {
      return HttpClient.get<CouponPaginator>(API_ENDPOINTS.WISHLIST, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ code }),
      });
    },
    
    
    paginated: ({ code, ...params }: Partial<CouponQueryOptions>) => {
      return HttpClient.get<CouponPaginator>(API_ENDPOINTS.WISHLIST, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ code }),
      });
    },
    verify: (input: VerifyCouponInputType) => {
      {
        return HttpClient.post<VerifyCouponResponse>(
          API_ENDPOINTS.VERIFY_COUPONS,
          input
        );
      }
    },
    approve: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        API_ENDPOINTS.APPROVE_COUPON,
        variables
      );
    },
    disapprove: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        API_ENDPOINTS.DISAPPROVE_COUPON,
        variables
      );
    },
  };
  