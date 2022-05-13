import cx from 'classnames';
import React from 'react';
import cm from './FieldValue.module.scss';

export interface IFieldValue {
    field: string;
    value: string | JSX.Element;
    icon?: JSX.Element | string;
    bold?: boolean;
    large?: boolean;
    light?: boolean;
    alignRight?: boolean;
    accent?: string;
}

export const FieldValue: React.FC<IFieldValue> = ({
    field,
    value,
    icon,
    bold,
    large,
    light,
    alignRight,
    accent,
}) => {
    const renderIcon = () => {
        if (!icon) return null;
        const defaultImageSize = bold ? 24 : 20;

        return typeof icon === 'string' ? (
            <img
                className={cm.icon}
                width={defaultImageSize}
                height={defaultImageSize}
                src={icon}
                alt=''
            />
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
                            [cm.alignRight]: alignRight,
                            [cm[`accent-${accent}`]]: accent,
                        },
                        cm.value
                    )}
                >
                    <span>{value}</span>
                    {renderIcon()}
                </span>
            </span>
        </span>
    );
};
