// import { RadioGroup } from '@headlessui/react';
// import { useAtom } from 'jotai';
// import ScheduleCard from './schedule-card';
// import { deliveryTimeAtom } from '@/contexts/checkout';
// import { useEffect, useState } from 'react';
// import { useTranslation } from 'next-i18next';
// import { useSettings } from '@/contexts/settings.context';

// interface ScheduleProps {
//   label: string;
//   className?: string;
//   count?: number;
// }

// export const ScheduleGrid: React.FC<ScheduleProps> = ({
//   label,
//   className,
//   count,
// }) => {
//   const { t } = useTranslation('common');
//   const [selectedSchedule, setSchedule] = useAtom(deliveryTimeAtom);

//   const { deliveryTime: schedules } = useSettings();
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [fileType, setFileType] = useState('');
//   console.log("uploadedFileuploadedFile",uploadedFile);

// // @ts-ignore
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
// // @ts-ignore
//       setUploadedFile(URL.createObjectURL(file));
//       setFileType(file.type); // Store the file type (image, video, etc.)
//     }
//   };
//   useEffect(() => {
//     setSchedule(schedules[0]);
//   }, []);
//   return (
//     <div className={className}>
//       <div className="mb-5 flex items-center justify-between md:mb-8">
//         <div className="space-s-3 md:space-s-4 flex items-center">
//           {count && (
//             <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-base text-light lg:text-xl">
//               {count}
//             </span>
//           )}
//           <p className="text-lg capitalize text-heading lg:text-xl">{label}</p>
//         </div>
//       </div>

//       {schedules && schedules?.length ? (
//         <RadioGroup value={selectedSchedule} onChange={setSchedule}>
//           <RadioGroup.Label className="sr-only">{label}</RadioGroup.Label>
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
//             {schedules?.map((schedule: any, idx: number) => (
//               <RadioGroup.Option value={schedule} key={idx}>
//                 {({ checked }) => (
//                   <ScheduleCard checked={checked} schedule={schedule} />
//                 )}
//               </RadioGroup.Option>
//             ))}
//           </div>
//         </RadioGroup>
//       ) : (
//         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
//           <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
//             {t('text-no-delivery-time-found')}
//           </span>
//         </div>
//       )}

//       <div className='payment_note flex gap-4 mt-4 w-full'>
//         <div className='w-[50%]'>
//          <label htmlFor="">Note</label>
//          <textarea name="" id="" placeholder='Add a note for the cart' className='appearance-none mt-3 block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'></textarea>
//         </div>

//         {/* <div className='choose_logo'>
//           <label htmlFor="">Upload Logo</label>
//           <input type="file" className='appearance-none block w-full mt-3 bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500' />
//         </div> */}
//         <div className='choose_logo'>
//       <label>Upload Logo</label>
//       <input
//         type="file"
//         className='appearance-none block w-full mt-3 bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
//         onChange={handleFileChange}
//       />

//       {/* Check if the uploaded file is an image */}
//       {uploadedFile && fileType.startsWith('image') ? (
//         <img src={uploadedFile} alt="Uploaded Logo" style={{ width: '100px', height: '100px' }} />
//       ) : (
//         <div>{uploadedFile ? 'File uploaded is not an image' : 'No file uploaded'}</div>
//       )}
//     </div>
//       </div>
//     </div>
//   );
// };
// export default ScheduleGrid;

import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { deliveryTimeAtom } from '@/contexts/checkout';
import { useSettings } from '@/contexts/settings.context';
import { useTranslation } from 'next-i18next';
import { RadioGroup } from '@headlessui/react';
import ScheduleCard from './schedule-card';
import FileInput from '@/components/ui/file-input';
import Card from '@/components/common/card';
import { useForm } from 'react-hook-form';
import { FormValues } from '@/components/shop/approve-shop';

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
  const [selectedSchedule, setSchedule] = useAtom(deliveryTimeAtom);
  const { deliveryTime: schedules } = useSettings();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  console.log('selectedSchedule', selectedSchedule);

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    shouldUnregister: true,
  });
  //@ts-ignore
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // If a file is uploaded, set the uploaded file URL
      const fileURL = URL.createObjectURL(file);
      //@ts-ignore
      setUploadedFile(fileURL);
      setFileType(file.type); // Store the file type (image, video, etc.)

      // Assuming you want to include the image URL in the selected schedule:
      const updatedSchedule = { ...selectedSchedule, logo: fileURL };
      //@ts-ignore
      setSchedule(updatedSchedule); // Update the schedule with the new logo URL
    }
  };

  useEffect(() => {
    if (schedules && schedules.length) {
      // Example: Set the schedule initially with the static image URL
      const staticImageUrl =
        'https://stingray-app-mkueb.ondigitalocean.app/storage/2733/conversions/72_VypaBreezeNSWXBackRailPolo1-scaled-thumbnail.jpg';
      const updatedSchedule = { ...schedules[0], logo: staticImageUrl }; // Add the static image URL to the schedule
      setSchedule(updatedSchedule); // Update the schedule with the static image URL
    }
  }, [schedules, setSchedule]);

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

      <div className="payment_note flex gap-4 mt-4 w-full">
        <div className="w-[50%]">
          <label htmlFor="">Note</label>
          <textarea
            name=""
            id=""
            placeholder="Add a note for the cart"
            className="appearance-none mt-3 block w-full bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          ></textarea>
        </div>

        {/* <div className='choose_logo'>
          <label>Upload Logo</label>
          <input
            type="file"
            className='appearance-none block w-full mt-3 bg-white text-gray-700 text-xs border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500'
            onChange={handleFileChange}
          />

          {uploadedFile && fileType.startsWith('image') ? (
            <img src={uploadedFile} alt="Uploaded Logo" style={{ width: '100px', height: '100px' }} />
          ) : (
            <div>{uploadedFile ? 'File uploaded is not an image' : 'No file uploaded'}</div>
          )}
        </div> */}
        <form noValidate>
          <Card className="w-full rounded">
            <FileInput name="logo" control={control} multiple={false} />
          </Card>
        </form>
      </div>
    </div>
  );
};

export default ScheduleGrid;
