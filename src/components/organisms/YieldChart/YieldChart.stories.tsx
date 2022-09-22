import { ComponentMeta, ComponentStory } from '@storybook/react';
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
            new Rate(100),
            new Rate(200),
            new Rate(300),
            new Rate(400),
            new Rate(500),
            new Rate(600),
        ],
    },
    argTypes: {},
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
