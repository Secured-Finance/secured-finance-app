import cx from 'classnames';
import React from 'react';
import cm from './Chip.module.scss';

export interface IChipLabel {
    accent?: string;
    label: string;
}

export const ChipLabel: React.FC<IChipLabel> = ({
    accent,
    label,
    ...props
}) => (
    <span {...props} className={cx(cm.chipLabel, accent && cm[accent])}>
        {label}
    </span>
);

ChipLabel.defaultProps = {
    accent: 'purple',
    label: 'text',
};
