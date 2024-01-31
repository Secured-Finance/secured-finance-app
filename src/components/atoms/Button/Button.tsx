import classNames from 'classnames';
import { useBreakpoint } from 'src/hooks';
import { SvgIcon } from 'src/types';
import { sizeStyle, variantStyle } from './constants';
import { ButtonSizes, ButtonVariants } from './types';

export const Button = ({
    href,
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

    return (
        <Tag
            {...tagProps}
            aria-label={label}
            className={classNames(
                'flex items-center justify-center border font-semibold active:border-transparent disabled:bg-neutral-600 disabled:text-neutral-400',
                props?.className,
                sizeStyle[size],
                variantStyle[variant],
                {
                    'text-neutral-50':
                        variant !== ButtonVariants.primaryBuy &&
                        variant !== ButtonVariants.tertiaryBuy &&
                        variant !== ButtonVariants.tertiarySell, // TODO: add on more variants as we go with success and error versions
                    'w-full': fullWidth,
                    'w-fit': !fullWidth,
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
