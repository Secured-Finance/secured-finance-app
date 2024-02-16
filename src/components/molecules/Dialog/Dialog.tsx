import { Dialog as HeadlessDialog } from '@headlessui/react';
import { useRef } from 'react';
import { Button } from 'src/components/atoms';
import { ButtonVariants } from 'src/components/atoms/Button/types';
import { ButtonSizes } from 'src/types';

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
    showCancelButton = false,
}: {
    title: string;
    description: string;
    callToAction: string;
    onClick: () => void;
    children: JSX.Element;
    disableActionButton?: boolean;
    showCancelButton?: boolean;
} & DialogState) => {
    const refDiv = useRef(null); // Dialog needs a focusable element. There are no focus elements in the dialog if its rendered without a button.

    return (
        <HeadlessDialog
            open={isOpen}
            onClose={onClose}
            className='relative z-30'
            initialFocus={refDiv}
        >
            <div className='fixed inset-0 bg-backgroundBlur backdrop-blur-sm' />
            <div className='fixed inset-0 flex items-center justify-center'>
                <HeadlessDialog.Panel
                    className='h-screen w-full overflow-y-auto rounded-xl bg-neutral-900 p-8 shadow-deep tablet:h-fit tablet:w-[408px]'
                    data-cy='modal'
                >
                    <div
                        ref={refDiv}
                        className='min-h-2/3 flex h-full w-full flex-col items-center justify-between space-y-6 tablet:h-fit tablet:justify-center'
                    >
                        <div className='flex w-full flex-col space-y-7 pt-2'>
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
                                <div className='grid w-full gap-4'>
                                    <Button
                                        size={ButtonSizes.sm}
                                        fullWidth
                                        onClick={onClick}
                                        data-testid='dialog-action-button'
                                        disabled={disableActionButton}
                                    >
                                        {callToAction}
                                    </Button>
                                    {showCancelButton && (
                                        <Button
                                            variant={ButtonVariants.tertiary}
                                            size={ButtonSizes.sm}
                                            fullWidth
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div className='h-10' />
                            )}
                        </div>
                    </div>
                </HeadlessDialog.Panel>
            </div>
        </HeadlessDialog>
    );
};
