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
  import { assignbudgetCrudFactory } from './assign-budget-crud';
  
  export const AssignBudgetClient = {
    ...assignbudgetCrudFactory<Shop, QueryOptions, ShopInput>(API_ENDPOINTS.BUDGET_ASSIGN),
    get({ slug }: { slug: String }) {
      return HttpClient.get<Shop>(`${API_ENDPOINTS.BUDGET_ASSIGN}/${slug}`);
    },
    paginated: ({ name, ...params }: Partial<ShopQueryOptions>) => {
      return HttpClient.get<ShopPaginator>(API_ENDPOINTS.BUDGET_ASSIGN, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({ name }),
      });
    },
    
    approve: (variables: ApproveShopInput) => {
      return HttpClient.post<any>(`${API_ENDPOINTS.BUDGET_ASSIGN}/${API_ENDPOINTS.APPROVE_SHOP}`, variables);
    },
    disapprove: (variables: { id: string }) => {
      return HttpClient.post<{ id: string }>(
        `${API_ENDPOINTS.BUDGET_ASSIGN}/${API_ENDPOINTS.DISAPPROVE_SHOP}`,
        variables
      );
    },
  };
  