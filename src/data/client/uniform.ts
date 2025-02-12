import {
    Coupon,
    CouponInput,
    CouponPaginator,
    CouponQueryOptions,
  } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { uniformCrudFactory } from './uniforms-crud';
  import { HttpClient } from './http-client';
  import { VerifyCouponInputType, VerifyCouponResponse } from '@/types';
  
  export const uniformClient = {
    ...uniformCrudFactory<Coupon, any, CouponInput>(API_ENDPOINTS.UNIFORMS),
    get({ code, language }: { code: string; language: string }) {
      return HttpClient.get<Coupon>(`${API_ENDPOINTS.UNIFORMS}/${code}`, {
        language,
      });
    },
    paginated: ({ code, ...params }: Partial<CouponQueryOptions>) => {
      return HttpClient.get<CouponPaginator>(API_ENDPOINTS.UNIFORMS, {
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
  