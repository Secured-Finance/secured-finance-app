import { XMarkIcon } from '@heroicons/react/20/solid';
import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { cloneElement } from 'react';
import { snackbarIconMapping, variantStyle } from './constants';
import { SnackbarProps, SnackbarVariants } from './types';

export const Snackbar = ({
    title,
    message,
    variant = SnackbarVariants.Alert,
    open,
    handleOpen,
    duration = 5000,
}: SnackbarProps) => {
    const icon = snackbarIconMapping[variant];

    return (
        <Toast.Provider swipeDirection='right'>
            <Toast.Root
                className={clsx(
                    'inline-flex max-w-[343px] rounded-md border border-neutral-600 bg-neutral-700 py-2 pl-2.5 pr-2 text-neutral-50'
                )}
                open={open}
                onOpenChange={handleOpen}
                duration={duration}
            >
                <div className='relative flex flex-row items-start gap-1.5'>
                    {icon &&
                        cloneElement(icon, {
                            className: clsx(
                                variantStyle[variant],
                                'mt-1 h-[15px] w-[15px] flex-shrink-0'
                            ),
                        })}
                    <div className='typography-mobile-body-5 laptop:typography-desktop-body-4 flex flex-col pr-6'>
                        <Toast.Title className='font-semibold'>
                            {title}
                        </Toast.Title>
                        <Toast.Description asChild>
                            <div>{message}</div>
                        </Toast.Description>
                    </div>

                    <Toast.Close className='absolute right-0 top-0'>
                        <XMarkIcon
                            className={clsx(
                                variantStyle[variant],
                                'h-[13px] w-[13px]'
                            )}
                        />
                    </Toast.Close>
                </div>
            </Toast.Root>
            <Toast.Viewport className='ToastViewport' />
        </Toast.Provider>
    );
};
