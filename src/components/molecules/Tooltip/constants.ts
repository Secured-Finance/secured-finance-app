import { TooltipMode } from './types';

export const modeStyles: { [key in TooltipMode]: string } = {
    [TooltipMode.Dark]: 'bg-neutral-700 border-neutral-500',
    [TooltipMode.Success]: 'bg-tooltip-success border-secondary-700',
    [TooltipMode.Warning]: 'bg-tooltip-warning border-warning-700',
    [TooltipMode.Error]: 'bg-tooltip-warning border-error-700',
};

export const iconStyles: { [key in TooltipMode]: string } = {
    [TooltipMode.Dark]: 'text-neutral-300',
    [TooltipMode.Success]: 'text-secondary-500',
    [TooltipMode.Warning]: 'text-warning-500',
    [TooltipMode.Error]: 'text-error-500',
};

export const tooltipOptions = {
    delay: 0,
    closeDelay: 0,
    motionProps: {
        variants: {
            exit: {
                opacity: 0,
                transition: {
                    duration: 0.1,
                    ease: 'easeIn',
                },
            },
            enter: {
                opacity: 1,
                transition: {
                    duration: 0.15,
                    ease: 'easeOut',
                },
            },
        },
    },
};
