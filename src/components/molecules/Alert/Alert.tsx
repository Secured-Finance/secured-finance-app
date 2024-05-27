import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { cloneElement, useState } from 'react';
import { alertIconMapping, buttonColorStyle, severityStyle } from './constants';
import { AlertSeverity } from './types';

export const Alert = ({
    severity = AlertSeverity.Info,
    title,
    subtitle,
    onClose,
    localStorageKey,
    localStorageValue,
    isShowCloseButton = true,
}: {
    severity?: AlertSeverity;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    onClose?: () => void;
    localStorageKey?: string;
    localStorageValue?: string;
    isShowCloseButton?: boolean;
}) => {
    const value =
        typeof window !== 'undefined' && localStorageKey
            ? localStorage.getItem(localStorageKey)
            : undefined;

    const [isVisible, setIsVisible] = useState(
        value ? !(value === localStorageValue) : true
    );

    const handleClose = () => {
        setIsVisible(false);
        if (localStorageKey && localStorageValue) {
            localStorage.setItem(localStorageKey, localStorageValue);
        }
        if (onClose) {
            onClose();
        }
    };

    const alertIcon = alertIconMapping[severity];

    if (!isVisible) return null;

    return (
        <section
            aria-label={severity}
            role='alert'
            className={clsx(
                'flex w-full flex-row items-start justify-between gap-2 rounded-md border pl-2.5 pr-2 text-neutral-50',
                severityStyle[severity],
                {
                    'py-1.5': !subtitle,
                    'py-2': subtitle,
                }
            )}
        >
            <div className='flex items-start gap-1.5 pr-4 laptop:gap-2'>
                {alertIcon && (
                    <span>
                        {cloneElement(alertIcon, {
                            className: clsx(
                                alertIcon.props.className,
                                'w-[14.775px] h-[14.775px] laptop:w-4 laptop:h-4',
                                {
                                    'mt-[2.5px] laptop:mt-0.5': !subtitle,
                                    'mt-[3px] laptop:mt-1': subtitle,
                                }
                            ),
                        })}
                    </span>
                )}
                <div className='flex flex-col'>
                    {title && (
                        <h2
                            className={clsx('text-xs leading-5', {
                                'laptop:text-sm laptop:leading-[22px]':
                                    subtitle,
                            })}
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && (
                        <div className='text-2xs leading-4 laptop:text-xs laptop:leading-5'>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            {isShowCloseButton && (
                <button
                    onClick={handleClose}
                    className={clsx(
                        buttonColorStyle[severity],
                        'h-[13px] w-[13px] flex-shrink-0 laptop:h-4 laptop:w-4',
                        {
                            'mt-[3px] laptop:mt-0.5': !subtitle,
                        }
                    )}
                    data-testid='close-button'
                >
                    <XMarkIcon />
                </button>
            )}
        </section>
    );
};
