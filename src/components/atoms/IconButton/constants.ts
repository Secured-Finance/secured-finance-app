import { ButtonSizes } from 'src/types';
import { IconButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=309-6701&mode=dev';

export const variantStyle: { [key in IconButtonVariants]: string } = {
    [IconButtonVariants.primary]:
        'text-primary-500 bg-primary-50 border-primary-500 hover:bg-primary-300 hover:border-transparent active:border-primary-500',
    [IconButtonVariants.secondary]:
        'text-neutral-900 bg-neutral-50 border-neutral-500 hover:bg-neutral-300 hover:border-transparent active:border-neutral-500',
    [IconButtonVariants.secondaryBuy]:
        'text-success-900 bg-success-50 border-green-700 hover:bg-success-300 hover:border-transparent active:border-success-700',
    [IconButtonVariants.secondarySell]:
        'text-error-500 bg-error-50 border-error-500 hover:border-transparent hover:bg-error-300 active:border-error-500',
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
    [ButtonSizes.lg]: 'h-[2.75rem] w-[2.75rem]',
};
