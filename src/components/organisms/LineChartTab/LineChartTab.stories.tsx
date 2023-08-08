import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { LineChartTab } from './LineChartTab';

export default {
    title: 'Organism/LineChartTab',
    component: LineChartTab,
    chromatic: { pauseAnimationAtEnd: true },
    decorators: [withWalletProvider, withAssetPrice, withMaturities],
} as Meta<typeof LineChartTab>;

const Template: StoryFn<typeof LineChartTab> = () => {
    return <LineChartTab />;
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
