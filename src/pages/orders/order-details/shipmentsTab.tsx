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

export default function ShipmentTab({ products }: ProductProps) {
    return (
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                       
                        <th scope="col" className="py-3 px-6">Shipment Type</th>
                        <th scope="col" className="py-3 px-6">Document Nbr</th>
                        <th scope="col" className="py-3 px-6">Status</th>
                        <th scope="col" className="py-3 px-6">Shipment Date</th>
                        <th scope="col" className="py-3 px-6">Shipped Qty</th>
                        <th scope="col" className="py-3 px-6">Shipped Weight</th>
                        <th scope="col" className="py-3 px-6">Shipped Volume</th>
                        <th scope="col" className="py-3 px-6">Invoice type</th>
                        <th scope="col" className="py-3 px-6">Invoice Nbr.</th>
                        <th scope="col" className="py-3 px-6">Inventory Doc. Type</th>
                        <th scope="col" className="py-3 px-6">Inventory Ref Nbr.</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                             
                            <td className="py-4 px-6">{product.inventoryId}</td>
                            <td className="py-4 px-6">{product.description}</td>
                            <td className="py-4 px-6">{product.uom}</td>
                            <td className="py-4 px-6">{product.quantity}</td>
                            <td className="py-4 px-6">{product.unitPrice}</td>
                            <td className="py-4 px-6">{product.employeeName}</td>
                            <td className="py-4 px-6">{product.embroideryDetails}</td>
                            <td className="py-4 px-6">{product.frontLogo ? 'Yes' : 'No'}</td>
                            <td className="py-4 px-6">{product.rearLogo ? 'Yes' : 'No'}</td>
                            <td className="py-4 px-6">{product.name ? 'Yes' : 'No'}</td>
                            <td className="py-4 px-6">{product.name ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
