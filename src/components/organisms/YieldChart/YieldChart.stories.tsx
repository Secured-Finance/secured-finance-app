import type { Meta, StoryFn } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { dailyVolumes, maturityOptions } from 'src/stories/mocks/fixtures';
import { CurrencySymbol, Rate } from 'src/utils';
import { YieldChart } from './';

const rates = [
    new Rate(10000),
    new Rate(20000),
    new Rate(30000),
    new Rate(40000),
    new Rate(50000),
    new Rate(60000),
    new Rate(70000),
    new Rate(80000),
];
export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    chromatic: { pauseAnimationAtEnd: true, diffThreshold: 1 },
    args: {
        asset: CurrencySymbol.WFIL,
        isBorrow: true,
        rates: rates,
        maturitiesOptionList: maturityOptions,
        dailyVolumes: dailyVolumes.slice(0, 10),
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as Meta<typeof YieldChart>;

const Template: StoryFn<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});

export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
