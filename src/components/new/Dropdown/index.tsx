import cm from './Dropdown.module.scss';
import React, { RefObject } from 'react';
import { chevron } from 'src/components/new/icons';

export interface IDropdown
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    value: string | number;
    onChange?: (event: React.SyntheticEvent<HTMLSelectElement>) => void;
    options: Array<{
        value: string | number;
        label: string;
        icon?: string;
    }>;
}

export const Dropdown: React.FC<IDropdown> = ({
    label,
    options,
    onChange,
    value,
    style,
}) => {
    const valueIcon = options.find(
        ({ value: optValue }) => String(optValue) === String(value)
    )?.icon;

    return (
        <div className={cm.container} style={style}>
            {label && <span className={cm.label}>{label}</span>}
            {valueIcon && <img src={valueIcon} className={cm.optionIcon} />}
            <select className={cm.select} onChange={onChange} value={value}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

Dropdown.defaultProps = {
    onChange: () => {},
};
