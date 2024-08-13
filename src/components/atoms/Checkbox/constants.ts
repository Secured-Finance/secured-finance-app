import { CheckboxSizes } from './types';

export const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/design/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?node-id=1922-5591&m=dev';

export const sizeStyle: { [key in CheckboxSizes]: string } = {
    [CheckboxSizes.sm]: 'h-3 w-3 rounded-[3px] border',
    [CheckboxSizes.md]: 'h-3.5 w-3.5 rounded-[3.5px] border-[1.2px]',
    [CheckboxSizes.lg]: 'h-4 w-4 rounded border-[1.5px]',
};
