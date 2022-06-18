import classNames from 'classnames';
import React from 'react';

export const Button = ({
    variant = 'contained',
    href, //do nothing
    size = 'sm',
    fullWidth = false,
    children,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        fullWidth?: boolean;
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
            ? 'bg-gradient-primary'
            : 'bg-primary-500 opacity-40';

    const Tag = href ? 'a' : 'button';
    const tagProps = href
        ? {
              href,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : props;

    return (
        <Tag
            {...tagProps}
            className={classNames(
                `${variantStyle} inline-flex h-button-${size} items-center justify-center rounded-xl px-6 py-4 ${props.className}`,
                fullWidth ? 'w-full' : `w-button-${size}`
            )}
        >
            <p className={`${textSize} tracking-wide text-white`}>{children}</p>
        </Tag>
    );
};
