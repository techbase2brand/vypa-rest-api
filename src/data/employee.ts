import { Config } from '@/config';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import {
  EmployeePaginator,
  EmployeeQueryOptions,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
} from '@/types';
import { adminOnly, getAuthCredentials, hasAccess } from '@/utils/auth-utils';
import { mapPaginatorData } from '@/utils/data-mappers';
import { useTranslation } from 'next-i18next';
import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { employeeClient } from './client/employee';
import { useState } from 'react';

export const useApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useDisApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useRegisterEmpMutation = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: registerEmployee } = useMutation(employeeClient.register, {
    onSuccess: () => {
      console.log('Mutation success, opening modal...');
      setModalVisible(true); // Open the modal on success
      toast.success('Employee registered successfully');
      // Optionally navigate to a "thank you" page after registration
      // router.push('/thanks');
    },
    onError: (error) => {
      console.error('Error creating shop:', error);

      // Extract and display specific error messages
      //@ts-ignore
      if (error.response?.data) {
        //@ts-ignore
        const errorDetails = error.response.data;

        if (errorDetails['Employee_email']) {
          const message = errorDetails['Employee_email'][0];
          console.error('Error message:', message);

          // Show the error message in a toast
          toast.error(message);
        } else {
          // Fallback for unknown errors
          toast.error('An error occurred while creating the employee.');
        }
      } else {
        // Handle generic errors
        toast.error('Something went wrong. Please try again.');
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries('/employee'); // Refetch queries
    },
  });

  return {
    registerEmployee,
    isModalVisible, // Ensure we are returning this state
    setModalVisible, // This allows you to modify modal visibility from other components
  };
};

export const useCreateEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/employee`);
      }
      router.push(Routes.dashboard);
    },

    onError: (error) => {
      console.error('Error creating shop:', error);

      // Extract and display specific error messages
      //@ts-ignore
      if (error.response?.data) {
        //@ts-ignore
        const errorDetails = error.response.data;

        if (errorDetails['Employee_email']) {
          const message = errorDetails['Employee_email'][0];
          console.error('Error message:', message);

          // Show the error message in a toast
          toast.error(message);
        } else {
          // Fallback for unknown errors
          toast.error('An error occurred while creating the shop.');
        }
      } else {
        // Handle generic errors
        toast.error('Something went wrong. Please try again.');
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.EMPLOYEE);
    },
  });
};
export const useRegisterEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeClient.register, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
      // return router.push(`/company`);
      // }
      toast.success('Company Register successfully');
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('/employee');
    },
  });
};
export const useDeleeteAllEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(employeeClient.deleteAll, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
      router.push(`/employee`);
      // }
      toast.success('Employee Deleted Successfully!');
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('employee/deleteAll');
    },
  });
};

export const useUpdateEmployeeMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.update, {
    onSuccess: async (data) => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
      return router.push(`/employee`);
      // }
      // toast.success(t('common:successfully-updated'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};
export const useDeleteEmployeeMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.delete, {
    onSuccess: () => {
      toast.success(t('Employee Deleted Successfully!'));
      queryClient.invalidateQueries([API_ENDPOINTS.GET_EMPLOYEE]);
      queryClient.refetchQueries([API_ENDPOINTS.GET_EMPLOYEE]);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    // },
    onSettled: () => {
      // Invalidate all queries starting with the endpoint
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.GET_EMPLOYEE]
      });
    },
  });
};

export const useTransferShopOwnershipMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(employeeClient.transferShopOwnership, {
    onSuccess: (shop: Shop) => {
      toast.success(
        `${t('common:successfully-transferred')}${shop.owner?.name}`,
      );
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.GET_EMPLOYEE);
    },
  });
};

export const useEmployeeQuery = ({ slug }: { slug: string }, options?: any) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.GET_EMPLOYEE, { slug }],
    () => employeeClient.get({ slug }),
    options,
  );
};

export const useEmployeesQuery = (options: Partial<EmployeeQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EmployeePaginator, Error>(
    [API_ENDPOINTS.GET_EMPLOYEE, options],
    ({ queryKey, pageParam }) =>
      employeeClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    employee: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

// export const useInActiveShopsQuery = (options: Partial<ShopQueryOptions>) => {
//   const { data, error, isLoading } = useQuery<ShopPaginator, Error>(
//     [API_ENDPOINTS.NEW_OR_INACTIVE_SHOPS, options],
//     ({ queryKey, pageParam }) =>
//     employeeClient.newOrInActiveShops(Object.assign({}, queryKey[1], pageParam)),
//     {
//       keepPreviousData: true,
//     },
//   );

//   return {
//     shops: data?.data ?? [],
//     paginatorInfo: mapPaginatorData(data),
//     error,
//     loading: isLoading,
//   };
// };
