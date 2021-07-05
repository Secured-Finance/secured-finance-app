import React from 'react';
import cm from './FieldValue.module.scss';
import cx from 'classnames';

export interface IFieldValue {
    field: string;
    value: string | JSX.Element;
    icon?: JSX.Element | string;
    bold?: boolean;
    large?: boolean;
    light?: boolean;
}

export const FieldValue: React.FC<IFieldValue> = ({
    field,
    value,
    icon,
    bold,
    large,
    light,
}) => {
    const renderIcon = () => {
        if (!icon) return null;

        return typeof icon === 'string' ? (
            <img className={cm.icon} src={icon} />
        ) : (
            <span className={cm.icon}>{icon}</span>
        );
    };
    return (
        <span className={cm.wrapper}>
            <span className={cm.container}>
                <span
                    className={cx(
                        {
                            [cm.large]: large,
                            [cm.bold]: bold,
                            [cm.light]: light,
                        },
                        cm.field
                    )}
                >
                    {field}
                </span>
                <span
                    className={cx(
                        {
                            [cm.large]: large,
                            [cm.bold]: bold,
                            [cm.light]: light,
                        },
                        cm.value
                    )}
                >
                    {value}
                </span>
            </span>
            {renderIcon()}
        </span>
    );
};
