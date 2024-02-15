import clsx from 'clsx';
import { ButtonSizes } from 'src/types';
import { IconButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=309-6701&mode=dev';

export const variantStyle: { [key in IconButtonVariants]: string } = {
    [IconButtonVariants.primary]: clsx(
        'text-primary-50 bg-primary-500 border-primary-50 hover:text-primary-50 hover:bg-primary-700 hover:border-transparent active:border-primary-50',
        'light:text-primary-500 light:bg-primary-50 light:border-primary-500 light:hover:border-primary-300 light:hover:bg-primary-300 light:active:border-primary-500'
    ),
    [IconButtonVariants.secondary]: clsx(
        'text-neutral-50 bg-neutral-800 border-neutral-50 hover:bg-neutral-700 hover:border-transparent active:border-neutral-50 active:bg-neutral-900',
        'light:bg-neutral-50 light:text-neutral-900 light:border-neutral-500 light:hover:border-transparent light:hover:bg-neutral-300 light:active:border-neutral-500'
    ),
    [IconButtonVariants.secondaryBuy]: clsx(
        'text-success-900 bg-success-700 border-success-50 hover:bg-success-900 hover:text-success-50 hover:border-transparent active:border-success-300',
        'light:text-success-900 light:border-success-700 light:bg-success-50 light:hover:bg-success-300 light:hover:border-transparent light:active:border-success-700'
    ),
    [IconButtonVariants.secondarySell]: clsx(
        'text-error-50 bg-error-700 border-error-50 hover:border-transparent hover:bg-error-900 active:border-error-50',
        'light:text-error-500 light:bg-error-50 light:border-error-500 light:hover:border-transparent light:hover:bg-error-300 light:hover:text-error-700 light:active:border-error-500'
    ),
};

export const iconSizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xs]: 'h-3 w-3',
    [ButtonSizes.sm]: 'h-[0.875rem] w-[0.875rem]',
    [ButtonSizes.md]: 'h-4 w-4',
    [ButtonSizes.lg]: 'h-5 w-5',
};

export const sizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xs]: 'h-5 w-5',
    [ButtonSizes.sm]: 'h-[1.625rem] w-[1.625rem]',
    [ButtonSizes.md]: 'h-8 w-8',
    [ButtonSizes.lg]: 'h-11 w-11',
};
