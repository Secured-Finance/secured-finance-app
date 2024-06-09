import { TabVariant } from './types';

export const lineStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'bg-secondary-500',
    [TabVariant.Borrow]: 'bg-error-500',
    [TabVariant.Neutral]: 'bg-neutral-300',
    [TabVariant.Blue]: 'bg-primary-500',
};

export const textStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'text-secondary-300',
    [TabVariant.Borrow]: 'text-error-300',
    [TabVariant.Neutral]: 'text-neutral-50',
    [TabVariant.Blue]: 'text-neutral-50',
};

export const bgGradientStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'from-tabGradient-lend-start to-tabGradient-lend-end',
    [TabVariant.Borrow]:
        'from-tabGradient-borrow-start to-tabGradient-borrow-end',
    [TabVariant.Neutral]:
        'from-tabGradient-neutral-start to-tabGradient-neutral-end',
    [TabVariant.Blue]: 'from-tabGradient-blue-start to-tabGradient-blue-end',
};
