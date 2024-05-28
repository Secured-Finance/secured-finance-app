import { XMarkIcon } from '@heroicons/react/24/outline';

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className='flex h-5 w-5 items-center justify-center rounded-full border-[1.25px] border-neutral-3 hover:border-white-30 tablet:h-7 tablet:w-7 tablet:border-[1.75px]'
            onClick={onClick}
            data-testid='close-button'
            aria-label='Close'
        >
            <XMarkIcon className='h-[15px] w-[15px] text-neutral-8 tablet:h-[21px] tablet:w-[21px]' />
        </button>
    );
};
