import clsx from 'clsx';
import { sizeStyle } from './constants';
import { CheckboxSizes } from './types';

export const Checkbox = ({
    isChecked = false,
    onChange,
    label,
    size = CheckboxSizes.md,
    disabled = false,
    isGrayScale = false,
}: {
    isChecked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
    size?: CheckboxSizes;
    disabled?: boolean;
    isGrayScale?: boolean;
}) => {
    return (
        <div className='inline-flex items-center'>
            <div className='relative flex cursor-pointer items-center'>
                <input
                    className={clsx(
                        'peer relative cursor-pointer appearance-none focus:outline-none',
                        isGrayScale
                            ? 'border-gray-500 h-2.5 w-2.5 rounded-[2.2] border bg-transparent p-2'
                            : 'focus:shadow-checkbox',
                        {
                            'border-primary-500 bg-neutral-50 hover:bg-neutral-200':
                                isChecked && !disabled && !isGrayScale,
                            'border-neutral-400 bg-neutral-100 hover:border-primary-500 hover:bg-neutral-200 focus:border-primary-500':
                                !isChecked && !isGrayScale,
                            'border-neutral-300 bg-neutral-200':
                                disabled && !isGrayScale,
                            'bg-neutral-700 text-primary-300':
                                isChecked && !disabled && isGrayScale,
                            'hover:border-blue-500 bg-neutral-700':
                                !isChecked && !disabled && isGrayScale,
                            'bg-gray-300 text-gray-500 cursor-not-allowed':
                                disabled && isGrayScale,
                        },
                        sizeStyle[size]
                    )}
                    id='checkbox'
                    type='checkbox'
                    checked={isChecked}
                    disabled={disabled}
                    onChange={e => onChange(e.target.checked)}
                />
                <span
                    className={clsx(
                        'pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100',
                        {
                            'text-primary-500': isChecked && !disabled,
                            'text-neutral-300': isChecked && disabled,
                            'text-primary-300':
                                isChecked && !disabled && isGrayScale,
                        }
                    )}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className={clsx(
                            isGrayScale ? 'h-4 w-3 text-primary-300' : 'h-2 w-2'
                        )}
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
                        'cursor-pointer whitespace-nowrap capitalize',
                        isGrayScale
                            ? 'ml-2 font-secondary text-sm text-neutral-400'
                            : 'typography-desktop-body-5 text-neutral-50'
                    )}
                >
                    {label}
                </label>
            )}
        </div>
    );
};
