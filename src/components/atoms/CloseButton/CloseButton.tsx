import { XIcon } from '@heroicons/react/outline';

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className='flex h-8 w-8 items-center justify-center rounded-full border-2 border-neutral-3 hover:border-white-30'
            onClick={onClick}
            data-testid='close-button'
            aria-label='Close'
        >
            <XIcon className='h-4 w-4 text-neutral-8' />
        </button>
    );
};
