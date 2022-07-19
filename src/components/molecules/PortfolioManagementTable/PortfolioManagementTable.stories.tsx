import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PortfolioManagementTable } from './PortfolioManagementTable';

export default {
    title: 'Molecules/PortfolioManagementTable',
    component: PortfolioManagementTable,
    args: {
        values: ['$11,996', '20%', '1', '$3.25'],
    },
} as ComponentMeta<typeof PortfolioManagementTable>;

const Template: ComponentStory<typeof PortfolioManagementTable> = args => (
    <PortfolioManagementTable {...args} />
);

export const Default = Template.bind({});

export const NoWalletConnected = Template.bind({});
NoWalletConnected.args = {
    values: [],
};
