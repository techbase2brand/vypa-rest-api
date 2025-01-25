import Card from '@/components/common/card';
export default function ShippingTab() {
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <form action="">
          <div className="grid grid-cols-2 gap-20">
            <div>
              <h2 className='font-bold text-xl mb-4'>Delivery Settings</h2>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                    Ship Via:
                  </label>
                  <div className="flex gap-5">
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="Local " />
                    <button className='p-2 pl-5 pr-5 bg-[#ccc] rounded'>Packages</button>
                  </div>
                  <label className='flex gap-3 items-center mt-4'>
                    <input className="accent-green w-6 h-6" type="checkbox" />
                    Will Call
                  </label>
                </div>
                </div>
              <div className="-mx-3 md:flex mb-6">

                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  FOB Point
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />

                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Priority
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Shipping Terms
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Shipping Zone
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Country
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
              </div>
              <label className='flex gap-3 items-center mb-3'>
                  <input className="accent-green w-6 h-6" type="checkbox" />
                  Residential Delivery
                </label>
                <label className='flex gap-3 items-center mb-3'>
                  <input className="accent-green  w-6 h-6" type="checkbox" />
                  Saturday Delivery
                </label>
                <label className='flex gap-3 items-center mb-3'>
                  <input className="accent-green w-6 h-6" type="checkbox" />
                  Insurance
                </label>
                <label className='flex gap-3 items-center'>
                  <input className="accent-green  w-6 h-6" type="checkbox" />
                  Use Customer’s Account
                </label>
            </div>
            <div>
              <h2 className='font-bold text-xl mb-4'>Order Shipping Settings</h2>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Sched. Shipment
                  </label>
                  <div className="flex items-center gap-4">
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="date" placeholder=" " />
                  <label className='flex gap-3 items-center'>
                  <input className="accent-green w-6 h-6" type="checkbox" />
                  Emailed
                </label>
                </div>
                </div>
                </div>
                <div className="-mx-3 md:flex mb-6"> 
                <div className="md:w-full px-3">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="customer">
                  Shipping Rule:
                  </label>
                  <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">test</option>
                      <option value="">test1</option>
                  </select>
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Cancel By:
                  </label>
                  <div className="flex items-center gap-4">
                  <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">test</option>
                      <option value="">test1</option>
                  </select>
                  <label className='flex gap-3 items-center'>
                  <input className="accent-green w-6 h-6" type="checkbox" />
                  Emailed
                </label>
                </div>
                </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Preferred Warehouse ID
                  </label> 
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Tracking ID
                  </label> 
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                </div>
                </div>
              <div className="text-right">
                <button className='p-2 pl-5 pr-5 bg-black text-white rounded'>Add</button>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
