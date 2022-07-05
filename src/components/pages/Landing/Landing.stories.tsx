import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAppLayout,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    args: {},
    decorators: [WithAppLayout, WithWalletProvider],
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = () => <Landing />;

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
