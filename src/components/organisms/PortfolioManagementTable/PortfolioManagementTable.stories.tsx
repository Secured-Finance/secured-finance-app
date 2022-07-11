import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PortfolioManagementTable } from './PortfolioManagementTable';

export default {
    title: 'Organism/PortfolioManagementTable',
    component: PortfolioManagementTable,
    args: {},
} as ComponentMeta<typeof PortfolioManagementTable>;

const Template: ComponentStory<typeof PortfolioManagementTable> = () => (
    <PortfolioManagementTable />
);

export const Primary = Template.bind({});
