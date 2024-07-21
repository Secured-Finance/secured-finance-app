import { XMarkIcon } from '@heroicons/react/20/solid';
import * as Toast from '@radix-ui/react-toast';
import clsx from 'clsx';
import { cloneElement, useRef, useState } from 'react';
import { snackbarIconMapping, variantStyle } from './constants';
import { SnackbarVariants } from './types';

export type SnackbarProps = {
    title: string;
    message: React.ReactNode;
    variant: SnackbarVariants;
};

export const Snackbar = ({
    title,
    message,
    variant = SnackbarVariants.Alert,
}: SnackbarProps) => {
    const [open, setOpen] = useState(false);
    const timerRef = useRef(0);

    const icon = snackbarIconMapping[variant];

    return (
        <Toast.Provider swipeDirection='right'>
            <button
                onClick={() => {
                    setOpen(false);
                    window.clearTimeout(timerRef.current);
                    timerRef.current = window.setTimeout(() => {
                        setOpen(true);
                    }, 100);
                }}
            >
                Open snackbar!
            </button>

            <Toast.Root
                className={clsx(
                    'inline-flex max-w-[343px] rounded-md border border-neutral-600 bg-neutral-700 py-2 pl-2.5 pr-2 text-neutral-50'
                )}
                open={open}
                onOpenChange={setOpen}
                duration={5000}
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

                    <button
                        className='absolute right-0 top-0'
                        onClick={() => {
                            setOpen(false);
                            window.clearTimeout(timerRef.current);
                        }}
                    >
                        <XMarkIcon
                            className={clsx(
                                variantStyle[variant],
                                'h-[13px] w-[13px]'
                            )}
                        />
                    </button>
                </div>
            </Toast.Root>
            <Toast.Viewport className='ToastViewport' />
        </Toast.Provider>
    );
};
