import { TabVariant } from './types';

export const lineStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'bg-secondary-500',
    [TabVariant.Borrow]: 'bg-error-300',
    [TabVariant.Neutral]: 'bg-neutral-300 light:bg-neutral-400',
    [TabVariant.Blue]: 'bg-primary-500',
};

export const textStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'text-secondary-50 light:text-secondary-700',
    [TabVariant.Borrow]: 'text-error-50 light:text-error-700',
    [TabVariant.Neutral]: 'text-neutral-50 light:text-neutral-700',
    [TabVariant.Blue]: 'text-neutral-50 light:text-neutral-900',
};

export const bgGradientStyle: { [key in TabVariant]: string } = {
    [TabVariant.Lend]: 'from-tabGradient-lend-start to-tabGradient-lend-end',
    [TabVariant.Borrow]:
        'from-tabGradient-borrow-start to-tabGradient-borrow-end',
    [TabVariant.Neutral]:
        'from-tabGradient-neutral-start to-tabGradient-neutral-end',
    [TabVariant.Blue]:
        'from-tabGradient-blue-start to-tabGradient-blue-end light:from-tabGradient-blue-startLight light:to-tabGradient-blue-endLight',
};
