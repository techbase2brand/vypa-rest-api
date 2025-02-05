// components/FilterAccordion.tsx
import { useState } from 'react';

interface FilterAccordionProps {
  title: string;
  children: React.ReactNode;
}

const FilterAccordion: React.FC<FilterAccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-gray-500 bg-[#e5e7eb]">
      <h2 className=" text-gray-800 font-semibold p-4 pt-2 pb-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className="float-right">{isOpen ? '-' : '+'}</span>
      </h2>
      {isOpen && <div className="p-4 pt-0">{children}</div>}
    </div>
  );
};

export default FilterAccordion;
