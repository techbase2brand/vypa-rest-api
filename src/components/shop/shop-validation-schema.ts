import * as yup from 'yup';
import { phoneRegExp, URLRegExp } from '@/utils/constants';

const currentDate = new Date();

export const shopValidationSchema = yup.object().shape({
  // logo: yup
  //   .mixed()
  //   .required('Logo is required')
  //   .test(
  //     'fileSize',
  //     'File size must be less than 5 MB',
  //     //@ts-ignore
  //     (value) => !value || (value[0]?.size <= 5 * 1024 * 1024) // Check file size (5 MB in bytes)
  //   ),
  // name: yup.string().required('Company name is required'),
  // address: yup.object().shape({
    // street_address: yup.string().required('Address is required'),
    // country: yup.string().required('Country is required'),
    // state: yup.string().required('State is required'),
    // city: yup.string().required('City is required'),
    // zip: yup
    //   .string()
    //   // .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format') // Example: US ZIP code format
    //   .required('ZIP code is required'),
  // }),
  // businessContactdetail: yup.object().shape({
  //   business_phone: yup
  //     .string()
  //     .matches(/^\d{9,15}$/, 'Business phone number must be between 9 and 15 digits')
  //     .required('Business phone number is required'),
  //   mobile: yup
  //     .string()
  //     .matches(/^\d{9,15}$/, 'Mobile number must be between 9 and 15 digits')
  //     .required('Mobile number is required'),
  //   // fax: yup
  //   //   .string().required('Mobile number is required'),
  //     // .nullable()
  //     // .matches(/^\d{9,15}$/, 'Fax number must be between 9 and 15 digits'),
  //   email: yup
  //     .string()
  //     .email('Invalid email format')
  //     .required('Email is required'),
  //   // website: yup
  //   //   .string()
  //   //   .url('Invalid website URL')
  //   //   .required('Website is required'),
  // }),

  // loginDetails: yup.object().shape({
    // // Username or Email
    // "username or email": yup
    //   .string()
    //   .required('Username or email is required')
    //   .test(
    //     'usernameOrEmail',
    //     'Enter a valid email or username',
    //     (value) =>
    //       /^[a-zA-Z0-9_]+$/.test(value) || // Valid username (alphanumeric with underscores)
    //       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) // Valid email format
    //   ),

    // Password
    // password: yup
    //   .string()
    //   .required('Password is required')
    //   .min(8, 'Password must be at least 8 characters'),

    // // Confirm Password
    // confirmpassword: yup
    //   .string()
    //   .required('Confirm password is required')
    //   .oneOf([yup.ref('password')], 'Passwords do not match'),
  // }),
  // balance: yup.object().shape({
  //   payment_info: yup.object().shape({
  //     email: yup
  //       .string()
  //       .required('form:error-account-holder-email-required')
  //       .typeError('form:error-email-string')
  //       .email('form:error-email-format'),
  //     name: yup.string().required('form:error-account-holder-name-required'),
  //     bank: yup.string().required('form:error-bank-name-required'),
  //     account: yup
  //       .number()
  //       .positive('form:error-account-number-positive-required')
  //       .integer('form:error-account-number-integer-required')
  //       .required('form:error-account-number-required')
  //       .transform((value) => (isNaN(value) ? undefined : value)),
  //   }),
  // }),
  // settings: yup.object().shape({
  //   contact: yup
  //     .string()
  //     .required('form:error-contact-number-required')
  //     .matches(phoneRegExp, 'form:error-contact-number-valid-required'),
  //   website: yup
  //     .string()
  //     .required('form:error-website-required')
  //     .matches(URLRegExp, 'form:error-url-valid-required'),
  //   socials: yup.array().of(
  //     yup.object().shape({
  //       url: yup.string().when('icon', (data) => {
  //         if (data) {
  //           return yup.string().required('form:error-url-required');
  //         }
  //         return yup.string().nullable();
  //       }),
  //     }),
  //   ),
  //   shopMaintenance: yup
  //     .object()
  //     .when('isShopUnderMaintenance', {
  //       is: (data: boolean) => data,
  //       then: () =>
  //         yup.object().shape({
  //           title: yup.string().required('Title is required'),
  //           description: yup.string().required('Description is required'),
  //           start: yup
  //             .date()
  //             .min(
  //               currentDate.toDateString(),
  //               `Maintenance start date  field must be later than ${currentDate.toDateString()}`,
  //             )
  //             .required('Start date is required'),
  //           until: yup
  //             .date()
  //             .required('Until date is required')
  //             .min(
  //               yup.ref('start'),
  //               'Until date must be greater than or equal to start date',
  //             ),
  //         }),
  //     })
  //     .notRequired(),
  // }),
});

export const approveShopSchema = yup.object().shape({
  admin_commission_rate: yup
    .number()
    .typeError('Commission rate must be a number')
    .required('You must need to set your commission rate'),
});