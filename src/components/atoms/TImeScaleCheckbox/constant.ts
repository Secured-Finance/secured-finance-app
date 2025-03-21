export enum TimeScaleCheckBoxSizes {
    sm = 'sm',
    md = 'md',
    lg = 'lg',
}

export const TimeScaleCheckBoxSizeStyle: {
    [key in TimeScaleCheckBoxSizes]: string;
} = {
    [TimeScaleCheckBoxSizes.sm]: 'h-3 w-3 rounded-[3px] border',
    [TimeScaleCheckBoxSizes.md]: 'h-3.5 w-3.5 rounded-[3.5px] border-[1.2px]',
    [TimeScaleCheckBoxSizes.lg]: 'h-4 w-4 rounded border-[1.5px]',
};
