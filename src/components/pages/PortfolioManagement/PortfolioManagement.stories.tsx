import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAppLayout,
    WithGraphClient,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { PortfolioManagement } from './PortfolioManagement';

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [WithAppLayout, WithWalletProvider, WithGraphClient],
} as ComponentMeta<typeof PortfolioManagement>;

const Template: ComponentStory<typeof PortfolioManagement> = () => (
    <PortfolioManagement />
);

export const Default = Template.bind({});

// TODO: Add a way to manage the connected state of the wallet with the Apollo client
// export const ConnectedToWallet = Template.bind({});
// ConnectedToWallet.parameters = {
//     connected: true,
// };
