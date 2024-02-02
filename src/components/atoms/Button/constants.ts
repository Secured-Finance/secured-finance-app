import { ButtonSizes } from 'src/types';
import { ButtonVariants } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=294%3A4449&mode=design&t=IIcr5aKhnOxXG0ip-1';

export const variantStyle: { [key in ButtonVariants]: string } = {
    [ButtonVariants.primary]:
        'border-transparent bg-primary-500 hover:bg-primary-700 active:bg-primary-900',
    [ButtonVariants.secondary]:
        'border-primary-50 bg-primary-700 hover:bg-primary-900',
    [ButtonVariants.tertiary]:
        'border-primary-50 bg-transparent hover:bg-neutral-900',
    [ButtonVariants.primaryBuy]:
        'border-transparent bg-success-500 text-neutral-900 hover:bg-success-700 active:bg-success-900 active:text-neutral-50',
    [ButtonVariants.primarySell]:
        'border-transparent bg-error-500 hover:bg-error-700 active:bg-error-900',
    [ButtonVariants.secondaryNeutral]:
        'border-neutral-50 bg-neutral-700 text-neutral-50 hover:bg-neutral-800 active:border-transparent', // TODO
    [ButtonVariants.tertiaryBuy]:
        'border-success-300 bg-transparent text-success-300 hover:bg-success-900 hover:text-success-50 active:border-transparent',
    [ButtonVariants.tertiarySell]:
        'border-error-300 bg-transparent text-error-300 hover:bg-error-900 hover:text-error-50 hover:border-error-50 active:border-transparent', // TODO
};

export const sizeStyle: { [key in ButtonSizes]: string } = {
    [ButtonSizes.xs]: 'h-7 rounded-md px-[0.625rem] py-1',
    [ButtonSizes.sm]: 'h-[1.875rem] rounded-lg px-3 py-[0.375rem]',
    [ButtonSizes.md]:
        'h-[2.5rem] rounded-[0.635rem] px-[0.875rem] py-[0.635rem]',
    [ButtonSizes.lg]: 'h-[3.25rem] rounded-xl p-4',
};
