import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Itayose } from './Itayose';

export default {
    title: 'Pages/Itayose',
    component: Itayose,
    args: {},
    parameters: {
        chromatic: { delay: 2000 },
        connected: true,
    },
    decorators: [
        withAppLayout,
        withAssetPrice,
        withWalletProvider,
        withChainErrorDisabled,
    ],
} as Meta<typeof Itayose>;

const Template: StoryFn<typeof Itayose> = () => <Itayose />;

export const Default = Template.bind({});
export const MyOrders = Template.bind({});
MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('My Orders').click();
};
