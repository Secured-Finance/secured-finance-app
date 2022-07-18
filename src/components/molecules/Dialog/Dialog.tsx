import { Dialog as HeadlessDialog } from '@headlessui/react';
import { Button, CloseButton } from 'src/components/atoms';

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
            <div className='fixed inset-0 bg-backgroundBlur' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <HeadlessDialog.Panel
                    className='w-96 rounded-xl bg-universeBlue p-6 pb-8 shadow-deep'
                    data-cy='modal'
                >
                    <div className='text-right'>
                        <CloseButton onClick={onClose} />
                    </div>
                    <div className='flex w-full flex-col items-center space-y-7'>
                        <HeadlessDialog.Title className='typography-modal-title w-full text-center text-white opacity-80'>
                            {title}
                        </HeadlessDialog.Title>
                        <HeadlessDialog.Description className='typography-body-2 w-full text-center text-white-50'>
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
                    </div>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
