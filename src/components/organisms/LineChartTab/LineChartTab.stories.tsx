import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withMaturities,
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
    decorators: [withWalletProvider, withAssetPrice, withMaturities],
} as ComponentMeta<typeof LineChartTab>;

const Template: ComponentStory<typeof LineChartTab> = args => {
    return <LineChartTab {...args} />;
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
