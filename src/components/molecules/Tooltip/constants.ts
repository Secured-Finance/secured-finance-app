import { TooltipMode } from './types';

export const modeStyles: { [key in TooltipMode]: string } = {
    [TooltipMode.Dark]: 'bg-neutral-900 light:bg-neutral-100',
    [TooltipMode.Success]: 'bg-secondary-900 light:bg-secondary-300',
    [TooltipMode.Warning]: 'bg-warning-900 light:bg-warning-500',
    [TooltipMode.Error]: 'bg-error-900 light:bg-error-300',
};

export const iconStyles: { [key in TooltipMode]: string } = {
    [TooltipMode.Dark]: 'text-neutral-400 light:text-neutral-600',
    [TooltipMode.Success]: 'text-secondary-50 light:text-secondary-900',
    [TooltipMode.Warning]: 'text-warning-50 light:text-warning-900',
    [TooltipMode.Error]: 'text-error-50 light:text-error-900',
};
