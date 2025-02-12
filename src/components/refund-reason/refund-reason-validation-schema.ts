import * as yup from 'yup';

export const refundReasonValidationSchema = yup.object().shape({
  name: yup.string().required('Customer Name is required'),
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  invoice_number: yup.string().required('Invoice Number is required'),
  goods_issue: yup.string().required('Goods Issue is required'),
  comment: yup.string().required('Comments are required'),
});
