import { withEthBalance, withWalletProvider } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { MyWalletWidget } from './MyWalletWidget';

export default {
    title: 'Organism/MyWalletWidget',
    component: MyWalletWidget,
    args: {},
    decorators: [withWalletProvider, withEthBalance],
} as Meta<typeof MyWalletWidget>;

const Template: StoryFn<typeof MyWalletWidget> = () => <MyWalletWidget />;

export const Default = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
    chromatic: { delay: 500 },
};
