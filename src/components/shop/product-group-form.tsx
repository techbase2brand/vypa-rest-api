import Card from '@/components/common/card';
import GooglePlacesAutocomplete from '@/components/form/google-places-autocomplete';
import { EditIcon } from '@/components/icons/edit';
import * as socialIcons from '@/components/icons/social';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import FileInput from '@/components/ui/file-input';
import Input from '@/components/ui/input';
import Label from '@/components/ui/label';
import SelectInput from '@/components/ui/select-input';
import SwitchInput from '@/components/ui/switch-input';
import TextArea from '@/components/ui/text-area';
import { Config } from '@/config';
import { useSettingsQuery } from '@/data/settings';
import { useCreateShopMutation, useUpdateShopMutation } from '@/data/shop';
import {
  BalanceInput,
  IImage,
  ItemProps,
  Shop,
  ShopSettings,
  ShopSocialInput,
  UserAddressInput,
  BusinessContactdetailInput,
  LoginDetailsInput,
  PrimaryContactdetailInput,
  Attachment,
} from '@/types';
import { getAuthCredentials } from '@/utils/auth-utils';
import { STAFF, STORE_OWNER, SUPER_ADMIN } from '@/utils/constants';
import { getFormattedImage } from '@/utils/get-formatted-image';
import { getIcon } from '@/utils/get-icon';
import { yupResolver } from '@hookform/resolvers/yup';
import { join, split } from 'lodash';
import omit from 'lodash/omit';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import OpenAIButton from '../openAI/openAI.button';
import { useAtom } from 'jotai';
import { locationAtom } from '@/utils/use-location';
import { useModalAction } from '../ui/modal/modal.context';
import { shopValidationSchema } from './shop-validation-schema';
import { formatSlug } from '@/utils/use-slug';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { socialIcon } from '@/settings/site.settings';
import { ShopDescriptionSuggestion } from '@/components/shop/shop-ai-prompt';
import PhoneNumberInput from '@/components/ui/phone-input';
import DatePicker from '@/components/ui/date-picker';
import { addDays, addMinutes, isSameDay, isToday } from 'date-fns';
import { useCreateEmployeeGroupMutation } from '@/data/employee-group';

export const updatedIcons = socialIcon.map((item: any) => {
  item.label = (
    <div className="flex items-center text-body space-s-4">
      <span className="flex items-center justify-center w-4 h-4">
        {getIcon({
          iconList: socialIcons,
          iconName: item.value,
          className: 'w-4 h-4',
        })}
      </span>
      <span>{item.label}</span>
    </div>
  );
  return item;
});

type FormValues = {
  name: string;
  gender?: string;
  password?: string;
  cover_image: any;
  logo: any;
  contact_no?: any;
  joining_date?: any;
  job_title?: string;
  tag?: string;
};

type Option = {
  id: number;
  name: string;
  isChecked: boolean;
};

