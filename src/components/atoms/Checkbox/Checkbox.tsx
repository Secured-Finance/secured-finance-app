import clsx from 'clsx';
import { sizeStyle } from './constants';
import { CheckboxSizes } from './types';

export const Checkbox = ({
    isChecked = false,
    size = CheckboxSizes.md,
    onChange,
    disabled = false,
}: {
    isChecked: boolean;
    size?: CheckboxSizes;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) => {
    return (
        <div className='inline-flex items-center'>
            <div className='relative flex cursor-pointer items-center'>
                <input
                    className={clsx(
                        'peer relative cursor-pointer appearance-none focus:outline-none',
                        {
                            'border-primary-500 bg-neutral-50 hover:border-primary-500 hover:bg-neutral-200':
                                isChecked && !disabled,
                            'border-neutral-400 bg-neutral-100 hover:border-primary-500 hover:bg-neutral-200':
                                !isChecked,
                            'border-neutral-300 bg-neutral-200': disabled,
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
                        'pointer-events-none absolute left-2/4 top-2/4 -translate-x-2/4 -translate-y-2/4 opacity-0 peer-checked:opacity-100',
                        {
                            'text-primary-500': isChecked && !disabled,
                            'text-neutral-300': isChecked && disabled,
                        }
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
        </div>
    );
};
