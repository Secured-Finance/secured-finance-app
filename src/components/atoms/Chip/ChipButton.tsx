import cx from 'classnames';
import React from 'react';
import cm from './Chip.module.scss';

export interface IChipButton
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    accent?: string;
}

export const ChipButton: React.FC<IChipButton> = ({
    accent,
    children,
    ...props
}) => (
    <button {...props} className={cx(cm.chipButton, accent && cm[accent])}>
        {children}
    </button>
);
