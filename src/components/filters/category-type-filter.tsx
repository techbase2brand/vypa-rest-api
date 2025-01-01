import Label from '@/components/ui/label';
import Select from '@/components/ui/select/select';
import { useAuthorsQuery } from '@/data/author';
import { useCategoriesQuery } from '@/data/category';
import { useManufacturersQuery } from '@/data/manufacturer';
import { useTypesQuery } from '@/data/type';
import { ProductType } from '@/types';
import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button';
import { ActionMeta } from 'react-select';

type Props = {
  onCategoryFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onTypeFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onAuthorFilter?: (newValue: any, actionMeta: ActionMeta<unknown>) => void;
  onProductTypeFilter?: (
    newValue: any,
    actionMeta: ActionMeta<unknown>,
  ) => void;
  onManufactureFilter?: (
    newValue: any,
    actionMeta: ActionMeta<unknown>,
  ) => void;
  className?: string;
  type?: string;
  enableType?: boolean;
  enableCategory?: boolean;
  enableAuthor?: boolean;
  enableProductType?: boolean;
  enableManufacturer?: boolean;
};

export default function CategoryTypeFilter({
  onTypeFilter,
  onCategoryFilter,
  onAuthorFilter,
  onProductTypeFilter,
  className,
  type,
  enableType,
  enableCategory,
  enableAuthor,
  enableProductType,
  enableManufacturer,
  onManufactureFilter,
}: Props) {
  const { locale } = useRouter();
  const { t } = useTranslation();

  const { types, loading } = useTypesQuery({ language: locale });
  const { categories, loading: categoryLoading } = useCategoriesQuery({
    limit: 999,
    language: locale,
    type,
  });

  const { authors, loading: authorLoading } = useAuthorsQuery({
    limit: 999,
    language: locale,
  });

  const { manufacturers, loading: manufactureLoading } = useManufacturersQuery({
    limit: 999,
    language: locale,
  });

 

  return (
    <div
      className={cn(
        'flex w-full flex-col space-y-5 rtl:space-x-reverse md:flex-row md:items-end md:space-x-5 md:space-y-0',
        className,
      )}
    >
        {enableCategory ? (
        <div className="w-full">
          {/* <Label>Category</Label> */}
          <Select
            options={categories}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder='Category'
            isLoading={categoryLoading}
            onChange={onCategoryFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}
      
      {enableType ? (
        <div className="w-full">
          {/* <Label>{t('common:filter-by-group')}</Label> */}
          <Select
            options={types}
            isLoading={loading}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder='Price'
            onChange={onTypeFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )}

    
       <Button className='bg-black border border-black-600 text-white hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8'>Filter</Button>
       <Button className='bg-transprent border border-black-600 text-black hover:bg-transprint-700  hover:bg-white hover:text-black flex gap-2 text-sm  items-center pl-8 pr-8'>Reset</Button>
      {/* {enableAuthor ? (
        <div className="w-full">
          <Label>{t('common:filter-by-author')}</Label>
          <Select
            options={authors}
            getOptionLabel={(option: any) => option.name}
            getOptionValue={(option: any) => option.slug}
            placeholder={t('common:filter-by-author-placeholder')}
            isLoading={authorLoading}
            onChange={onAuthorFilter}
            isClearable={true}
          />
        </div>
      ) : (
        ''
      )} */}

    
 
    </div>
  );
}
