import clsx from 'clsx';
import { sizeStyle } from './constants';
import { CheckboxSizes } from './types';

export const Checkbox = ({
    isChecked = false,
    onChange,
    label,
    size = CheckboxSizes.md,
    disabled = false,
}: {
    isChecked: boolean;
    onChange: (v: boolean) => void;
    label?: string;
    size?: CheckboxSizes;
    disabled?: boolean;
}) => {
    return (
        <div className='inline-flex items-center'>
            <div className='relative flex cursor-pointer items-center'>
                <input
                    className={clsx(
                        'peer relative cursor-pointer appearance-none focus:shadow-checkbox focus:outline-none',
                        {
                            'border-primary-500 bg-neutral-50 hover:bg-neutral-200':
                                isChecked && !disabled,
                            'border-neutral-400 bg-neutral-100 hover:border-primary-500 hover:bg-neutral-200 focus:border-primary-500':
                                !isChecked,
                            'border-neutral-300 bg-neutral-200': disabled,
                        },
                        sizeStyle[size],
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
                        },
                    )}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-2 w-2'
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
                    className='typography-desktop-body-5 cursor-pointer whitespace-nowrap pl-2 capitalize text-neutral-50'
                >
                    {label}
                </label>
            )}
        </div>
    );
};
