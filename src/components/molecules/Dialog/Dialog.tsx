import { Dialog as HeadlessDialog } from '@headlessui/react';
import { Button } from 'src/components/atoms';

export const Dialog = ({
    title,
    description,
    callToAction,
    onClick,
    isOpen = true,
    onClose,
    children,
}: {
    title: string;
    description: string;
    callToAction: string;
    onClick: () => void;
    isOpen: boolean;
    onClose: () => void;
    children: JSX.Element;
}) => {
    return (
        <HeadlessDialog
            open={isOpen}
            onClose={onClose}
            className='relative z-50'
        >
            <div className='fixed inset-0 flex items-center justify-center p-4'>
                <HeadlessDialog.Panel className='w-full max-w-sm rounded-xl bg-secondary-500 p-10'>
                    <HeadlessDialog.Title className='p-4 text-center text-2xl text-white'>
                        {title}
                    </HeadlessDialog.Title>
                    <HeadlessDialog.Description className='pb-8 text-center text-base text-gray-400'>
                        {description}
                    </HeadlessDialog.Description>
                    {children}
                    <div className='pt-8'>
                        <Button size='md' onClick={onClick}>
                            {callToAction}
                        </Button>
                    </div>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
