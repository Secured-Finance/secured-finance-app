import classNames from 'classnames';
import { useBreakpoint } from 'src/hooks';
import { SvgIcon } from 'src/types';
import { ButtonSizes, ButtonVariants } from './types';

export const Button = ({
    href, //do nothing
    size = ButtonSizes.md,
    fullWidth = false,
    children,
    StartIcon,
    EndIcon,
    variant = ButtonVariants.primary,
    mobileText, // Added prop to handle button text on mobile
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement> & {
        fullWidth?: boolean;
        href?: string;
        size?: ButtonSizes;
        variant?: ButtonVariants;
        mobileText?: string;
    } & {
        StartIcon?: SvgIcon;
        EndIcon?: SvgIcon;
    }) => {
    const isMobile = useBreakpoint('tablet');
    const Tag = href ? 'a' : 'button';
    const tagProps = href
        ? {
              href,
              target: '_blank',
              rel: 'noopener noreferrer',
          }
        : props;

    const label = typeof children === 'string' ? children : 'Button';
    const text = isMobile && mobileText ? mobileText : children;

    // 'enabled:border enabled:border-slateGray enabled:text-neutral-8 enabled:hover:border-none enabled:hover:bg-neutral-8 enabled:hover:text-neutral-2 disabled:bg-neutral-8 disabled:text-neutral-2'

    //   text-neutral-8 enabled:hover:bg-gradient-to-t enabled:hover:from-black-20 enabled:hover:via-black-20 enabled:hover:to-starBlue disabled:bg-gradient-to-t disabled:from-black/25 disabled:via-black/25 disabled:to-starBlue disabled:opacity-50

    return (
        <Tag
            {...tagProps}
            aria-label={label}
            className={classNames(
                'flex items-center justify-center border text-white disabled:bg-neutral-600 disabled:text-neutral-400',
                props?.className,
                {
                    'h-7 rounded-md px-[0.625rem] py-1':
                        size === ButtonSizes.xs,
                    'h-[1.875rem] rounded-lg px-3 py-[0.375rem]':
                        size === ButtonSizes.sm,
                    'h-[2.5rem] rounded-[0.635rem] px-[0.875rem] py-[0.635rem]':
                        size === ButtonSizes.md,
                    'h-[3.25rem] rounded-xl p-4': size === ButtonSizes.lg,
                    'w-full': fullWidth,
                    'w-fit': !fullWidth,
                    'border-transparent bg-primary-500 hover:bg-primary-700 active:bg-primary-900':
                        variant === ButtonVariants.primary,
                    'border-primary-50 bg-primary-700 hover:bg-primary-900':
                        variant === ButtonVariants.secondary,
                    'border-primary-50 bg-transparent':
                        variant === ButtonVariants.tertiary,
                }
            )}
        >
            {/* TODO: handle height of start and end icon wrt size prop value */}
            {StartIcon && (
                <span className='mr-3'>
                    <StartIcon className='h-4 text-white' role='img' />
                </span>
            )}
            <p
                className={classNames('whitespace-nowrap', {
                    'text-xs': size === ButtonSizes.xs,
                    'text-sm': size === ButtonSizes.sm,
                    'text-base':
                        size === ButtonSizes.md || size === ButtonSizes.lg,
                })}
            >
                {text}
            </p>
            {EndIcon && (
                <span className='ml-3'>
                    <EndIcon className='h-4 text-white' role='img' />
                </span>
            )}
        </Tag>
    );
};
