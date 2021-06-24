import React from 'react';
import cm from './FieldValue.module.scss';
import cx from 'classnames';

export interface IFieldValue {
    field: string;
    value: string;
    icon?: JSX.Element | string;
    bold?: boolean;
    small?: boolean;
}

export const FieldValue: React.FC<IFieldValue> = ({
    field,
    value,
    icon,
    bold,
    small,
}) => {
    return (
        <span className={cm.wrapper}>
            <span className={cm.container}>
                <span
                    className={cx(
                        {
                            [cm.small]: small,
                            [cm.bold]: bold,
                        },
                        cm.field
                    )}
                >
                    {field}
                </span>
                <span
                    className={cx(
                        {
                            [cm.small]: small,
                            [cm.bold]: bold,
                        },
                        cm.value
                    )}
                >
                    {value}
                </span>
            </span>
            {icon && typeof icon === 'string' ? (
                <img className={cm.icon} src={icon} />
            ) : (
                <span className={cm.icon}>{icon}</span>
            )}
        </span>
    );
};
