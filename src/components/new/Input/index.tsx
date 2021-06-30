import React from 'react';
import cm from './Input.module.scss';
import cx from 'classnames';
import { generateID } from 'src/utils';

export interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    noBorder?: boolean;
    alignRight?: boolean;
}

export const Input: React.FC<IInput> = ({
    label,
    noBorder,
    alignRight,
    ...props
}) => {
    return (
        <div className={cm.container}>
            {label && (
                <label
                    className={cx(cm.label, alignRight && cm.alignRight)}
                    htmlFor={props.id}
                >
                    {label}
                </label>
            )}
            <input
                className={cx(
                    cm.input,
                    noBorder && cm.noBorder,
                    alignRight && cm.alignRight
                )}
                {...props}
            />
        </div>
    );
};

Input.defaultProps = {
    noBorder: false,
    id: generateID(),
};
