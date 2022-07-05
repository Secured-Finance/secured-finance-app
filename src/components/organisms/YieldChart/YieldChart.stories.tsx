import { ComponentMeta, ComponentStory } from '@storybook/react';
import { YieldChart } from './';

export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    args: {
        asset: 'USDC',
        isBorrow: true,
    },
    argTypes: {},
} as ComponentMeta<typeof YieldChart>;

const Template: ComponentStory<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
