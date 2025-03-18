import RCPagination, { PaginationProps } from 'rc-pagination';
import { ArrowNext } from '@/components/icons/arrow-next';
import { ArrowPrev } from '@/components/icons/arrow-prev';
import 'rc-pagination/assets/index.css';
import locale from 'rc-pagination/es/locale/en_US';

const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <RCPagination
      locale={locale}
      nextIcon={<ArrowNext />}
      prevIcon={<ArrowPrev />}
      {...props}
    />
  );
};

export default Pagination;
