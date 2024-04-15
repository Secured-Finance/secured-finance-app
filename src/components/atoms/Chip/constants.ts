import { ChipColors, ChipSizes } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=25-3142&mode=dev';

export const colorStyle: { [key in ChipColors]: string } = {
    [ChipColors.Gray]: 'text-neutral-50 bg-neutral-50/10 border-neutral-50',
    [ChipColors.Green]: 'text-success-300 bg-success-300/10 border-success-300',
    [ChipColors.Red]: 'text-error-300 bg-error-300/10 border-error-300',
    [ChipColors.Yellow]:
        'text-warning-300 bg-warning-300/10 border-warning-300',
    [ChipColors.Teal]:
        'text-secondary-300 bg-secondary-300/10 border-secondary-300',
    [ChipColors.Blue]: 'text-primary-300 bg-primary-300/10 border-primary-300',
};

export const sizeStyle: { [key in ChipSizes]: string } = {
    [ChipSizes.sm]: 'px-1 text-[0.5rem] leading-[0.625rem] rounded',
    [ChipSizes.md]: 'px-1.5 text-2xs leading-[1.3] rounded-[0.3125rem]',
    [ChipSizes.lg]: 'px-2 text-xs leading-4 rounded-md',
};
