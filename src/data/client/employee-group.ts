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
  import { employeeGroupCrudFactory } from './employee-group-crud';
  
  export const employeeGroupClient = {
    ...employeeGroupCrudFactory<Shop, QueryOptions, ShopInput>(API_ENDPOINTS.EMPLOYEE_GROUP),
    get({ slug }: { slug: String }) {
      return HttpClient.get<Shop>(`${API_ENDPOINTS.EMPLOYEE_GROUP}/${slug}`);
    },
    paginated: ({ name, ...params }: Partial<ShopQueryOptions>) => {
      return HttpClient.get<ShopPaginator>(API_ENDPOINTS.EMPLOYEE_GROUP, {
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
      return HttpClient.get<ShopPaginator>(API_ENDPOINTS.EMPLOYEE_GROUP, {
        searchJoin: 'and',
        is_active,
        name,
        ...params,
        search: HttpClient.formatSearchParams({ is_active, name }),
      });
    },
    approve: (variables: ApproveShopInput) => {
      return HttpClient.post<any>(API_ENDPOINTS.EMPLOYEE_GROUP, variables);
    },
    disapprove: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        API_ENDPOINTS.DISAPPROVE_SHOP,
        variables
      );
    },
    transferShopOwnership: (variables: TransferShopOwnershipInput) => {
      return HttpClient.post<any>(API_ENDPOINTS.TRANSFER_SHOP_OWNERSHIP, variables);
    },
  };
  