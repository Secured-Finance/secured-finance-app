import React from 'react';
import cm from './TextButton.module.scss';

export type ITextButton = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const TextButton: React.FC<ITextButton> = ({ children, ...props }) => {
    return (
        <button className={cm.textButton} {...props}>
            <span>{children}</span>
            <span className={cm.icon} />
        </button>
    );
};
