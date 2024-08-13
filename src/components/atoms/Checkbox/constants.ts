import { CheckboxSizes } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/design/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?node-id=1922-5591&m=dev';

export const sizeStyle: { [key in CheckboxSizes]: string } = {
    [CheckboxSizes.sm]: 'px-1 text-[0.5rem] leading-[0.625rem] rounded',
    [CheckboxSizes.md]: 'h-3.5 w-3.5 rounded-[3.5px] border-[1.2px]',
    [CheckboxSizes.lg]: 'px-2 text-xs leading-4 rounded-md',
};
