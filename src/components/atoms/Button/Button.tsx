import classNames from 'classnames';
import { SvgIcon } from 'src/types';

export const Button = ({
    href, //do nothing
    size = 'md',
    fullWidth = false,
    children,
    StartIcon,
    EndIcon,
    variant = 'solid',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        fullWidth?: boolean;
        href?: string;
        size?: 'sm' | 'md';
        variant?: 'solid' | 'outlined';
    } & {
        StartIcon?: SvgIcon;
        EndIcon?: SvgIcon;
    }) => {
    const Tag = href ? 'a' : 'button';
    const tagProps = href
        ? {
              href,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : props;

    const label = typeof children === 'string' ? children : 'Button';

    return (
        <Tag
            {...tagProps}
            aria-label={label}
            className={classNames(
                `flex items-center justify-center rounded-xl ${props?.className}`,
                {
                    'h-10 px-4 py-3': size === 'sm',
                    'h-12 px-6 py-4': size === 'md',
                    'w-full': fullWidth,
                    'w-fit': !fullWidth,
                    'enabled:border-2 enabled:border-slateGray enabled:text-neutral-8 enabled:hover:border-none enabled:hover:bg-neutral-8 enabled:hover:text-neutral-2 disabled:bg-neutral-8 disabled:text-neutral-2':
                        variant === 'outlined',
                    'bg-starBlue text-neutral-8 enabled:hover:bg-gradient-to-t enabled:hover:from-black-20 enabled:hover:via-black-20 enabled:hover:to-starBlue disabled:bg-gradient-to-t disabled:from-black/25 disabled:via-black/25 disabled:to-starBlue disabled:opacity-50':
                        variant === 'solid',
                }
            )}
        >
            {StartIcon && (
                <span className='mr-3'>
                    <StartIcon className='h-4 text-white' role='img' />
                </span>
            )}
            <p
                className={classNames('whitespace-nowrap', {
                    'typography-button-2': size === 'sm',
                    'typography-button-1': size === 'md',
                })}
            >
                {children}
            </p>
            {EndIcon && (
                <span className='ml-3'>
                    <EndIcon className='h-4 text-white' role='img' />
                </span>
            )}
        </Tag>
    );
};
