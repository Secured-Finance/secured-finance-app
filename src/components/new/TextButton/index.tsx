import React from 'react';
import cm from './TextButton.module.scss';

export interface ITextButton
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const TextButton: React.FC<ITextButton> = ({ children, ...props }) => {
    return (
        <button className={cm.textButton} {...props}>
            <span>{children}</span>
            <span className={cm.icon} />
        </button>
    );
};
