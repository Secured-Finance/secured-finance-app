import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import {
    withAppLayout,
    withAssetPrice,
    withWalletProvider,
} from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
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
export const NotConnected = Template.bind({});
NotConnected.parameters = {
    connected: false,
};
