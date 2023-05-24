import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PortfolioManagementTable } from './PortfolioManagementTable';

export default {
    title: 'Molecules/PortfolioManagementTable',
    component: PortfolioManagementTable,
    args: {
        values: ['$11,996', '10', '$1100.25', '$1113.25'],
    },
} as ComponentMeta<typeof PortfolioManagementTable>;

const Template: ComponentStory<typeof PortfolioManagementTable> = args => (
    <PortfolioManagementTable {...args} />
);

export const Default = Template.bind({});
