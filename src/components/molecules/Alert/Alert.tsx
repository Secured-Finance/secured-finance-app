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
}: {
    severity?: AlertSeverity;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    onClose?: () => void;
    localStorageKey?: string;
    localStorageValue?: string;
}) => {
    const value =
        typeof window !== 'undefined' && localStorageKey
            ? localStorage.getItem(localStorageKey)
            : undefined;

    const [isVisible, setIsVisible] = useState(
        value ? !(value === localStorageValue) : true
    );

    const iconClass = 'w-[13px] h-[13px] laptop:w-4 laptop:h-4';

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
                'flex w-full flex-row items-start justify-between gap-1 rounded-md border px-2.5 text-2xs text-neutral-50 laptop:text-xs',
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
                                iconClass,
                                'mt-[4px] laptop:mt-0.5'
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
                        <div className='leading-4 laptop:leading-5'>
                            {subtitle}
                        </div>
                    )}
                </div>
            </div>
            <button
                onClick={handleClose}
                className={clsx(
                    iconClass,
                    'mt-[3px] flex-shrink-0 laptop:mt-0.5',
                    buttonColorStyle[severity]
                )}
            >
                <XMarkIcon />
            </button>
        </section>
    );
};
