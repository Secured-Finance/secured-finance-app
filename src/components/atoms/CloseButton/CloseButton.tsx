import { XIcon } from '@heroicons/react/outline';

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className='h-8 w-8 rounded-full border-2 border-neutral'
            onClick={onClick}
            data-testid='close-button'
        >
            <XIcon className='h-7 w-7 pt-[3px] text-white' />
        </button>
    );
};
