// import Attribute from '@/components/ui/attribute';
// import Scrollbar from '@/components/ui/scrollbar';
// import { useAttributes } from './attributes.context';

// interface Props {
//   variations: any;
// }
// const VariationGroups: React.FC<Props> = ({ variations }) => {
//   const { attributes, setAttributes } = useAttributes();
//   const replaceHyphens = (str: string) => {
//     return str.replace(/-/g, ' ');
//   };
//   return (
//     <>
//       {Object.keys(variations).map((variationName, index) => (
//         <div
//           className="flex items-center border-b  border-border-200 border-opacity-70 py-4 first:pt-0 last:border-b-0 last:pb-0"
//           key={index}
//         >
//           <span className="me-4 inline-block min-w-[60px] whitespace-nowrap text-sm font-semibold capitalize leading-none text-heading">
//             {replaceHyphens(variationName)}:
//           </span>
//           <div className="-mb-5 w-full overflow-hidden">
//             <Scrollbar
//               className="w-full pb-5"
//               options={{
//                 scrollbars: {
//                   autoHide: 'never',
//                 },
//               }}
//             >
//               <div className="space-s-4 flex w-full">
//                 {variations[variationName].map((attribute: any) => (
//                   <Attribute
//                     className={variationName}
//                     color={attribute.meta ? attribute.meta : attribute?.value}
//                     active={attributes[variationName] === attribute.value}
//                     value={attribute.value}
//                     key={attribute.id}
//                     onClick={() =>
//                       setAttributes((prev: any) => ({
//                         ...prev,
//                         [variationName]: attribute.value,
//                       }))
//                     }
//                   />
//                 ))}
//               </div>
//             </Scrollbar>
//           </div>
//         </div>
//       ))}
//     </>
//   );
// };

// export default VariationGroups;

// import { useAttributes } from './attributes.context';

// interface Props {
//   variations: any;
// }
// const VariationGroups: React.FC<Props> = ({ variations }) => {
//   const { attributes, setAttributes } = useAttributes();

//   // Function to replace hyphens with spaces
//   const replaceHyphens = (str: string) => {
//     return str.replace(/-/g, ' ');
//   };

//   return (
//     <>
//       {Object.keys(variations).map((variationName, index) => (
//         <div
//           className="flex flex-col border-b border-border-200 border-opacity-70 py-4 first:pt-0 last:border-b-0 last:pb-0"
//           key={index}
//         >
//           <label
//             htmlFor={variationName}
//             className="mb-2 text-sm font-semibold capitalize leading-none text-heading"
//           >
//             {replaceHyphens(variationName)}:
//           </label>
//           <select
//             id={variationName}
//             className="w-full rounded border border-border-200 p-2 text-sm focus:outline-none focus:ring focus:ring-accent"
//             value={attributes[variationName] || ''}
//             onChange={(e) =>
//               setAttributes((prev: any) => ({
//                 ...prev,
//                 [variationName]: e.target.value,
//               }))
//             }
//           >
//             <option value="" disabled>
//               Select {replaceHyphens(variationName)}
//             </option>
//             {variations[variationName].map((attribute: any) => (
//               <option
//                 key={attribute.id}
//                 value={attribute.value}
//               >
//                 {attribute.meta ? attribute.meta : attribute.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       ))}
//     </>
//   );
// };

// export default VariationGroups;




// import { useAttributes } from './attributes.context';

// interface Props {
//   variations: any;
//   selectedColorOptions: any;
//   selectedSizeOptions: any;
// }

// const VariationGroups: React.FC<Props> = ({
//   variations,
//   selectedColorOptions,
//   selectedSizeOptions,
// }) => {
//   const { attributes, setAttributes } = useAttributes();

//   const replaceHyphens = (str: string) => {
//     return str.replace(/-/g, ' ');
//   };

//   return (
//     <div className="flex flex-row gap-4">
//       {Object.keys(variations).map((variationName, index) => (
//         <div
//           className="flex flex-col flex-1 border-b border-border-200 border-opacity-70 py-4 first:pt-0 last:border-b-0 last:pb-0"
//           key={index}
//         >
//           <label
//             htmlFor={variationName}
//             className="mb-2 text-sm font-semibold capitalize leading-none text-heading"
//           >
//             {replaceHyphens(variationName)}:
//           </label>
//           <select
//             id={variationName}
//             className="w-full rounded border border-border-200 p-2 text-sm focus:outline-none focus:ring focus:ring-accent"
//             value={attributes[variationName] || ''}
//             onChange={(e) =>
//               setAttributes((prev: any) => ({
//                 ...prev,
//                 [variationName]: e.target.value,
//               }))
//             }
//           >
//             <option value="" disabled>
//               Select {replaceHyphens(variationName)}
//             </option>
//             {variations[variationName].map((attribute: any) => (
//               <option key={attribute.id} value={attribute.value}>
//                 {attribute.meta ? attribute.meta : attribute.value}
//               </option>
//             ))}
//           </select>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default VariationGroups;




import { useEffect } from 'react';
import { useAttributes } from './attributes.context';

interface Props {
  variations: any;
  selectedColorOptions: any;
  selectedSizeOptions: any;
}

const VariationGroups: React.FC<Props> = ({
  variations,
  selectedColorOptions,
  selectedSizeOptions,
}) => {
  const { attributes, setAttributes } = useAttributes();

  const replaceHyphens = (str: string) => str.replace(/-/g, ' ');

  // Effect to set default selected attributes from props
  useEffect(() => {
    const defaultAttributes: any = {};

    if (selectedColorOptions) {
      defaultAttributes['color'] = selectedColorOptions;
    }
    if (selectedSizeOptions) {
      defaultAttributes['size'] = selectedSizeOptions;
    }

    setAttributes((prev: any) => ({ ...prev, ...defaultAttributes }));
  }, [selectedColorOptions, selectedSizeOptions, setAttributes]);

  return (
    <div className="flex flex-row gap-4">
      {Object.keys(variations).map((variationName, index) => {
        const selectedValue =
          attributes[variationName] || (variationName === 'color'
            ? selectedColorOptions
            : variationName === 'size'
            ? selectedSizeOptions
            : '');

        return (
          <div
            className="flex flex-col flex-1 border-b border-border-200 border-opacity-70 py-4 first:pt-0 last:border-b-0 last:pb-0"
            key={index}
          >
            <label
              htmlFor={variationName}
              className="mb-2 text-sm font-semibold capitalize leading-none text-heading"
            >
              {replaceHyphens(variationName)}:
            </label>
            <select
              id={variationName}
              className="w-full rounded border border-border-200 p-2 text-sm focus:outline-none focus:ring focus:ring-accent"
              value={selectedValue || ''}
              onChange={(e) =>
                setAttributes((prev: any) => ({
                  ...prev,
                  [variationName]: e.target.value,
                }))
              }
            >
              <option value="" disabled>
                Select {replaceHyphens(variationName)}
              </option>
              {variations[variationName].map((attribute: any) => (
                <option key={attribute.id} value={attribute.value}>
                  {attribute.meta ? attribute.meta : attribute.value}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default VariationGroups;
