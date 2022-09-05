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

export const LeftPortfolioTab = Template.bind({});
LeftPortfolioTab.args = {
    name: 'Net Value',
    value: '$8.02',
    orientation: 'left',
};

export const RightPortfolioTab = Template.bind({});
RightPortfolioTab.args = {
    name: 'Net Interest Accrued*',
    value: '$8.02',
    orientation: 'right',
};
