import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';

interface LanguageParam {
  language: string;
}

export function employeeGroupCrudFactory<Type, QueryParams extends LanguageParam, InputType>(
  endpoint: string,
) {
  return {
    all(params: QueryParams) {
      return HttpClient.get<Type[]>(endpoint, params);
    },
    paginated(params: QueryParams) {
      return HttpClient.get<PaginatorInfo<Type>>(endpoint, params);
    },
    get({ slug, language }: GetParams) {
      return HttpClient.get<Type>(`${endpoint}/${slug}`, { language });
    },
    create(data: InputType) {
      return HttpClient.post<Type>(endpoint, data);
    },
    register(data: InputType) {
      return HttpClient.post<Type>(endpoint, data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
      return HttpClient.put<Type>(`${"groups/update"}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient.delete<boolean>(`${endpoint}/${id}`);
    },
  };
}
