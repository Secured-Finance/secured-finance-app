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
            <div className='inset-0 flex items-center justify-center p-4'>
                <HeadlessDialog.Panel className='w-full max-w-md space-y-8 rounded-xl bg-secondary-500 p-10'>
                    <HeadlessDialog.Title className='w-full text-center text-3xl font-semibold leading-9 text-gray-50'>
                        {title}
                    </HeadlessDialog.Title>
                    <HeadlessDialog.Description className='w-full text-center text-base leading-normal text-white text-opacity-50'>
                        {description}
                    </HeadlessDialog.Description>
                    {children}
                    <Button size='sm' fullWidth onClick={onClick}>
                        {callToAction}
                    </Button>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
