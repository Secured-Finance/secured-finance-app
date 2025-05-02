import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { yieldTimeScales } from './constants';
import { TimeScaleSelector } from './TimeScaleSelector';

const meta: Meta<typeof TimeScaleSelector> = {
    title: 'Molecules/TimeScaleSelector',
    component: TimeScaleSelector,
    args: {
        length: 5,
        selected: [],
        setSelected: () => {},
        disabledIntervals: new Set<string>(),
    },
};

export default meta;

type Story = StoryObj<typeof TimeScaleSelector>;

export const Default: Story = {
    args: {
        setSelected: () => {},
    },
};

export const WithPreselected: Story = {
    args: {
        selected: yieldTimeScales.slice(0, 2),
        setSelected: () => {},
    },
};

export const Interactive = () => {
    const [selectedTimeScales, setSelectedTimeScales] = useState<
        { label: string; value: string }[]
    >([]);

    return (
        <TimeScaleSelector
            length={5}
            selected={selectedTimeScales}
            setSelected={setSelectedTimeScales}
            disabledIntervals={new Set(['1H'])}
        />
    );
};
