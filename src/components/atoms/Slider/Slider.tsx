import SliderUnstyled from '@mui/base/SliderUnstyled';
import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { usePreventPageScroll } from 'src/hooks';
import { InputBase } from '../InputBase';

const marks = [
    { value: 0 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
];

export const Slider = ({
    onChange,
    value,
    disabled = false,
}: {
    onChange: (v: number | undefined) => void;
    value?: number;
    disabled: boolean;
}) => {
    const sliderRef = useRef(null);
    usePreventPageScroll(sliderRef);

    const handleChange = useCallback(
        (_event: Event, value: number | number[], _activeThumb: number) => {
            onChange(value as number);
        },
        [onChange]
    );

    const handleAmountChange = useCallback(
        (amount: string | undefined) => {
            if (amount === undefined || value === undefined) {
                onChange(undefined);
            }
            if (
                value !== undefined &&
                Math.floor(value) !== Math.floor(Number(amount))
            ) {
                onChange(Number(amount));
            }
        },
        [onChange, value]
    );

    return (
        <div
            ref={sliderRef}
            className='flex w-full flex-row items-center gap-4 tablet:gap-6'
        >
            <SliderUnstyled
                value={value ?? 0}
                marks={marks}
                onChange={handleChange}
                classes={{ markActive: 'slider-markActive' }}
                disabled={disabled}
                slotProps={{
                    thumb: {
                        className: clsx(
                            'ring-[5px] w-3 h-3 -ml-[5px] bg-white rounded-3xl shadow-sliderthumb absolute',
                            {
                                'ring-transparent': disabled,
                                'ring-starBlue-80': !disabled,
                            }
                        ),
                    },
                    root: {
                        className: clsx(
                            'w-full relative flex items-center h-6',
                            {
                                'cursor-default': disabled,
                                'cursor-pointer': !disabled,
                            }
                        ),
                    },
                    rail: {
                        className: 'bg-neutral-700 h-2px w-full',
                    },
                    track: {
                        className: 'bg-primary-500 h-2px absolute',
                    },
                    mark: {
                        className:
                            'rounded-sm h-6px w-2px absolute bg-neutral-600',
                    },
                }}
            />
            <div className='flex h-[38px] w-[60px] flex-shrink-0 flex-row items-center justify-between rounded-lg border border-neutral-500 bg-neutral-900 px-1.5 focus-within:border-primary-500 tablet:h-11 tablet:w-16 tablet:px-2'>
                <InputBase
                    className='tablet:typography-desktop-body-3 typography-desktop-body-4 w-full font-semibold text-neutral-50'
                    onValueChange={handleAmountChange}
                    value={
                        value !== undefined
                            ? Math.floor(value).toString()
                            : undefined
                    }
                    maxLimit={100}
                    decimalPlacesAllowed={0}
                />
                <span className='tablet:typography-desktop-body-6 typography-mobile-body-6 text-neutral-400'>
                    %
                </span>
            </div>
        </div>
    );
};