const ProductGroupForm = ({ initialValues }: { initialValues?: Shop }) => {
  const [location] = useAtom(locationAtom);
  const { mutate: createGroup, isLoading: creating } =
    useCreateEmployeeGroupMutation();
  const { mutate: updateGroup, isLoading: updating } = useUpdateShopMutation();
  const [selection, setSelection] = useState<string>('Manual');
  const [checkboxOptions, setCheckboxOptions] = useState<Option[]>([
    { id: 1, name: 'David', isChecked: false },
    { id: 2, name: 'John Smith', isChecked: false },
    { id: 3, name: 'Olivia', isChecked: false },
    { id: 4, name: 'Faddi', isChecked: false },
    { id: 5, name: 'Lilly', isChecked: false },
    { id: 6, name: 'Jackson', isChecked: false },
  ]);

  const [tagCheckboxOptions, setTagCheckboxOptions] = useState<Option[]>([
    { id: 1, name: 'Clothes', isChecked: false },
    { id: 2, name: 'Women Clothes', isChecked: false },
    { id: 3, name: 'Railway Clothes', isChecked: false },
    { id: 4, name: 'VRL Clothes ', isChecked: false },
    { id: 5, name: 'Vypa', isChecked: false },
    { id: 6, name: 'Bisley', isChecked: false },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormValues>({
    shouldUnregister: true,
    ...(initialValues && {
      defaultValues: {
        ...initialValues,
        logo: getFormattedImage(initialValues?.logo as IImage),
        cover_image: getFormattedImage(initialValues?.cover_image as IImage),
      },
    }),
  });

  const handleCheckboxChange = (id: number) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.id === id ? { ...option, isChecked: !option.isChecked } : option,
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleRemoveName = (id: number) => {
    const updatedOptions = checkboxOptions.map((option) =>
      option.id === id ? { ...option, isChecked: false } : option,
    );
    setCheckboxOptions(updatedOptions);
  };

  const handleTagCheckboxChange = (id: number) => {
    const updatedOptions = tagCheckboxOptions.map((option) =>
      option.id === id ? { ...option, isChecked: !option.isChecked } : option,
    );
    setTagCheckboxOptions(updatedOptions);
  };

  const handleTagRemoveName = (id: number) => {
    const updatedOptions = tagCheckboxOptions.map((option) =>
      option.id === id ? { ...option, isChecked: false } : option,
    );
    setTagCheckboxOptions(updatedOptions);
  };

  const onSubmit = (values: FormValues) => {
    console.log('Form Values:', values);

    const selectedCheckboxes = checkboxOptions
      .filter((option) => option.isChecked)
      .map((option) => ({ id: option.id, name: option.name }));
    const selectedTagCheckboxes = tagCheckboxOptions
      .filter((option) => option.isChecked)
      .map((option) => ({ id: option.id, name: option.name }));

    // const payload = {
    //   ...values,
    //   tag: selection,
    //   selectedEmployess: selectedCheckboxes,
    //   selectedTags: selectedTagCheckboxes,
    // };
    const payload = {
      ...values,
      tag: selection,
      ...(selection === "Manual"
        ? { selectedEmployess: selectedCheckboxes }
        : { selectedTags: selectedTagCheckboxes }),
    };
    console.log('Payload to API:', payload);

    if (initialValues) {
      updateGroup({
        id: initialValues.id as string,
        ...payload,
      });
    } else {
      createGroup(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Group Name Input */}
      <div className="w-full mb-5">
        <Input
          label="Group Name"
          {...register('name')}
          variant="outline"
          placeholder="Enter group name"
          className="mb-2 w-full"
        />
      </div>
      {/* Group Type Selection */}
      <label className="flex text-body-dark font-semibold text-sm leading-none mb-3">
        Select Group Type
      </label>
      <div className="flex gap-4 mb-4">
        <label className="mb-1 flex gap-1 items-center">
          <input
            type="radio"
            name="selection"
            value="Manual"
            checked={selection === 'Manual'}
            onChange={() => setSelection('Manual')}
          />
          <span>Manual</span>
        </label>
        <label className="mb-1 flex gap-1 items-center">
          <input
            type="radio"
            name="selection"
            value="Tag Based"
            checked={selection === 'Tag Based'}
            onChange={() => setSelection('Tag Based')}
          />
          <span>Tag Based</span>
        </label>
      </div>

      {/* Conditional Content Area */}
      <div id="contentArea" className="mb-3">
        <label className="flex text-body-dark font-semibold text-sm leading-none">
          {selection === 'Manual'
            ? 'Select Employee for Group'
            : 'Select Tag for Group'}
        </label>
      </div>

      {selection == 'Manual' ? (
        <div>
          {/* Selected Employees Display */}
          <div className="flex gap-4 border p-2 mb-4 rounded">
            {checkboxOptions
              .filter((option) => option.isChecked)
              .map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {option.name}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveName(option.id);
                    }}
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                  >
                    X
                  </a>
                </span>
              ))}
          </div>

          {/* Employee Selection Checkboxes */}
          <div className="border p-3 rounded">
            {checkboxOptions.map((option) => (
              <label
                key={option.id}
                className="flex gap-1 items-center border-b pb-2 pt-2"
              >
                <input
                  type="checkbox"
                  checked={option.isChecked}
                  onChange={() => handleCheckboxChange(option.id)}
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 border p-2 mb-4 rounded">
            {tagCheckboxOptions
              .filter((option) => option.isChecked)
              .map((option) => (
                <span
                  key={option.id}
                  className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10"
                >
                  {option.name}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTagRemoveName(option.id);
                    }}
                    style={{ cursor: 'pointer', marginLeft: '5px' }}
                  >
                    X
                  </a>
                </span>
              ))}
          </div>
          {/* tag Selection Checkboxes */}
          <div className="border p-3 rounded">
            {tagCheckboxOptions.map((option) => (
              <label
                key={option.id}
                className="flex gap-1 items-center border-b pb-2 pt-2"
              >
                <input
                  type="checkbox"
                  checked={option.isChecked}
                  onChange={() => handleTagCheckboxChange(option.id)}
                />
                <span>{option.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      {/* Submit Button */}
      <div className="flex justify-between mt-8">
        <Button type="submit" loading={creating || updating}>
          {initialValues ? 'Update Group' : 'Create Group'}
        </Button>
      </div>
    </form>
  );
};

export default ProductGroupForm;
