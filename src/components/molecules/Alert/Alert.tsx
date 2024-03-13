import { XMarkIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { cloneElement, useState } from 'react';
import { alertIconMapping, severityStyle } from './constants';
import { AlertSeverity } from './types';

export const Alert = ({
    severity = AlertSeverity.Info,
    title,
    subtitle,
    onClose,
    localStorageKey,
    localStorageValue,
    showCloseButton = false,
}: {
    severity?: AlertSeverity;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    onClose?: () => void;
    localStorageKey?: string;
    localStorageValue?: string;
    showCloseButton: boolean;
}) => {
    const value =
        typeof window !== 'undefined' && localStorageKey
            ? localStorage.getItem(localStorageKey)
            : undefined;

    const [isVisible, setIsVisible] = useState(
        value ? !(value === localStorageValue) : true
    );

    const iconClass = clsx({
        'h-6 w-6': subtitle,
        'h-5 w-5': !subtitle,
    });

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

    return isVisible ? (
        <section
            aria-label={severity}
            role='alert'
            className={clsx(
                'flex w-full flex-row items-start justify-between gap-1 rounded-md border px-2.5 text-sm text-white light:text-neutral-900',
                severityStyle[severity],
                {
                    'py-1.5': !subtitle,
                    'py-2': subtitle,
                }
            )}
        >
            <div className='flex items-start gap-2 pr-4'>
                {alertIcon && (
                    <span>
                        {cloneElement(alertIcon, {
                            className: clsx(
                                alertIcon.props.className,
                                iconClass
                            ),
                        })}
                    </span>
                )}
                <div className='flex flex-col gap-1 leading-[1.57]'>
                    {title && (
                        <h2
                            className={clsx({
                                'text-base leading-normal': subtitle,
                            })}
                        >
                            {title}
                        </h2>
                    )}
                    {subtitle && <p>{subtitle}</p>}
                </div>
            </div>
            {showCloseButton && (
                <button
                    onClick={handleClose}
                    className='h-4 w-4 flex-shrink-0 text-neutral-200 light:text-neutral-500'
                >
                    <XMarkIcon />
                </button>
            )}
        </section>
    ) : null;
};
