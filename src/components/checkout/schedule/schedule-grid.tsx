import { RadioGroup } from '@headlessui/react';
import { useAtom } from 'jotai';
import ScheduleCard from './schedule-card';
import { deliveryTimeAtom } from '@/contexts/checkout';
import { useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useSettings } from '@/contexts/settings.context';

interface ScheduleProps {
  label: string;
  className?: string;
  count?: number;
}

export const ScheduleGrid: React.FC<ScheduleProps> = ({
  label,
  className,
  count,
}) => {
  const { t } = useTranslation('common');
  const { deliveryTime: schedules } = useSettings();

  const [selectedSchedule, setSchedule] = useAtom(deliveryTimeAtom);
  useEffect(() => {
    setSchedule(schedules[0]);
  }, []);
  return (
    <div className={className}>
      <div className="mb-5 flex items-center justify-between md:mb-8">
        <div className="space-s-3 md:space-s-4 flex items-center">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-lg capitalize text-heading lg:text-xl">{label}</p>
        </div>
      </div>

      {schedules && schedules?.length ? (
        <RadioGroup value={selectedSchedule} onChange={setSchedule}>
          <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {schedules?.map((schedule: any, idx: number) => (
              <RadioGroup.Option value={schedule} key={idx}>
                {({ checked }) => (
                  <ScheduleCard checked={checked} schedule={schedule} />
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('text-no-delivery-time-found')}
          </span>
        </div>
      )}

      <div className='payment_note flex gap-4 mt-4 w-full'>
        <div className='w-[50%]'>
         <label htmlFor="">Note</label>
         <textarea name="" id="" placeholder='Add a note for the cart' className='appearance-none mt-3 block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'></textarea>
        </div>
        <div className='choose_logo'>
          <label htmlFor="">Upload Logo</label>
          <input type="file" className='appearance-none block w-full mt-3 bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
        </div>
      </div>
    </div>
  );
};
export default ScheduleGrid;
