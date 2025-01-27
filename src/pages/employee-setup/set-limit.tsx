import React from 'react';
import Image from 'next/image';
import edit from '@/assets/placeholders/edit.svg';
import remove from '@/assets/placeholders/delete.svg';
import Link from 'next/link';
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

export default function SetLimit({ products }: ProductProps) {
    return (
        <>
        <form action="">
        <div className="grid grid-cols-4 gap-4 items-center mt-4 mb-4"> 
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                        Available Balance
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="$100 " />

                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                        Budget Expire Time Limit
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="date" placeholder=" " />

                      </div>
                    </div> 
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                        Assign Budget
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="$100 " />

                      </div>
                    </div>
                    <button className='p-2 bg-black rounded text-white w-[100px]'>Submit</button>
                    </div>
        </form>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                       
                        <th scope="col" className="py-3 px-6">Date</th>
                        <th scope="col" className="py-3 px-6">Assign Budget</th>
                        <th scope="col" className="py-3 px-6">Current Budget</th>
                        <th scope="col" className="py-3 px-6">P.O Number</th>
                        <th scope="col" className="py-3 px-6">Action</th> 
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                             
                            <td className="py-4 px-6">{product.inventoryId}</td>
                            <td className="py-4 px-6">{product.description}</td>
                            <td className="py-4 px-6"> 
                                {product.uom}
                                </td>
                            <td className="py-4 px-6">{product.quantity}</td> 
                            <td className="py-4 px-6">
                                <div className="flex gap-3">
                            <Link href='/ '>
              <Image
                src={edit} // Replace with your actual icon/image path
                alt="Edit"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
                className="cursor-pointer hover:text-blue-500"
              />
            </Link>
              {/* Transfer Ownership Action - Image/Icon with Tooltip */}
              <Image
                src={remove} // Replace with your actual icon/image path
                alt="Transfer Ownership"
                width={12} // Set the width for the icon
                height={12} // Set the height for the icon
              />
              </div>
                                </td> 
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    );
}
