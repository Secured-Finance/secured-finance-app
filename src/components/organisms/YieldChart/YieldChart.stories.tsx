import { ComponentMeta, ComponentStory } from '@storybook/react';
import { YieldChart } from './';

export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    chromatic: { diffThreshold: 1, delay: 500 },
    args: {
        asset: 'USDC',
        isBorrow: true,
        rates: [100, 200, 300, 400, 500, 600],
    },
    argTypes: {},
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
