import { ComponentMeta, ComponentStory } from '@storybook/react';
import { LiquidationProgressBar } from './LiquidationProgressBar';

export default {
    title: 'Molecules/LiquidationProgressBar',
    component: LiquidationProgressBar,
    args: {
        liquidationPercentage: 40,
    },
} as ComponentMeta<typeof LiquidationProgressBar>;

const Template: ComponentStory<typeof LiquidationProgressBar> = args => (
    <LiquidationProgressBar {...args} />
);

export const Default = Template.bind({});
