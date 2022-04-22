import React from 'react';
import cm from './Chip.module.scss';
import cx from 'classnames';

export type accent = 'purple' | 'red' | 'green' | 'grey' | 'turquoise' | 'blue';

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
