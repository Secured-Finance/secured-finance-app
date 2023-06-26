import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Itayose } from './Itayose';

export default {
    title: 'Pages/Itayose',
    component: Itayose,
    args: {},
    parameters: {
        chromatic: { delay: 1000 },
        connected: true,
    },
    decorators: [
        withAppLayout,
        withMaturities,
        withAssetPrice,
        withWalletProvider,
        withChainErrorDisabled,
    ],
} as ComponentMeta<typeof Itayose>;

const Template: ComponentStory<typeof Itayose> = () => <Itayose />;

export const Default = Template.bind({});
export const MyOrders = Template.bind({});
MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('My Orders').click();
};
