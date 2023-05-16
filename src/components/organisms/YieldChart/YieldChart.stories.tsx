import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
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
        asset: CurrencySymbol.USDC,
        isBorrow: true,
        rates: rates,
        maturitiesOptionList: maturityOptions,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockDailyVolumes],
        },
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};
