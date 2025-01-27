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
import { employeeCrudFactory } from './employee-crud';

export const employeeClient = {
  ...employeeCrudFactory<Shop, QueryOptions, ShopInput>(API_ENDPOINTS.EMPLOYEE),

  get({ slug }: { slug: String }) {
    console.log("employeeClient",slug);
    return HttpClient.get<Shop>(`${API_ENDPOINTS.GET_EMPLOYEE}/${slug}`);
  },
  paginated: ({ name, ...params }: Partial<EmployeeQueryOptions>) => {
    return HttpClient.get<EmployeePaginator>(API_ENDPOINTS.GET_EMPLOYEE, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  filter: (variables: ApproveShopInput) => {
    return HttpClient.post<any>(
      `${API_ENDPOINTS.GET_EMPLOYEE}/${API_ENDPOINTS.APPROVE_SHOP}`,
      variables);
  },
  approve: (variables: ApproveShopInput) => {
    return HttpClient.post<any>(
      `${API_ENDPOINTS.GET_EMPLOYEE}/${API_ENDPOINTS.APPROVE_SHOP}`,
      variables);
  },
  disapprove: (variables: { id: string }) => {
    return HttpClient.post<{ id: string }>(
      `${API_ENDPOINTS.GET_EMPLOYEE}/${API_ENDPOINTS.DISAPPROVE_SHOP}`,
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
