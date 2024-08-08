import { ButtonSizes, ButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=294%3A4449&mode=design&t=IIcr5aKhnOxXG0ip-1';

export const variantStyle: { [key in ButtonVariants]: string } = {
    [ButtonVariants.primary]:
        'border-transparent bg-primary-500 hover:bg-primary-700 active:border-primary-500',
    [ButtonVariants.secondary]:
        'border-primary-300 bg-transparent hover:border-primary-500 active:bg-primary-300/20',
    [ButtonVariants.tertiary]:
        'border-neutral-200 bg-transparent hover:border-neutral-400 active:bg-neutral-200/20',
};

export const sizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xxs]: 'rounded-md px-2.5 py-0.5',
    [ButtonSizes.xs]: 'rounded-md px-2.5 py-1',
    [ButtonSizes.sm]: 'rounded-lg px-3 py-[7px]',
    [ButtonSizes.md]: 'rounded-[0.625rem] px-3.5 py-2.5',
    [ButtonSizes.lg]: 'rounded-xl py-3 px-5',
};

export const textStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xxs]: 'text-2.5 leading-[14px]',
    [ButtonSizes.xs]: 'text-2.5 leading-[14px]',
    [ButtonSizes.sm]: 'text-xs leading-4',
    [ButtonSizes.md]: 'text-sm leading-[18px]',
    [ButtonSizes.lg]: 'text-base leading-5',
};
