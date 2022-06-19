import { XIcon } from '@heroicons/react/outline';

export const CloseButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <button
            className='h-8 w-8 rounded-full border-2 border-teal border-opacity-40'
            onClick={onClick}
            data-testid='close-button'
        >
            <XIcon className='h-6 w-6 pt-[3px] pl-1 text-white' />
        </button>
    );
};
