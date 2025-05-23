import {
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
  import { budgetCrudFactory } from './budget-crud';
  
  export const BudgetClient = {
    ...budgetCrudFactory<Shop, QueryOptions, ShopInput>('/budget'),
    get({ slug }: { slug: String }) {
      return HttpClient.get<Shop>(`${'/budget'}/${slug}`);
    },
    paginated: ({ name, ...params }: Partial<ShopQueryOptions>) => {
      return HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      });
    },
    newOrInActiveShops: ({
      is_active,
      name,
      ...params
    }: Partial<ShopQueryOptions>) => {
      return HttpClient.get<ShopPaginator>(API_ENDPOINTS.NEW_OR_INACTIVE_SHOPS, {
        searchJoin: 'and',
        is_active,
        name,
        ...params,
        search: HttpClient.formatSearchParams({ is_active, name }),
      });
    },
    approve: (variables: ApproveShopInput) => {
      return HttpClient.post<any>(`${API_ENDPOINTS.COMPANY}/${API_ENDPOINTS.APPROVE_SHOP}`, variables);
    },
    disapprove: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        `${API_ENDPOINTS.COMPANY}/${API_ENDPOINTS.DISAPPROVE_SHOP}`,
        variables
      );
    },
    transferShopOwnership: (variables: TransferShopOwnershipInput) => {
      return HttpClient.post<any>(API_ENDPOINTS.TRANSFER_SHOP_OWNERSHIP, variables);
    },
  };
  