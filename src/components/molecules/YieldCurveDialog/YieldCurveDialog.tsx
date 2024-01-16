import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export const YieldCurveDialog = ({
    isOpen,
    onClose,
    children,
}: {
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element;
}) => {
    return (
        <Dialog open={isOpen} onClose={onClose} className='relative z-30'>
            <div className='fixed inset-0 bg-backgroundBlur backdrop-blur-sm' />
            <div className='fixed inset-0 flex items-center justify-center px-3'>
                <div className='w-full rounded-xl border border-[#2D4064] bg-universeBlue'>
                    <div className='flex w-full justify-between px-4 py-6'>
                        <h1 className='text-white'>Yield Curve</h1>
                        <button onClick={onClose}>
                            <XMarkIcon className='h-4 w-4 text-neutral-8' />
                        </button>
                    </div>
                    <Dialog.Panel
                        className='flex min-h-[339px] w-full items-end overflow-y-auto px-3 pb-6 shadow-deep tablet:h-fit tablet:w-fit'
                        data-cy='modal'
                    >
                        {children}
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
};
