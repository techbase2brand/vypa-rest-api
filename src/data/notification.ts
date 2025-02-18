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
import { notificationClient } from './client/notification';
import { useState } from 'react';

export const useApproveNotificationMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(notificationClient.approve, {
    onSuccess: () => {
      // toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('markAsRead');
    },
  });
};

export const useDisApproveNotificationMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(notificationClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('markAsRead');
    },
  });
};

export const useRegisterEmpMutation = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: registerEmployee } = useMutation(notificationClient.register, {
    onSuccess: () => {
      console.log("Mutation success, opening modal...");
      setModalVisible(true); // Open the modal on success
      toast.success('Employee registered successfully');
      // Optionally navigate to a "thank you" page after registration
      // router.push('/thanks');
    },
    onError: (error) => {
      console.error("Error creating shop:", error);

      // Extract and display specific error messages
      //@ts-ignore
      if (error.response?.data) {
      //@ts-ignore
        const errorDetails = error.response.data;

        if (errorDetails["Employee_email"]) {
          const message = errorDetails["Employee_email"][0];
          console.error("Error message:", message);

          // Show the error message in a toast
          toast.error(message);
        } else {
          // Fallback for unknown errors
          toast.error("An error occurred while creating the employee.");
        }
      } else {
        // Handle generic errors
        toast.error("Something went wrong. Please try again.");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries('/notification'); // Refetch queries
    },
  });

  return {
    registerEmployee,
    isModalVisible,    // Ensure we are returning this state
    setModalVisible,   // This allows you to modify modal visibility from other components
  };
};


export const useCreateNotificationMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(notificationClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      if (hasAccess(adminOnly, permissions)) {
        return router.push(`/notifications`);
      }
      router.push(Routes.dashboard);
    },

    onError: (error) => {
      console.error("Error creating shop:", error);

      // Extract and display specific error messages
      //@ts-ignore
      if (error.response?.data) {
      //@ts-ignore
        const errorDetails = error.response.data;

        if (errorDetails["Employee_email"]) {
          const message = errorDetails["Employee_email"][0];
          console.error("Error message:", message);

          // Show the error message in a toast
          toast.error(message);
        } else {
          // Fallback for unknown errors
          toast.error("An error occurred while creating the Notification.");
        }
      } else {
        // Handle generic errors
        toast.error("Something went wrong. Please try again.");
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFICATION);
    },
  });
};


export const useRegisterEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(notificationClient.register, {
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
      queryClient.invalidateQueries('/contact');
    },
  });
};
export const useDeleeteAllNotificationMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(notificationClient.deleteAll, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
       router.push(`/notifications`);
      // }
      toast.success('Employee Deleted Successfully!');
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('notification/deleteAll');
    },
  });
};

export const useUpdateNotificationMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(notificationClient.update, {
    onSuccess: async (data) => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
        toast.success(t('common:successfully-updated'));
       return router.push(`/notifications`);
      // }
      
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFICATION);
    },
  });
};
export const useDeleteNotificationMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(notificationClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      
      toast.success(t('Notification Deleted Successfully!'));
      return router.push(`/notifications`);
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.NOTIFICATION);
    },
  });
};



export const useNotificationQuery = ({ slug }: { slug: string }, options?: any) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.NOTIFICATION, { slug }],
    () => notificationClient.get({ slug }),
    options,
  );
};

export const useNotificationsQuery = (options: Partial<EmployeeQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EmployeePaginator, Error>(
    [API_ENDPOINTS.NOTIFICATION, options],
    ({ queryKey, pageParam }) =>
    notificationClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    notifications: data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};


