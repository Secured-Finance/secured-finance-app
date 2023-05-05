import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PortfolioTab } from '.';

export default {
    title: 'Atoms/PortfolioTab',
    component: PortfolioTab,
    args: {
        name: 'Net APR',
        value: '$8.02',
        orientation: 'center',
    },
} as ComponentMeta<typeof PortfolioTab>;

const Template: ComponentStory<typeof PortfolioTab> = args => (
    <PortfolioTab {...args} />
);

export const Default = Template.bind({});
