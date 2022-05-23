import cx from 'classnames';
import React from 'react';
import cm from './Dropdown.module.scss';

export interface IDropdown
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    value: string | number;
    onChange?: (event: React.SyntheticEvent<HTMLSelectElement>) => void;
    options: Array<{
        value: string | number;
        label: string;
        icon?: string | JSX.Element;
    }>;
    noBorder?: boolean;
}

export const Dropdown: React.FC<IDropdown> = ({
    label,
    options,
    onChange,
    value,
    style,
    noBorder,
}) => {
    const ValueIcon = options.find(
        ({ value: optValue }) => String(optValue) === String(value)
    )?.icon;

    return (
        <div className={cm.container}>
            {label && (
                <span className={cx(noBorder && cm.noBorder, cm.label)}>
                    {label}
                </span>
            )}

            <div
                className={cx(cm.dropdownContainer, noBorder && cm.noBorder)}
                style={style}
            >
                {ValueIcon &&
                    (typeof ValueIcon === 'string' ? (
                        <img src={ValueIcon} className={cm.optionIcon} alt='' />
                    ) : (
                        ValueIcon
                    ))}
                <select
                    className={cx(ValueIcon && cm.withIcon, cm.select)}
                    onChange={onChange}
                    value={value}
                >
                    {options.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

Dropdown.defaultProps = {
    onChange: () => {
        /* Do Nothing */
    },
};
