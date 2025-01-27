import type { GetParams, PaginatorInfo } from '@/types';
import { HttpClient } from './http-client';

interface LanguageParam {
  language: string;
}

export function employeeCrudFactory<Type, QueryParams extends LanguageParam, InputType>(
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
    filter(data: InputType) {
      return HttpClient.post<Type>(endpoint, data);
    },
    register(data: InputType) {
      return HttpClient.post<Type>(endpoint, data);
    },
    deleteAll(data: InputType) {
      return HttpClient.post<Type>('employee/deleteAll', data);
    },
    update({ id, ...input }: Partial<InputType> & { id: string }) {
      return HttpClient.put<Type>(`${"employee/update"}/${id}`, input);
    },
    delete({ id }: { id: string }) {
      return HttpClient.delete<boolean>(`${"employee"}/${id}`);
    },
  };
}
