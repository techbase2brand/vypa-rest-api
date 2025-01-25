import Card from '@/components/common/card';
export default function AddressTab() {
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <form action="">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <div className='flex justify-between items-center'>
              <h2 className='font-bold text-xl mb-4'>Ship To Contact</h2>
              <label className='flex gap-3 items-center'>
                    <input className="accent-green w-6 h-6" type="checkbox" checked />
                    Override Contact
                  </label>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Account Name
                  </label> 
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin Gada " />
                   
                </div>
                </div>
              <div className="-mx-3 md:flex mb-6">

                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Attention
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin Gada  " />

                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Phone 1
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="+61452422805 " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Email
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin@0360.com.au " />
                </div>
              </div>
              <div className='flex justify-between items-center'>
              <h2 className='font-bold text-xl mb-4'>Ship To Address</h2>
              <label className='flex gap-3 items-center'>
                    <input className="accent-green w-6 h-6" type="checkbox" checked />
                    Override Contact
                  </label>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Address Line 1
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="71 Raven Street " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Address Line 2
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" Nr. AJ’s Indian Restaurent" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  City
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="West End" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Country
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="AU- AUSTRALIA " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  State
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="NSW - New South Wales" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Postal Code
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="4121" />
                </div>
              </div>
            </div>
            <div>
              <div className='flex justify-between items-center'>
              <h2 className='font-bold text-xl mb-4'>Bill To Contact</h2>
              <label className='flex gap-3 items-center'>
                    <input className="accent-green w-6 h-6" type="checkbox" checked />
                    Override Contact
                  </label>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Account Name
                  </label> 
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin Gada " />
                   
                </div>
                </div>
              <div className="-mx-3 md:flex mb-6">

                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Attention
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin Gada  " />

                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Phone 1
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="+61452422805 " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Email
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Kevin@0360.com.au " />
                </div>
              </div>
              <div className='flex justify-between items-center'>
              <h2 className='font-bold text-xl mb-4'>Bill To Address</h2>
              <label className='flex gap-3 items-center'>
                    <input className="accent-green w-6 h-6" type="checkbox" checked />
                    Override Contact
                  </label>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Address Line 1
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="71 Raven Street " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Address Line 2
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" Nr. AJ’s Indian Restaurent" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  City
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="West End" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Country
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="AU- AUSTRALIA " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  State
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="NSW - New South Wales" />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Postal Code
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="4121" />
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
