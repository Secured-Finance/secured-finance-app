import React from 'react';
import cm from './Chip.module.scss';
import cx from 'classnames';

export type accent = 'purple' | 'red';

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
