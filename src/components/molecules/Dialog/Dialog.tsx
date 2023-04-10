import { Dialog as HeadlessDialog } from '@headlessui/react';
import { Button, CloseButton } from 'src/components/atoms';

export type DialogState = {
    isOpen: boolean;
    onClose: () => void;
};
export const Dialog = ({
    title,
    description,
    callToAction,
    onClick,
    isOpen = true,
    onClose,
    children,
    disableActionButton,
}: {
    title: string;
    description: string;
    callToAction: string;
    onClick: () => void;
    children: JSX.Element;
    disableActionButton?: boolean;
} & DialogState) => {
    return (
        <HeadlessDialog
            open={isOpen}
            onClose={onClose}
            className='relative z-50'
        >
            <div className='fixed inset-0 bg-backgroundBlur' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <HeadlessDialog.Panel
                    className='w-[408px] rounded-xl bg-universeBlue p-8 shadow-deep'
                    data-cy='modal'
                >
                    <div className='flex justify-end'>
                        <CloseButton onClick={onClose} />
                    </div>
                    <div className='flex w-full flex-col items-center space-y-6'>
                        <HeadlessDialog.Title className='typography-modal-title w-full text-center text-neutral-8 opacity-80'>
                            {title}
                        </HeadlessDialog.Title>
                        {description ? (
                            <HeadlessDialog.Description className='typography-body-2 w-full text-center text-white-50'>
                                {description}
                            </HeadlessDialog.Description>
                        ) : null}
                        {children}
                        {callToAction ? (
                            <Button
                                size='sm'
                                fullWidth
                                onClick={onClick}
                                data-testid='dialog-action-button'
                                disabled={disableActionButton}
                            >
                                {callToAction}
                            </Button>
                        ) : (
                            <div className='h-10' />
                        )}
                    </div>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
