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
    const variantStyle =
        variant === 'contained' ? 'bg-starBlue' : 'bg-starBlue';

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
            <p className='typography-button6 text-white-80'>{children}</p>
        </Tag>
    );
};
