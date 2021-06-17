import React from 'react';
import cm from './Button.module.scss';
import cx from 'classnames';

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    outline?: boolean;
}

export const Button: React.FC<IButton> = ({ outline, children, ...props }) => {
    return (
        <button
            className={cx(cm.button, {
                [cm.outline]: outline,
            })}
            {...props}
        >
            {children}
        </button>
    );
};
