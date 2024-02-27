import { ChipColors, ChipSizes } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=25-3142&mode=dev';

export const colorStyle: { [key in ChipColors]: string } = {
    [ChipColors.Gray]: 'text-neutral-900 bg-neutral-100',
    [ChipColors.Green]: 'text-success-700 bg-success-50',
    [ChipColors.Red]: 'text-error-500 bg-error-50',
    [ChipColors.Yellow]: 'text-warning-700 bg-warning-50',
    [ChipColors.Blue]: 'text-primary-500 bg-primary-50',
};

export const sizeStyle: { [key in ChipSizes]: string } = {
    [ChipSizes.sm]: 'h-3.5 px-1 text-[0.5rem] rounded-2xl',
    [ChipSizes.md]: 'h-[1.0625rem] px-1.5 text-[0.625rem] rounded-[1.25rem]',
    [ChipSizes.lg]: 'h-5 px-2 text-xs rounded-3xl',
};
