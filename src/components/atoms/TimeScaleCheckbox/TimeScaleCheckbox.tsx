import clsx from 'clsx';
import { TimeScaleCheckBoxSizeStyle } from './constant';
import { TimeScaleCheckBoxSizes } from './types';

export const TimeScaleCheckBox = ({
    isChecked = false,
    onChange,
    label,
    size = TimeScaleCheckBoxSizes.sm,
    disabled = false,
}: {
    isChecked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
    size?: TimeScaleCheckBoxSizes;
    disabled?: boolean;
}) => {
    return (
        <div className='inline-flex items-center'>
            <div className='relative flex cursor-pointer items-center'>
                <input
                    className={clsx(
                        'peer relative h-2.5 w-2.5 cursor-pointer appearance-none rounded-[2.2] border bg-transparent p-2 focus:outline-none',
                        {
                            'bg-neutral-700 text-neutral-500':
                                isChecked && !disabled,
                            'hover:border-blue-500 bg-neutral-700':
                                !isChecked && !disabled,
                            'cursor-not-allowed bg-neutral-3 text-slateGray':
                                disabled,
                        },
                        TimeScaleCheckBoxSizeStyle[size],
                    )}
                    id='checkbox'
                    type='checkbox'
                    checked={isChecked}
                    disabled={disabled}
                    onChange={e => onChange(e.target.checked)}
                />
                <span
                    className={clsx(
                        'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary-300 opacity-0 peer-checked:opacity-100',
                    )}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={'h-4 w-3 text-primary-300'}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                        stroke='currentColor'
                        strokeWidth='1'
                    >
                        <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                        ></path>
                    </svg>
                </span>
            </div>
            {label && (
                <label
                    htmlFor='checkbox'
                    className={clsx(
                        'ml-2 whitespace-nowrap font-secondary text-sm/5 capitalize',
                        {
                            'cursor-pointer text-neutral-400': !disabled,
                            'cursor-not-allowed text-slateGray': disabled,
                        },
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
};
