import Card from '@/components/common/card';
import Multiselect from 'multiselect-react-dropdown';

interface GeneralProps {
  activeTab: string;
}
export default function General({ activeTab }: GeneralProps) {
  return (
    <>
      <Card className="mb-8 flex flex-col">
        <form action="">
          {activeTab === "General" && (
            <div className="grid grid-cols-2 gap-20">
              <div>
                <div className='flex justify-between items-center'>
                  <h2 className='font-bold text-xl mb-4'>Contact</h2>

                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      First Name
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />

                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">

                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Last Name
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />

                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Account Name
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Job Title
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Email
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0 flex gap-2">
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Business 1</option>
                    </select>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0 flex gap-2">
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Call</option>
                    </select>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0 flex gap-2">
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Home</option>
                    </select>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0 flex gap-2">
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Fax</option>
                    </select>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Web
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                  </div>
                </div>

              </div>
              <div>
                <div className='flex justify-between items-center'>
                  <h2 className='font-bold text-xl mb-4'>Address</h2>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Address Line 1
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Address Line 2
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="  " />
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
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      City
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                  </div>
                </div>

                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      State
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="" />
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Postal Code
                    </label>
                    <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder="" />
                  </div>
                </div>
                <div className='flex justify-between items-center'>
                  <h2 className='font-bold text-xl mb-4'>Personal Data Privacy</h2>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Date Of conset
                    </label>
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Home</option>
                    </select>
                  </div>
                </div>
                <div className="-mx-3 md:flex mb-6">
                  <div className="md:w-full px-3 mb-6 md:mb-0">
                    <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                      Consent Expires
                    </label>
                    <select name="" id="" className='appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'>
                      <option value="">Home</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* shipping tab address form */}
          {activeTab === "Shipping Address" && (
            <>
              <div className='shipping'>
                <div className="flex items-center gap-4 mb-3">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="option"
                      value="Option 1"
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-gray-700">Home</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="option"
                      value="Option 2"
                      className="w-4 h-4 text-black bg-gray-100 border-gray-300 focus:ring-black focus:ring-2"
                    />
                    <span className="ml-2 text-gray-700">Office</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-20">
                  <div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          First Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />

                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          Last Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          Address
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
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          Email
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          City
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />

                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          State
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          Postal Code
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                      </div>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                      <div className="md:w-full px-3 mb-6 md:mb-0">
                        <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                          Phone No
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type" type="text" placeholder=" " />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {/* setting teb form */}
          {activeTab === "Setting" && (
          <div className="setting">
            <div className='flex justify-between items-center'>
              <h2 className='font-bold text-xl mb-4'>Time Base Purchase Limit</h2>
            </div>
            <div className="toogle__btn">
              <label htmlFor="" className='block mb-3'>Credit Card Option Visibility</label>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-20">
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                    Set Order Limit Based On
                  </label>
                  <select className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type">
                    <option value="">Category</option>
                  </select>

                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                    Time Duration
                  </label>
                  <div className='flex gap-4'>
                    <select className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type">
                      <option value="">Day</option>
                    </select>
                    <select className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type">
                      <option value="">Week</option>
                    </select>
                    <select className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="order-type">
                      <option value="">Month</option>
                    </select>
                  </div>

                </div>
              </div>

            </div>
            <h2 className='font-bold text-xl mb-4'>Category Visibility</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                    Category
                  </label> 
                  <Multiselect
                    placeholder="Select..."
                    displayValue="key"
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={function noRefCheck() { }}
                    onSearch={function noRefCheck() { }}
                    onSelect={function noRefCheck() { }}
                    options={[
                      {
                        cat: 'NSW Rail Clothing',
                        key: 'Color',
                      },
                      {
                        cat: 'VIC Rail Clothing',
                        key: 'Size',
                      },
                      {
                        cat: 'General Workwear',
                        key: 'Material',
                      },
                    ]}
                    showCheckbox
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Sub Category (optional)
                  </label> 
                  <Multiselect
                    placeholder="Select..."
                    displayValue="key"
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={function noRefCheck() { }}
                    onSearch={function noRefCheck() { }}
                    onSelect={function noRefCheck() { }}
                    options={[
                      {
                        cat: 'NSW Rail Clothing',
                        key: 'Color',
                      },
                      {
                        cat: 'VIC Rail Clothing',
                        key: 'Size',
                      },
                      {
                        cat: 'General Workwear',
                        key: 'Material',
                      },
                    ]}
                    showCheckbox
                  />
                </div>
              </div>
              <div className="-mx-3 md:flex mb-6">
                <div className="md:w-full px-3 mb-6 md:mb-0">
                  <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="order-type">
                  Product
                  </label> 
                  <Multiselect
                    placeholder="Select..."
                    displayValue="key"
                    onKeyPressFn={function noRefCheck() { }}
                    onRemove={function noRefCheck() { }}
                    onSearch={function noRefCheck() { }}
                    onSelect={function noRefCheck() { }}
                    options={[
                      {
                        cat: 'NSW Rail Clothing',
                        key: 'Color',
                      },
                      {
                        cat: 'VIC Rail Clothing',
                        key: 'Size',
                      },
                      {
                        cat: 'General Workwear',
                        key: 'Material',
                      },
                    ]}
                    showCheckbox
                  />
                </div>
              </div>
            </div>

          </div>
          )}

          <div>

          </div>
        </form>
      </Card>
    </>
  );
}
