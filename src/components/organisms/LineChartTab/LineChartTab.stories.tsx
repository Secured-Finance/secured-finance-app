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
    args: {
        maturitiesOptionList: maturityOptions,
        rates: yieldCurveRates,
    },
    parameters: {
        date: {
            tick: true,
        },
    },
    decorators: [withWalletProvider, withAssetPrice, withMaturities],
} as ComponentMeta<typeof LineChartTab>;

const Template: ComponentStory<typeof LineChartTab> = args => {
    return <LineChartTab {...args} />;
};

export const Default = Template.bind({});
