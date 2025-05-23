import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useModalAction } from '@/components/ui/modal/modal.context';
import ContactCard from '@/components/ui/contact-card';
import { PlusIcon } from '@/components/icons/plus-icon';
import { useTranslation } from 'next-i18next';

interface ContactProps {
  contact: string | undefined;
  label: string;
  count?: number;
  className?: string;
}

const ContactGrid = ({ contact, label, count, className, contactNumber, setContactNumber }: ContactProps) => {
  const { openModal } = useModalAction();
  const { t } = useTranslation('common');

  useEffect(() => {
    if (contact) {
      setContactNumber(contact);
    }
  }, [contact, setContactNumber]);

  function onAddOrChange() {
    openModal('ADD_OR_UPDATE_CHECKOUT_CONTACT');
  }

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <div className="space-s-3 md:space-s-4 flex items-center w-[200px]">
          {count && (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-base text-light lg:text-xl">
              {count}
            </span>
          )}
          <p className="text-md capitalize text-heading font-bold">{label}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 w-[200px]">
        {Boolean(contactNumber) ? (
          <ContactCard
            checked={Boolean(contactNumber)}
            number={contactNumber}
          />
        ) : (
          <span className="relative rounded border border-border-200 bg-gray-100 px-5 py-6 text-center text-base">
            {t('text-no-contact')}
          </span>
        )}
      </div>
        <button
          className="flex items-center text-sm font-semibold text-accent transition-colors duration-200 hover:text-accent-hover focus:text-accent-hover focus:outline-none"
          onClick={onAddOrChange}
        >
          <PlusIcon className="me-0.5 h-4 w-4 stroke-2" />
          {contactNumber ? t('text-update') : t('text-add')}
        </button>
      </div>

    </div>
  );
};

export default ContactGrid;
