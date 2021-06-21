import React from 'react';
import cx from 'classnames';
import cm from './Tabs.module.scss';

interface ITab extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    isSelected: boolean;
}

export interface ITabs {
    options: Array<{
        value: string | number;
        label: string;
    }>;
    selected?: string | number;
    onChange: (value: number | string) => void;
}

const Tab: React.FC<ITab> = ({ label, isSelected }) => (
    <div className={cx(cm.tab, isSelected && cm.selected)}>
        <div className={cm.tabLabel}>
            {label}
            <div className={cm.bottomBorder} />
        </div>
    </div>
);

export const Tabs: React.FC<ITabs> = ({
    onChange,
    options,
    selected,
    ...props
}) => {
    return (
        <div className={cm.tabs} {...props}>
            {options.length &&
                options.map(({ value, label }) => (
                    <Tab
                        label={label}
                        isSelected={selected === value}
                        onClick={() => onChange(value)}
                    />
                ))}
        </div>
    );
};

Tabs.defaultProps = {
    selected: 2,
    options: [],
    onChange: () => {},
};
