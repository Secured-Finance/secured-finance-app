import React, { useState } from 'react';
import CheckBoxIcon from 'src/assets/icons/check-box.svg';
import UnCheckedCheckBoxIcon from 'src/assets/icons/unchecked-checkbox.svg';

interface CheckboxProps {
    children: React.ReactNode;
    value: boolean;
    handleToggle: (value: boolean) => void;
}

export const Checkbox = ({ children, value, handleToggle }: CheckboxProps) => {
    const [isChecked, setIsChecked] = useState(value);

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
        handleToggle(!isChecked);
    };

    return (
        <label
            htmlFor='checkbox'
            className='flex w-full select-none flex-row items-center justify-between'
        >
            {children}
            <input
                className='hidden'
                type='checkbox'
                checked={isChecked}
                onChange={handleCheckboxChange}
                id='checkbox'
            />
            {isChecked ? (
                <CheckBoxIcon className='ml-1 h-4 w-4' />
            ) : (
                <UnCheckedCheckBoxIcon className='ml-1 h-4 w-4' />
            )}
        </label>
    );
};
