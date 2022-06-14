import React from 'react';

export const Button = ({
    variant = 'contained',
    href, //do nothing
    size = 'sm',
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: string;
    variant?: 'contained' | 'outlined';
    size?: 'xs' | 'sm' | 'md' | 'lg';
}) => {
    const textSize =
        size === 'xs' || size === 'sm'
            ? 'text-base leading-normal'
            : 'text-lg font-semibold leading-7';

    const variantStyle =
        variant === 'contained'
            ? 'bg-gradient-to-l from-primary-500 to-primary-600'
            : 'bg-primary-500 opacity-40';

    if (href) {
        return (
            <a
                href={href}
                target='_blank'
                rel='noreferrer'
                className={`${variantStyle}  w-button-${size} inline-flex h-button-${size} items-center justify-center rounded-xl px-6 py-4 ${props.className}`}
            >
                <p className={`${textSize} tracking-wide text-white`}>
                    {children}
                </p>
            </a>
        );
    }
    return (
        <button
            {...props}
            className={`${variantStyle}  w-button-${size} inline-flex h-button-${size} items-center justify-center rounded-xl px-6 py-4 ${props.className}`}
        >
            <p className={`${textSize} tracking-wide text-white`}>{children}</p>
        </button>
    );
};
