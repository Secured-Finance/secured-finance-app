import SliderUnstyled from '@mui/base/SliderUnstyled';
import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { usePreventPageScroll } from 'src/hooks';

const marks = [
    { value: 0 },
    { value: 25 },
    { value: 50 },
    { value: 75 },
    { value: 100 },
];

export const Slider = ({
    onChange,
    value = 0,
    disabled = false,
}: {
    onChange: (v: number) => void;
    value: number;
    disabled: boolean;
}) => {
    const sliderRef = useRef(null);
    usePreventPageScroll(sliderRef);

    const handleChange = useCallback(
        (_event: Event, value: number | number[], _activeThumb: number) => {
            onChange(value as number);
        },
        [onChange],
    );
    return (
        <div ref={sliderRef}>
            <SliderUnstyled
                value={value}
                marks={marks}
                onChange={handleChange}
                classes={{ markActive: 'slider-markActive' }}
                disabled={disabled}
                slotProps={{
                    thumb: {
                        className: clsx(
                            ' ring-[5px] w-3 h-3 -ml-[5px] bg-white rounded-full shadow-sliderthumb absolute',
                            {
                                'ring-transparent': disabled,
                                'ring-starBlue-80': !disabled,
                            },
                        ),
                    },
                    root: {
                        className: clsx(
                            'w-full relative flex items-center h-6',
                            {
                                'cursor-default': disabled,
                                'cursor-pointer': !disabled,
                            },
                        ),
                    },
                    rail: {
                        className: 'bg-neutral-3 h-2px w-full',
                    },
                    track: {
                        className: 'bg-starBlue h-2px absolute',
                    },
                    mark: {
                        className:
                            'rounded-sm h-6px w-2px absolute bg-neutral-4',
                    },
                }}
            />
        </div>
    );
};
