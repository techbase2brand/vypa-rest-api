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
import { contactClient } from './client/contact';
import { useState } from 'react';

export const useApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(contactClient.approve, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};

export const useDisApproveEmployeeMutation = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  return useMutation(contactClient.disapprove, {
    onSuccess: () => {
      toast.success(t('common:successfully-updated'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};

export const useRegisterEmpMutation = () => {
  const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: registerEmployee } = useMutation(contactClient.register, {
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
      queryClient.invalidateQueries('/employee'); // Refetch queries
    },
  });

  return {
    registerEmployee,
    isModalVisible,    // Ensure we are returning this state
    setModalVisible,   // This allows you to modify modal visibility from other components
  };
};


export const useCreateContactMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(contactClient.create, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      toast.success('Contact us form submit successfully');
      if (hasAccess(adminOnly, permissions)) {
        // return router.push(`/`);
      }
      // router.push(Routes.dashboard);
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
          toast.error("An error occurred while creating the contact.");
        }
      } else {
        // Handle generic errors
        toast.error("Something went wrong. Please try again.");
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};
export const useRegisterEmployeeMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(contactClient.register, {
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
export const useDeleeteAllContactMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation(contactClient.deleteAll, {
    onSuccess: () => {
      const { permissions } = getAuthCredentials();
      // if (hasAccess(adminOnly, permissions)) {
       router.push(`/contact`);
      // }
      toast.success('Employee Deleted Successfully!');
      // router.push(Routes.dashboard);
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries('contact/deleteAll');
    },
  });
};

// export const useUpdateEmployeeMutation = () => {
//   const { t } = useTranslation();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   return useMutation(contactClient.update, {
//     onSuccess: async (data) => {
//       const { permissions } = getAuthCredentials();
//       // if (hasAccess(adminOnly, permissions)) {
//       //   // return router.push(`/employee`);
//       // }
//       toast.success(t('common:successfully-updated'));
//     },
//     onSettled: () => {
//       queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
//     },
//   });
// };
export const useDeleteContactMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(contactClient.delete, {
    onSuccess: async (data) => {
      // await router.push(`/${data?.slug}/edit`, undefined, {
      //   locale: Config.defaultLanguage,
      // });
      
      toast.success(t('Contact Deleted Successfully!'));
    },
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CONTACT);
    },
  });
};



export const useContactQuery = ({ slug }: { slug: string }, options?: any) => {
  return useQuery<Shop, Error>(
    [API_ENDPOINTS.CONTACT, { slug }],
    () => contactClient.get({ slug }),
    options,
  );
};

export const useContactsQuery = (options: Partial<EmployeeQueryOptions>) => {
  const { data, error, isLoading } = useQuery<EmployeePaginator, Error>(
    [API_ENDPOINTS.CONTACT, options],
    ({ queryKey, pageParam }) =>
    contactClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    contacts: data?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};


