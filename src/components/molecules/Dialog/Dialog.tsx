import { Dialog as HeadlessDialog } from '@headlessui/react';
import { Button } from 'src/components/atoms';
import { Closable } from 'src/components/templates';

export type DialogState = {
    isOpen: boolean;
    onClose: () => void;
    source?: string;
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
            <div className='fixed inset-0 bg-backgroundBlur backdrop-blur-sm' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <HeadlessDialog.Panel
                    className='h-screen w-full overflow-y-auto rounded-xl bg-universeBlue p-8 shadow-deep tablet:h-fit tablet:w-[408px]'
                    data-cy='modal'
                >
                    <Closable onClose={onClose}>
                        <div className='flex h-full w-full flex-col items-center justify-between space-y-6 tablet:h-fit tablet:justify-center'>
                            <div className='flex w-full flex-col space-y-6'>
                                <HeadlessDialog.Title className='typography-modal-title w-full text-center text-neutral-8 opacity-80'>
                                    {title}
                                </HeadlessDialog.Title>
                                {description ? (
                                    <HeadlessDialog.Description className='typography-body-2 w-full text-center text-white-50'>
                                        {description}
                                    </HeadlessDialog.Description>
                                ) : null}
                                {children}
                            </div>
                            <div className='w-full pb-12 tablet:pb-0'>
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
                        </div>
                    </Closable>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
