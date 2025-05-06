import React from 'react';

interface Product {
  inventoryId: string;
  description: string;
  uom: string; // Unit of Measure
  quantity: number;
  unitPrice: number;
  employeeName: string;
  embroideryDetails: string;
  frontLogo: boolean;
  rearLogo: boolean;
  name: boolean;
}

interface ProductProps {
  products: Product[];
}

export default function Product({ products }: ProductProps) {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_10_4380)">
                  <path
                    d="M8.33594 10.8333C8.69381 11.3118 9.1504 11.7077 9.67473 11.9941C10.1991 12.2806 10.7789 12.4509 11.3748 12.4936C11.9708 12.5363 12.5689 12.4503 13.1287 12.2415C13.6885 12.0327 14.1969 11.7059 14.6193 11.2833L17.1193 8.78335C17.8783 7.9975 18.2982 6.94499 18.2887 5.85251C18.2793 4.76002 17.841 3.71497 17.0685 2.94243C16.296 2.1699 15.2509 1.7317 14.1584 1.7222C13.066 1.71271 12.0134 2.13269 11.2276 2.89168L9.79427 4.31668"
                    stroke="#141414"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.6639 9.16665C11.306 8.68821 10.8494 8.29233 10.3251 8.00587C9.80078 7.7194 9.22098 7.54905 8.62503 7.50637C8.02908 7.46369 7.43091 7.54968 6.87112 7.7585C6.31132 7.96732 5.80298 8.29409 5.38057 8.71665L2.88057 11.2167C2.12158 12.0025 1.7016 13.055 1.7111 14.1475C1.72059 15.24 2.15879 16.285 2.93133 17.0576C3.70386 17.8301 4.74891 18.2683 5.8414 18.2778C6.93389 18.2873 7.98639 17.8673 8.77224 17.1083L10.1972 15.6833"
                    stroke="#141414"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10_4380">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </th>
            <th scope="col" className="py-3 px-6">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_10_4371)">
                  <path
                    d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
                    stroke="#141414"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.16406 12.5H3.33073C2.8887 12.5 2.46478 12.3244 2.15222 12.0119C1.83966 11.6993 1.66406 11.2754 1.66406 10.8334V3.33335C1.66406 2.89133 1.83966 2.4674 2.15222 2.15484C2.46478 1.84228 2.8887 1.66669 3.33073 1.66669H10.8307C11.2728 1.66669 11.6967 1.84228 12.0092 2.15484C12.3218 2.4674 12.4974 2.89133 12.4974 3.33335V4.16669"
                    stroke="#141414"
                    stroke-width="1.66667"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_10_4371">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </th>
            <th scope="col" className="py-3 px-6">
              Inventory ID
            </th>
            <th scope="col" className="py-3 px-6">
              Line Description
            </th>
            <th scope="col" className="py-3 px-6">
              UOM
            </th>
            <th scope="col" className="py-3 px-6">
              Quantity
            </th>
            <th scope="col" className="py-3 px-6">
              Unit Price
            </th>
            <th scope="col" className="py-3 px-6">
              Employee Name
            </th>
            <th scope="col" className="py-3 px-6">
              Embroidery Details
            </th>
            <th scope="col" className="py-3 px-6">
              Front Logo
            </th>
            <th scope="col" className="py-3 px-6">
              Rear Logo
            </th>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <td className="py-4 px-6">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_10_4380)">
                    <path
                      d="M8.33594 10.8333C8.69381 11.3118 9.1504 11.7077 9.67473 11.9941C10.1991 12.2806 10.7789 12.4509 11.3748 12.4936C11.9708 12.5363 12.5689 12.4503 13.1287 12.2415C13.6885 12.0327 14.1969 11.7059 14.6193 11.2833L17.1193 8.78335C17.8783 7.9975 18.2982 6.94499 18.2887 5.85251C18.2793 4.76002 17.841 3.71497 17.0685 2.94243C16.296 2.1699 15.2509 1.7317 14.1584 1.7222C13.066 1.71271 12.0134 2.13269 11.2276 2.89168L9.79427 4.31668"
                      stroke="#141414"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.6639 9.16665C11.306 8.68821 10.8494 8.29233 10.3251 8.00587C9.80078 7.7194 9.22098 7.54905 8.62503 7.50637C8.02908 7.46369 7.43091 7.54968 6.87112 7.7585C6.31132 7.96732 5.80298 8.29409 5.38057 8.71665L2.88057 11.2167C2.12158 12.0025 1.7016 13.055 1.7111 14.1475C1.72059 15.24 2.15879 16.285 2.93133 17.0576C3.70386 17.8301 4.74891 18.2683 5.8414 18.2778C6.93389 18.2873 7.98639 17.8673 8.77224 17.1083L10.1972 15.6833"
                      stroke="#141414"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_4380">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </td>
              <td className="py-4 px-6">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_10_4371)">
                    <path
                      d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
                      stroke="#141414"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.16406 12.5H3.33073C2.8887 12.5 2.46478 12.3244 2.15222 12.0119C1.83966 11.6993 1.66406 11.2754 1.66406 10.8334V3.33335C1.66406 2.89133 1.83966 2.4674 2.15222 2.15484C2.46478 1.84228 2.8887 1.66669 3.33073 1.66669H10.8307C11.2728 1.66669 11.6967 1.84228 12.0092 2.15484C12.3218 2.4674 12.4974 2.89133 12.4974 3.33335V4.16669"
                      stroke="#141414"
                      stroke-width="1.66667"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_10_4371">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </td>
              <td className="py-4 px-6">
                {/* @ts-ignore */}
                {product?.variation_options?.[0]?.id}
                
              </td>
              <td className="py-4 px-6">{product?.name}</td>
              <td className="py-4 px-6">{product?.uom}</td>
              {/* @ts-ignore */}
              <td className="py-4 px-6">{product?.sold_quantity}</td>
              {/* @ts-ignore */}
              <td className="py-4 px-6">{product?.pivot?.unit_price}</td>
              <td className="py-4 px-6">{product.employeeName}</td>
              {/* @ts-ignore */}
              <td className="py-4 px-6">{product?.pivot?.employee_details}</td>
              <td className="py-4 px-6">
                {/* @ts-ignore */}
                {product?.pivot?.selectlogo?.some(
                  //@ts-ignore
                  (item) => item?.name === 'Front Logo',
                )
                  ? 'Yes'
                  : 'No'}
              </td>
              <td className="py-4 px-6">
                {/* @ts-ignore */}
                {product?.pivot?.selectlogo?.some(
                  //@ts-ignore
                  (item) => item?.name === 'Rear Logo',
                )
                  ? 'Yes'
                  : 'No'}
              </td>
              <td className="py-4 px-6">
                {/* @ts-ignore */}
                {product?.pivot?.selectlogo?.some(
                  //@ts-ignore
                  (item) => item?.name === 'Name',
                )
                  ? 'Yes'
                  : 'No'}
              </td>
              {/* <td className="py-4 px-6">{product.frontLogo ? 'Yes' : 'No'}</td>
                            <td className="py-4 px-6">{product.rearLogo ? 'Yes' : 'No'}</td>
                            <td className="py-4 px-6">{product.name ? 'Yes' : 'No'}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
