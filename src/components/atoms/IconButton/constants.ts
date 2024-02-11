import { ButtonSizes } from 'src/types';
import { IconButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=309-6701&mode=dev';

export const variantStyle: { [key in IconButtonVariants]: string } = {
    [IconButtonVariants.primary]:
        'text-primary-500 bg-primary-50 border-primary-50 hover:text-primary-50 hover:bg-primary-700 hover:border-transparent active:border-primary-50',
    [IconButtonVariants.secondary]:
        'text-neutral-50 bg-neutral-800 border-neutral-50 hover:bg-neutral-700 hover:border-transparent active:border-neutral-50 active:bg-neutral-900',
    [IconButtonVariants.secondaryBuy]:
        'text-success-900 bg-success-700 border-success-50 hover:bg-success-900 hover:text-success-50 hover:border-transparent active:border-success-300',
    [IconButtonVariants.secondarySell]:
        'text-error-50 bg-error-700 border-error-50 hover:border-transparent hover:bg-error-900 active:border-error-50',
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
