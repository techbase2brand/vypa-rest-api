// import { useBackToTop } from '@/components/ui/back-to-top/back-to-top-context';
// import { Slot } from '@/utils/slot';
// import classNames from 'classnames';
// import React, { useEffect, useState } from 'react';
// import { twMerge } from 'tailwind-merge';

// export interface ButtonProps
//   extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   asChild?: boolean;
//   offset?: number;
// }

// const BackToTopButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
//   ({ className, asChild = false, offset = 100, ...props }, ref) => {
//     const Comp = asChild ? Slot : 'button';
//     const [showGoTop, setShowGoTop] = useState(false);

//     const handleVisibleButton = () => {
//       setShowGoTop(window?.scrollY > offset);
//     };

//     const handleScrollUp = () => {
//       window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
//     };

//     useEffect(() => {
//       window.addEventListener('scroll', handleVisibleButton);
//     }, []);

//     const { refs, strategy, x, y } = useBackToTop();

//     return (
//       <div
//         ref={refs.setFloating}
//         style={{
//           position: strategy,
//           top: y ?? '',
//           left: x ?? '',
//           zIndex: 1,
//         }}
//       >
//         <Comp
//           className={twMerge(
//             classNames(
//               'transition duration-300 transform',
//               className,
//               showGoTop ? 'opacity-100' : 'opacity-0',
//             ),
//           )}
//           ref={ref}
//           {...props}
//           onClick={handleScrollUp}
//         />
//       </div>
//     );
//   },
// );

// BackToTopButton.displayName = 'BackToTopButton';

// export { BackToTopButton };


import { useBackToTop } from '@/components/ui/back-to-top/back-to-top-context';
import { Slot } from '@/utils/slot';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  offset?: number;
  children?: React.ReactNode;
}


const BackToTopButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, offset = 100, children = 'Back to top', ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const [showGoTop, setShowGoTop] = useState(false);

    const handleVisibleButton = () => {
      setShowGoTop(window?.scrollY > offset);
    };

    const handleScrollUp = () => {
      window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
      // Add event listener for scroll
      window.addEventListener('scroll', handleVisibleButton);

      // Cleanup event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleVisibleButton);
      };
    }, [offset]);

    const { refs, strategy, x, y } = useBackToTop();

    return (
      <div
        ref={refs.setFloating}
        style={{
          position: strategy,
          top: y ?? '',
          left: x ?? '',
          zIndex: 1,
        }}
      >
        <Comp
          className={twMerge(
            classNames(
              'transition duration-300 transform fixed bottom-5 right-5',
              className,
              showGoTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
            ),
          )}
          ref={ref}
          {...props}
          onClick={handleScrollUp}
        >
          {children}
        </Comp>
      </div>
    );
  },
);

BackToTopButton.displayName = 'BackToTopButton';

export { BackToTopButton };

