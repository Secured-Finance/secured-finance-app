import React from 'react';
import cm from './FieldValue.module.scss';
import cx from 'classnames';

export interface IFieldValue {
    field: string;
    value: string;
    icon?: string;
    bold?: boolean;
    small?: boolean;
}

export const FieldValue: React.FC<IFieldValue> = ({
    field,
    value,
    icon,
    bold,
    small,
}) => (
    <span>
        <span className={cm.container}>
            <span className={cx(small && cm.small, cm.field)}>{field}</span>
            <span className={cx(small && cm.small, cm.value)}>{value}</span>
        </span>
        {icon && <img src={icon} />}
    </span>
);
