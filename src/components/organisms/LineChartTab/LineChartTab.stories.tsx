import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { maturityOptions, yieldCurveRates } from 'src/stories/mocks/fixtures';
import { LineChartTab } from './LineChartTab';

export default {
    title: 'Organism/LineChartTab',
    component: LineChartTab,
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    decorators: [withWalletProvider, withAssetPrice],
} as Meta<typeof LineChartTab>;

const Template: StoryFn<typeof LineChartTab> = args => {
    return <LineChartTab {...args} />;
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
