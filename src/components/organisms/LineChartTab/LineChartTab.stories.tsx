import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { LineChartTab } from './LineChartTab';

export default {
    title: 'Organism/LineChartTab',
    component: LineChartTab,
    chromatic: { pauseAnimationAtEnd: true },
    decorators: [withWalletProvider, withAssetPrice],
} as Meta<typeof LineChartTab>;

const Template: StoryFn<typeof LineChartTab> = () => {
    return (
        <div className='h-[410px] w-full px-6 py-4'>
            <LineChartTab />
        </div>
    );
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
