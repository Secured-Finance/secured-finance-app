import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PortfolioManagementTabs } from './PortfolioManagementTabs';

export default {
    title: 'Organism/PortfolioManagementTabs',
    component: PortfolioManagementTabs,
    args: {},
} as ComponentMeta<typeof PortfolioManagementTabs>;

const Template: ComponentStory<typeof PortfolioManagementTabs> = () => (
    <PortfolioManagementTabs />
);

export const Primary = Template.bind({});
