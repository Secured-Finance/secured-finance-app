import { XMarkIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { cloneElement } from 'react';
import {
    Toast,
    ToastClose,
    ToastDescription,
    ToastTitle,
    ToastViewport,
} from 'src/components/ui/toast';
import { snackbarIconMapping, variantStyle } from './constants';
import { SnackbarProps, SnackbarVariants } from './types';

export const Snackbar = ({
    title,
    message,
    variant = SnackbarVariants.Alert,
    duration = 5000,
    ...props
}: SnackbarProps) => {
    const icon = snackbarIconMapping[variant];

    return (
        <Toast
            className={clsx(
                'absolute left-4 right-4 top-3 inline-flex w-auto rounded-md border border-neutral-600 bg-neutral-700 py-2 pl-2.5 pr-2 text-neutral-50 tablet:left-auto tablet:w-[343px] laptop:right-6'
            )}
            duration={duration}
            {...props}
        >
            <div className='relative flex flex-1 flex-row items-start gap-1.5'>
                {icon &&
                    cloneElement(icon, {
                        className: clsx(
                            variantStyle[variant],
                            'mt-1 h-[15px] w-[15px] flex-shrink-0'
                        ),
                        ['data-testid']: 'snackbar-icon',
                    })}
                <div className='typography-mobile-body-5 flex flex-col pr-4'>
                    <ToastTitle className='laptop:typography-desktop-body-5 font-semibold'>
                        {title}
                    </ToastTitle>
                    <ToastDescription
                        asChild
                        className='laptop:typography-desktop-body-5'
                    >
                        <div>{message}</div>
                    </ToastDescription>
                </div>

                <ToastClose
                    className='absolute right-0 top-0'
                    data-testid='snackbar-close-btn'
                >
                    <XMarkIcon
                        className={clsx(
                            variantStyle[variant],
                            'h-[13px] w-[13px]'
                        )}
                    />
                </ToastClose>
            </div>
            <ToastViewport className='ToastViewport' />
        </Toast>
    );
};
