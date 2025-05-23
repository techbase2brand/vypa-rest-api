import React from 'react';
import { IosArrowDown } from '@/components/icons/ios-arrow-down';
import { IosArrowUp } from '@/components/icons/ios-arrow-up';
import { useTranslation } from 'next-i18next';
import { StickerCardProps } from '@/types';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';

const StickerCard = ({
  titleTransKey,
  icon,
  color,
  price,
  indicator,
  indicatorText,
  note,
  link,
  linkText,
  iconClassName,
  //@ts-ignore
  company,
  //@ts-ignore
  employee,
  //@ts-ignore
  totalOrders,
  //@ts-ignore
  pendingOrders,
  //@ts-ignore
  processing,
  //@ts-ignore
  totalDeleverdOrder,
  //@ts-ignore
  totalEmployees,
}: StickerCardProps) => {
  const { t } = useTranslation('widgets');
  console.log("totalEmployees",totalOrders);
  
  return (
    <div
      className="flex h-full w-full flex-col rounded-lg border border-b-4 border-border-200 bg-light p-5 md:p-6"
      style={{ borderBottomColor: color }}
    >
      <div className="mb-auto flex w-full items-center justify-between">
        <div
          className={twMerge(
            classNames(
              'flex h-14 w-14 shrink-0 items-center justify-center me-3',
              iconClassName,
            ),
          )}
        >
          {icon}
        </div>
        <div className="flex w-full flex-col">
        <span className="mb-2 text-2xl font-semibold text-heading">
            {price ||
              company ||
              employee ||
              totalOrders ||
              pendingOrders ||
              processing ||
              totalDeleverdOrder || totalEmployees ||0}
          </span>
          <span className="mb-1 text-base font-normal text-body">
            {t(titleTransKey)}
          </span>
          {/* <span className="text-xs font-semibold text-body">
            {t(subtitleTransKey)}
          </span> */}
        
        </div>
      </div>

      {indicator === 'up' && (
        <span
          className="mb-12 inline-block text-sm font-semibold text-body"
          style={{ color: '#03D3B5' }}
        >
          <IosArrowUp width="9px" height="11px" className="inline-block" />{' '}
          {indicatorText}
          <span className="text-sm font-normal text-body"> {note}</span>
        </span>
      )}
      {indicator === 'down' && (
        <span
          className="mb-12 inline-block text-sm font-semibold text-body"
          style={{ color: '#FC6687' }}
        >
          <IosArrowDown width="9px" height="11px" className="inline-block" />{' '}
          {indicatorText}
          <span className="text-sm font-normal text-body"> {note}</span>
        </span>
      )}
      {link && (
        <a
          className="text-xs font-semibold text-purple-700 no-underline"
          href={link}
          target="_blank"
          rel="noreferrer"
        >
          {linkText}
        </a>
      )}
    </div>
  );
};

export default StickerCard;
