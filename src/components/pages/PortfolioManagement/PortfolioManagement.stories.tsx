import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAppLayout,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { PortfolioManagement } from './PortfolioManagement';

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [WithAppLayout, WithWalletProvider],
} as ComponentMeta<typeof PortfolioManagement>;

const Template: ComponentStory<typeof PortfolioManagement> = () => (
    <GraphClientProvider network={'4'}>
        <PortfolioManagement />
    </GraphClientProvider>
);

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
