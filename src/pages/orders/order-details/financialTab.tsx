import Card from '@/components/common/card'; 
import PageHeading from '@/components/common/page-heading';
export default function FinancialTab() {
  return (
    <>
      <Card className="mb-8 flex flex-col">
            <form action="">
        <div className="grid grid-cols-2 gap-4">
                <div>
                <h2 className='font-bold text-xl mb-4'>Financial Information</h2>
                <div className="-mx-3 md:flex mb-6">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
            Invoice Number
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" "/>
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Invoice Date
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div>
                </div>
                </div>
                <div>
                <h2 className='font-bold text-xl mb-4'>Other Information</h2>
                <div className="-mx-3 md:flex mb-6">
          <div className="md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
            Orig. Order Type
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" "/>
          </div>
          <div className="md:w-1/2 px-3">
            <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
            Orig. Order Nbr
            </label>
            <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="customer" type="text" placeholder=" "/>
          </div>
                </div>
                <div className="flex gap-5">
                <label className='flex gap-3 items-center'>
                <input className="accent-green w-6 h-6" type="checkbox" />
                Emailed
                </label>
                <label className='flex gap-3 items-center'>
                <input className="accent-green  w-6 h-6" type="checkbox" />
                Printed
                </label>
                </div>
                </div>
            </div>
            </form> 
      </Card> 
    </>
  );
}
 