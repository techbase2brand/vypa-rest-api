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

export default function PurchaseHistory({ products }: ProductProps) {
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                       
                        <th scope="col" className="py-3 px-6">Order Date</th>
                        <th scope="col" className="py-3 px-6">Order Number</th>
                        <th scope="col" className="py-3 px-6">Items</th>
                        <th scope="col" className="py-3 px-6">Order Type</th>
                        <th scope="col" className="py-3 px-6">Order Status</th>
                        <th scope="col" className="py-3 px-6">Order Amt.</th> 
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                             
                            <td className="py-4 px-6">{product.inventoryId}</td>
                            <td className="py-4 px-6">{product.description}</td>
                            <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                            <img className='w-[60px]' src="https://res.cloudinary.com/smitdudhat/image/upload/v1672059540/Star%20Wars%20Theme%20Images/logo_h7lsnc.webp" alt="" />
                                {product.uom}
                                </div>
                                </td>
                            <td className="py-4 px-6">{product.quantity}</td>
                            <td className="py-4 px-6"> 
                            <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">Badge</span>
                            </td>
                            <td className="py-4 px-6">{product.employeeName}</td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
