import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import CartCheckBagIcon from '@/components/icons/cart-check-bag';
import EmptyCartIcon from '@/components/icons/empty-cart';
import { CloseIcon } from '@/components/icons/close-icon';
import CartItem from '@/components/cart/item';
import { fadeInOut } from '@/utils/motion/fade-in-out';
import { formatString } from '@/utils/format-string';
import { useTranslation } from 'next-i18next';
import { useUI } from '@/contexts/ui.context';
import { Routes } from '@/config/routes';
import usePrice from '@/utils/use-price';
import { useCart } from '@/contexts/quick-cart/cart.context';
import { useState } from 'react';
import { useShopsQuery } from '@/data/shop';
import { getAuthCredentials } from '@/utils/auth-utils';
import { useEmployeesQuery } from '@/data/employee';
import { useMeQuery } from '@/data/user';
import { toast } from 'react-toastify';
import Button from '../ui/button';
import { useCreateAssignBudgetMutation } from '@/data/assign-budget';
// import { drawerAtom } from '@store/drawer-atom';

const Cart = () => {
  const { t } = useTranslation('common');
  const { role } = getAuthCredentials();
  const { data: me } = useMeQuery();
  const { items, totalUniqueItems, total } = useCart();
  const { price: totalPrice } = usePrice({
    amount: total,
  });
  const { mutate: createAssignBudget } = useCreateAssignBudgetMutation();
  const { closeCartSidebar } = useUI();
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCompanyLogo, setSelectedCompanyLogo] = useState(
    me?.shops?.[0]?.logo || null,
  );


  const [isOpen, setIsOpen] = useState(false);
  const [isShow, setIsShow] = useState(false);

  // const [_, closeSidebar] = useAtom(drawerAtom);
  const router = useRouter();
  //@ts-ignore
  const { employee } =
    role !== 'employee'
      ? useEmployeesQuery({
          //@ts-ignore
          limit: 100,
          //@ts-ignore
          shop_id: selectedCompany?.id || me?.shops?.[0]?.id,
        })
      : {};
  //@ts-ignore
  const { shops } =
    role !== 'employee'
      ? useShopsQuery({
          //@ts-ignore
          limit: 100,
        })
      : {};
  const onCompanyChange = (event: any) => {
    const selectedId = event?.target?.value;
    //@ts-ignore
    const company = shops?.find((shop) => shop?.id?.toString() == selectedId);
    setSelectedCompany(company);
    setSelectedCompanyLogo(company?.logo);
  };

  const handleCheckout = () => {
    // Check if all items have an employee selected
    if (role === 'company') {
      const itemsWithoutEmployee = items?.filter((item) => !item?.employee);
      if (itemsWithoutEmployee?.length > 0) {
        toast?.error('Please select an employee for all items');
        return;
      }
    }
    
    if (role == 'employee' || role == 'company') {
      const itemsWithoutEmployee = items?.filter((item) => !item?.employee);
      if (itemsWithoutEmployee?.length > 0) {
        toast?.error('Please select an employee for all items');
        return;
      }
      // Check if employees data is available
      // Validate all selected employees exist
      const selectedEmployeeIds = items.map((item) => item.employee);
      // const invalidEmployees = selectedEmployeeIds.filter(
      //   (id) => !employee.some((emp: any) => emp.id === id),
      // );
      // if (invalidEmployees.length > 0) {
      //   toast?.error(t('error.invalid-employees'));
      //   return;
      // }

      // Calculate total for each employee
      const employeeTotals = new Map<number, number>();
      items?.forEach((item) => {
        const empId = item?.employee;
        const currentTotal = employeeTotals.get(empId) || 0;
        employeeTotals.set(empId, currentTotal + item.itemTotal);
      });

      // Check wallet balances
      const insufficientEmployees: string[] = [];
      employeeTotals?.forEach((total, empId) => {
        const employees = employee?.find(
          (emp: any) => emp?.owner?.id === empId,
        );
        if (
          !employees ||
          !employees.wallet ||
          employees.wallet.available_points < total
        ) {
          insufficientEmployees?.push(
            employees?.name || t('text-unknown-employee'),
          );
        }
      });
      console.log(
        'insufficientEmployeesinsufficientEmployees',
        insufficientEmployees,
      );

      if (insufficientEmployees.length > 0) {
        toast?.error(
          `${t('Insufficient-Budget-')}: ${insufficientEmployees.join(', ')}`,
        );
        return;
      }
    } else {
      let shopIdCheck = items[0]?.shop_id;
      const hasInvalidEmployee = items.some(
        (item) => item.employee == '6' || item.employee == '',
      );
      if (!shopIdCheck) {
        toast?.error('Please Select Company Name');
        return false;
      } else if (hasInvalidEmployee) {
        toast?.error('Please Select Employee');
        return false;
      }

      // const missingEmployees = items.filter(item => !item?.employee);
      // if (missingEmployees.length > 0) {
      //   toast?.error('Please select an employee for all items');
      //   return false;
      // }
    }
    // return false;
    // All checks passed, proceed to checkout
    router.push(Routes.checkout);
  };

  // function handleEmployeeCheckout() {
  //   // const regularCheckout = items.find((item) => item.is_digital === false);
  //   // if (regularCheckout) {

  //   router.push(Routes.checkout);
  //   // } else {
  //   // router.push(ROUTES.CHECKOUT_DIGITAL);
  //   // }
  //   // closeSidebar({ display: false, view: '' });
  // }

  // const handleEmployeeCheckout = () => {
  //   //@ts-ignore
  //   if (!me?.wallet || (me?.wallet?.available_points ?? 0) < totalPrice) {
  //     toast.error('Insufficient wallet balance. Please request a budget.');
  //     setIsShow(true); // Open modal if wallet balance is low
  //   } else {
  //     router.push(Routes.checkout);
  //   }
  // };
  const handleEmployeeCheckout = () => {
    //@ts-ignore
    if (
      //@ts-ignore
      !me?.wallet ||
      //@ts-ignore
      me.wallet.available_points < totalPrice ||
      //@ts-ignore
      me.wallet.available_points === 0
    ) {
      toast.error('Insufficient wallet balance. Please request a budget.');
      setIsShow(true);
    } else {
      router.push(Routes.checkout);
    }
  };

  const handleAssignBudget = () => {
    let payload = {};
    //@ts-ignore
    if (!me?.wallet || me?.wallet?.available_points == 0) {
      payload = {
        //@ts-ignore
        employee_id: me?.id,
        //@ts-ignore
        employee_name: me?.name,
        assign_budget: totalPrice,
      };
      //@ts-ignore
    } else if (me?.wallet?.available_points >= totalPrice) {
      payload = {
        //@ts-ignore
        employee_id: me?.id,
        //@ts-ignore
        employee_name: me?.name,
        //@ts-ignore
        assign_budget: me?.wallet?.available_points - totalPrice,
      };
    } else {
      console.log('Not enough points to assign budget.');
      return;
    }
    console.log('Payload:::', payload);
    createAssignBudget({
      //@ts-ignore
      payload,
    });
    setIsOpen(false)
    // window.location.reload()
  };

  async function handleExportOrder() {
    // const a = document.createElement('a');
    // console.log("aaaaaaaa",a);
    //@ts-ignore
    const a = document.createElement('a'); // Create an anchor element
    console.log('Anchor element created::', a);
    a.href = 'https://www.fb.com';
    a.target = '_blank'; // Open in a new tab (optional)
    a.rel = 'noopener noreferrer'; // Security best practice
    document.body.appendChild(a); // Append to DOM (some browsers require it)
    a.click(); // Trigger click
    document.body.removeChild(a);
    // a.href = "http://localhost:3002/orders";
    // a.setAttribute('open', 'export-order');
    // a.click();
  }
  return (
    <section className="relative flex h-full flex-col bg-white">
      <header className="fixed top-0 z-10 flex h-16 w-full max-w-md items-center justify-between border-b border-border-200 border-opacity-75 bg-light px-6">
        <div className="flex font-semibold text-accent">
          <CartCheckBagIcon className="flex-shrink-0" width={24} height={22} />
          <span className="flex ms-2">
            {formatString(totalUniqueItems, t('text-item'))}
          </span>
        </div>
        <button
          onClick={closeCartSidebar}
          className="-me-2 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-muted transition-all duration-200 ms-3 hover:bg-accent hover:text-light focus:bg-accent focus:text-light focus:outline-none"
        >
          <span className="sr-only">{t('text-close')}</span>
          <CloseIcon className="h-3 w-3" />
        </button>
      </header>
      {/* <div className="flex justify-end mt-4">
        <Button onClick={handleExportOrder}>Check Event</Button>
      </div> */}
      {/* End of cart header */}
      {role == 'employee' && isShow && (
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsOpen(true)}>
            {' '}
            Request to assign budget
          </Button>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              X
            </button>

            <h2 className="text-lg font-semibold mb-4">Select an Option</h2>

            <div className="flex justify-between gap-4">
              <Button className="w-1/2" onClick={handleAssignBudget}>
                Budget
              </Button>
              <Button
                className="w-1/2"
                onClick={() => alert('Add Card Clicked')}
              >
                Add Card
              </Button>
            </div>
          </div>
        </div>
      )}
      <motion.div layout className="flex-grow pb-20">
        {items?.length > 0 ? (
          //@ts-ignore
          items?.map((item) => (
            //@ts-ignore
            <CartItem
              item={item}
              key={item?.id}
              //@ts-ignore
              selectedCompany={selectedCompany} // Pass the selected company to all cards
              onCompanyChange={onCompanyChange}
              //@ts-ignore
              selectedCompanyLogo={selectedCompanyLogo}
            />
          ))
        ) : (
          <motion.div
            layout
            initial="from"
            animate="to"
            exit="from"
            variants={fadeInOut(0.25)}
            className="flex h-full flex-col items-center justify-center"
          >
            <EmptyCartIcon width={140} height={176} />
            <h4 className="mt-6 text-base font-semibold">
              {t('text-no-products')}
            </h4>
          </motion.div>
        )}
      </motion.div>
      {/* End of cart items */}
      <footer className="fixed bottom-0 z-10 w-full max-w-md bg-light px-6 py-5">
        <button
          className="shadow-700 flex h-12 w-full justify-between rounded-full bg-accent p-1 text-sm font-bold transition-colors hover:bg-accent-hover focus:bg-accent-hover focus:outline-none md:h-14"
          onClick={role == 'employee' ? handleEmployeeCheckout : handleCheckout}
        >
          <span className="flex h-full flex-1 items-center px-5 text-light">
            {t('text-checkout')}
          </span>
          <span className="flex h-full flex-shrink-0 items-center rounded-full bg-light px-5 text-accent">
            {totalPrice}
          </span>
        </button>
      </footer>
      {/* End of footer */}
    </section>
  );
};

export default Cart;
