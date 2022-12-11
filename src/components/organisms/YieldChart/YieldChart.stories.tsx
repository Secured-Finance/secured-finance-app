import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice, withMaturities } from 'src/../.storybook/decorators';
import { maturityOptions } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { YieldChart } from './';

export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    chromatic: { diffThreshold: 1, delay: 500 },
    args: {
        asset: 'USDC',
        isBorrow: true,
        rates: [
            new Rate(100000),
            new Rate(200000),
            new Rate(300000),
            new Rate(400000),
        ],
        maturitiesOptionList: maturityOptions,
    },
    argTypes: {},
    decorators: [withMaturities, withAssetPrice],
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
