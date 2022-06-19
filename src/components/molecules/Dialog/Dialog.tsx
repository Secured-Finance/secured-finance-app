import { Dialog as HeadlessDialog } from '@headlessui/react';
import { Button } from 'src/components/atoms';
import CloseButton from 'src/components/atoms/CloseButton';

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
                <HeadlessDialog.Panel className='w-full max-w-md space-y-8 rounded-xl bg-universeBlue p-10'>
                    <div className='-mb-7 flex items-center justify-end'>
                        <CloseButton onClick={onClose} />
                    </div>
                    <HeadlessDialog.Title className='w-full text-center font-secondary text-lg font-semibold text-white opacity-80'>
                        {title}
                    </HeadlessDialog.Title>
                    <HeadlessDialog.Description className='typography-body2 w-full text-center text-white-50'>
                        {description}
                    </HeadlessDialog.Description>
                    {children}
                    {callToAction ? (
                        <Button
                            size='sm'
                            fullWidth
                            onClick={onClick}
                            data-testid='dialog-action-button'
                        >
                            {callToAction}
                        </Button>
                    ) : null}
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
