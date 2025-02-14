import {
    EmployeePaginator,
    EmployeeQueryOptions,
    QueryOptions,
    Shop,
    ShopInput,
    ShopPaginator,
    ShopQueryOptions,
    TransferShopOwnershipInput,
  } from '@/types';
  import { ApproveShopInput } from '@/types';
  import { API_ENDPOINTS } from './api-endpoints';
  import { HttpClient } from './http-client';
  import { notificationCrudFactory } from './notification-crud';
  
  export const notificationClient = {
    ...notificationCrudFactory<Shop, QueryOptions, ShopInput>(API_ENDPOINTS.NOTIFICATION),
  
    get({ slug }: { slug: String }) {
      return HttpClient.get<Shop>(`${API_ENDPOINTS.NOTIFICATION}/${slug}`);
    },
    paginated: ({ name, ...params }: Partial<EmployeeQueryOptions>) => {
      return HttpClient.get<EmployeePaginator>(API_ENDPOINTS.NOTIFICATION, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      });
    },
    filter: (variables: ApproveShopInput) => {
      return HttpClient.post<any>(
        `${API_ENDPOINTS.NOTIFICATION}/${API_ENDPOINTS.APPROVE_SHOP}`,
        variables);
    },
    approve: (variables: ApproveShopInput) => {
      return HttpClient.post<any>(
        `${API_ENDPOINTS.NOTIFICATION}/${API_ENDPOINTS.APPROVE_SHOP}`,
        variables);
    },
    disapprove: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        `${API_ENDPOINTS.NOTIFICATION}/${API_ENDPOINTS.DISAPPROVE_SHOP}`,
        // API_ENDPOINTS.DISAPPROVE_SHOP,
        variables,
      );
    },
    transferShopOwnership: (variables: TransferShopOwnershipInput) => {
      return HttpClient.post<any>(
        API_ENDPOINTS.TRANSFER_SHOP_OWNERSHIP,
        variables,
      );
    },
  };
  