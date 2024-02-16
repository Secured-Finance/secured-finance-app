import clsx from 'clsx';
import { ButtonSizes } from 'src/types';
import { ButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=294%3A4449&mode=design&t=IIcr5aKhnOxXG0ip-1';

export const variantStyle: { [key in ButtonVariants]: string } = {
    [ButtonVariants.primary]: clsx(
        'border-transparent bg-primary-500 hover:bg-primary-700 active:bg-primary-900',
        'light:disabled:text-neutral-400 light:disabled:bg-neutral-100'
    ),
    [ButtonVariants.primaryBuy]: clsx(
        'border-transparent bg-success-500 text-neutral-900 hover:bg-success-700 active:bg-success-900 active:text-neutral-50',
        'light:disabled:text-neutral-400 light:disabled:bg-neutral-100'
    ),
    [ButtonVariants.primarySell]: clsx(
        'border-transparent bg-error-500 hover:bg-error-700 active:bg-error-900',
        'light:disabled:text-neutral-400 light:disabled:bg-neutral-100'
    ),
    [ButtonVariants.secondary]: clsx(
        'border-primary-50 bg-primary-700 hover:border-primary-900 hover:bg-primary-900 active:border-primary-50',
        'light:border-primary-500 light:text-primary-500 light:bg-primary-50 light:hover:bg-primary-300 light:hover:border-transparent light:disabled:text-neutral-300 light:disabled:bg-neutral-100 light:disabled:border-transparent light:active:bg-primary-300 light:active:text-primary-700 light:active:border-primary-500'
    ),
    [ButtonVariants.secondaryNeutral]: clsx(
        'border-neutral-50 bg-neutral-700 hover:bg-neutral-800 hover:border-transparent active:border-neutral-50 active:bg-neutral-900',
        'light:bg-neutral-50 light:text-neutral-600 light:border-neutral-600 light:hover:bg-neutral-200 light:hover:border-transparent light:disabled:text-neutral-300 light:disabled:bg-neutral-100 light:disabled:border-transparent light:active:bg-neutral-300 light:active:border-neutral-600'
    ),
    [ButtonVariants.tertiary]: clsx(
        'border-primary-50 hover:bg-neutral-900 active:border-transparent',
        'light:text-neutral-900 light:border-neutral-500 light:hover:bg-neutral-50 light:hover:text-neutral-500 light:hover:border-neutral-300 light:disabled:text-neutral-300 light:disabled:bg-neutral-100 light:disabled:border-transparent light:active:text-neutral-900 light:active:bg-neutral-300 light:active:border-transparent'
    ),
    [ButtonVariants.tertiaryBuy]: clsx(
        'border-success-300 text-success-300 hover:bg-success-900 hover:text-success-50 hover:border-success-50 active:border-transparent',
        'light:border-success-900 light:text-success-900 light:hover:bg-success-50 light:disabled:text-neutral-300 light:disabled:bg-neutral-100 light:disabled:border-transparent light:active:bg-success-300 light:active:text-success-900 light:active:border-transparent'
    ),
    [ButtonVariants.tertiarySell]: clsx(
        'border-error-300 text-error-300 hover:bg-error-900 hover:text-error-50 hover:border-error-50 active:border-transparent',
        'light:border-error-500 light:text-error-500 light:hover:bg-error-50 light:hover:border-error-300 light:hover:text-error-500 light:disabled:text-neutral-300 light:disabled:bg-neutral-100 light:disabled:border-transparent light:active:border-transparent light:active:text-error-900 light:active:bg-error-300'
    ),
};

export const sizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xs]: 'h-7 rounded-md px-[0.625rem] py-1',
    [ButtonSizes.sm]: 'h-[1.875rem] rounded-lg px-3 py-[0.375rem]',
    [ButtonSizes.md]:
        'h-[2.5rem] rounded-[0.625rem] px-[0.875rem] py-[0.625rem]',
    [ButtonSizes.lg]: 'h-11 rounded-xl py-3 px-5',
};
