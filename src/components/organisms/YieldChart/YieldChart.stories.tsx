import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
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
    chromatic: { pauseAnimationAtEnd: true },
    args: {
        asset: 'USDC',
        isBorrow: true,
        rates: rates,
        maturitiesOptionList: maturityOptions,
    },
    argTypes: {},
    decorators: [withAssetPrice],
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
