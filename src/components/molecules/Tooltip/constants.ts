import { TooltipMode } from './types';

export const modeStyles: { [key in TooltipMode]: string } = {
    [TooltipMode.Dark]: 'bg-neutral-700 border-neutral-500',
    [TooltipMode.Success]: 'bg-[#0C474C] border-secondary-700', // TODO: update bg color to variable
    [TooltipMode.Warning]: 'bg-[#422F09] border-warning-700', // TODO: update bg color to variable
    [TooltipMode.Error]: 'bg-[#4A1220] border-error-700', // TODO: update bg color to variable
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
