import React from 'react';
import cm from './TextButton.module.scss';
interface ITextButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const TextButton: React.FC<ITextButton> = ({ children, ...props }) => {
    return (
        <button className={cm.textButton} {...props}>
            {children}
            <span className={cm.icon} />
        </button>
    );
};
