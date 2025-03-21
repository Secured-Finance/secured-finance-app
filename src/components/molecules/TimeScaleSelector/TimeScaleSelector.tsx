import React, { useState } from 'react';
import { ExpandIndicator, TimeScaleCheckBox } from 'src/components/atoms';
import { TimeScaleCheckBoxSizes } from 'src/components/atoms/TimeScaleCheckbox/constant';
import { formatTimeLabel, getColor, yieldTimeScales } from './constants';
export default function TimeScaleSelector({
    length,
    selected,
    setSelected,
}: {
    length: number;
    selected: { label: string; value: string }[];
    setSelected: React.Dispatch<
        React.SetStateAction<{ label: string; value: string }[]>
    >;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const handleCheckboxChange = (timePeriod: {
        label: string;
        value: string;
    }) => {
        setSelected(prevSelected => {
            const isAlreadySelected = prevSelected.some(
                item => item.value === timePeriod.value
            );
            const newSelected = isAlreadySelected
                ? prevSelected.filter(item => item.value !== timePeriod.value)
                : [...prevSelected, timePeriod];

            return newSelected.length <= 4 ? newSelected : prevSelected;
        });
        setIsOpen(!isOpen);
    };

    const CustomDropdown = () => {
        return (
            <div className='relative'>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className='h-32px w-32px'
                >
                    <div className='flex items-center gap-1 rounded-[32px] border border-primary-300 bg-neutral-700 p-2'>
                        <span className='text-sm font-bold text-neutral-300'>
                            Timescales
                        </span>
                        <ExpandIndicator expanded={isOpen} variant='solid' />
                    </div>
                </button>

                {isOpen && (
                    <div className='w-30 absolute z-10 mt-2 rounded-md bg-gunMetal  shadow-lg'>
                        {yieldTimeScales
                            .slice(0, length)
                            .map((timePeriod, index) => (
                                <div
                                    key={index}
                                    className='bg-gray-100 flex items-center gap-2 p-2'
                                >
                                    <TimeScaleCheckBox
                                        label={timePeriod.label}
                                        isChecked={selected.some(
                                            item =>
                                                item.value === timePeriod.value
                                        )}
                                        onChange={() =>
                                            handleCheckboxChange(timePeriod)
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className='flex flex-col justify-between gap-4'>
            <div className='w-[35px] tablet:hidden laptop:flex desktop:hidden'>
                <CustomDropdown />
            </div>

            <div className='hidden flex-col gap-2 tablet:flex laptop:hidden desktop:flex'>
                <div className='flex gap-10 px-3 '>
                    {yieldTimeScales
                        .slice(0, length)
                        .map((timePeriod, index) => (
                            <div
                                key={index}
                                className='text-sm'
                                style={{ color: '#94a3b8' }}
                            >
                                <TimeScaleCheckBox
                                    size={TimeScaleCheckBoxSizes.sm}
                                    label={timePeriod.label}
                                    isChecked={selected.some(
                                        item => item.value === timePeriod.value
                                    )}
                                    onChange={() =>
                                        handleCheckboxChange(timePeriod)
                                    }
                                />
                            </div>
                        ))}
                </div>
            </div>

            <div className='flex flex-col gap-1.5'>
                {selected.length > 0 && (
                    <ul className='flex gap-4'>
                        {selected.map((scale, index) => (
                            <li key={index} className='flex items-center gap-1'>
                                <span
                                    className='h-3 w-3 rounded-full'
                                    style={{
                                        backgroundColor: getColor(index, 1),
                                    }}
                                ></span>
                                <span className='font-secondary text-xs text-neutral-300 tablet:text-sm laptop:text-xs desktop:text-sm'>
                                    {formatTimeLabel(scale.label)}{' '}
                                    {scale.label !== 'Current Yield'
                                        ? 'Ago'
                                        : ''}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
