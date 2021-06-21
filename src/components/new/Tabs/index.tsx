import React from 'react';
import cx from 'classnames';
import cm from './Tabs.module.scss';

interface ITab extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    isSelected: boolean;
    isLarge?: boolean;
}

export interface ITabs {
    options: Array<{
        value: string | number;
        label: string;
    }>;
    selected?: string | number;
    onChange: (value: number | string) => void;
    large?: boolean;
}

const Tab: React.FC<ITab> = ({ label, isSelected, isLarge }) => (
    <div
        className={cx(
            cm.tab,
            isSelected && cm.selected,
            isLarge && cm.largeTab
        )}
    >
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
    large,
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
                        isLarge={large}
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
