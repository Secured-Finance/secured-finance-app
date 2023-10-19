import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import {
    withAppLayout,
    withAssetPrice,
    withWalletProvider,
} from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { EmergencyGlobalSettlement } from './EmergencyGlobalSettlement';

export default {
    title: 'Pages/EmergencyGlobalSettlement',
    component: EmergencyGlobalSettlement,
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
        connected: true,
    },
    decorators: [withAppLayout, withWalletProvider, withAssetPrice],
} as Meta<typeof EmergencyGlobalSettlement>;

const Template: StoryFn<typeof EmergencyGlobalSettlement> = () => (
    <EmergencyGlobalSettlement />
);

export const Default = Template.bind({});
export const SecondStep = Template.bind({});
SecondStep.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    (await canvas.findByText('Redeem')).click();
};
export const NotConnected = Template.bind({});
NotConnected.parameters = {
    connected: false,
};
