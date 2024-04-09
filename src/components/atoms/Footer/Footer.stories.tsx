import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { Footer } from './Footer';

export default {
    title: 'Atoms/Footer',
    component: Footer,
    decorators: [withWalletProvider],
    parameters: {
        connected: true,
    },
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = () => <Footer />;

export const Default = Template.bind({});
export const NotConnected = Template.bind({});
NotConnected.parameters = {
    connected: false,
};
