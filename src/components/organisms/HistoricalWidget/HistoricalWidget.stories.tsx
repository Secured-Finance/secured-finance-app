import type { Meta, StoryFn } from '@storybook/react';
import { useHistoricalChartData } from 'src/hooks';
import { HistoricalWidget } from './HistoricalWidget';
import { graphTypeOptions, timeScales } from './constants';

export default {
    title: 'Organism/HistoricalWidget',
    component: HistoricalWidget,
    args: {
        timeScales: timeScales,
        chartType: graphTypeOptions,
        data: [],
    },
    argTypes: {},
} as Meta<typeof HistoricalWidget>;

const Template: StoryFn<typeof HistoricalWidget> = args => {
    const dataSet = useHistoricalChartData();

    return (
        <div className='w-[800px]'>
            <HistoricalWidget {...args} {...dataSet} />
        </div>
    );
};

export const Default = Template.bind({});
