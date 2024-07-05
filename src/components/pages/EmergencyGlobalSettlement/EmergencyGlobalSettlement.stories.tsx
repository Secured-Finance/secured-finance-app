import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withAppLayout, withWalletProvider } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
import { EmergencyGlobalSettlement } from './EmergencyGlobalSettlement';

export default {
    title: 'Pages/EmergencyGlobalSettlement',
    component: EmergencyGlobalSettlement,
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
        connected: true,
        apolloClient: {
            mocks: mockDailyVolumes,
        },
    },
    decorators: [withAppLayout, withWalletProvider],
} as Meta<typeof EmergencyGlobalSettlement>;

const Template: StoryFn<typeof EmergencyGlobalSettlement> = () => (
    <EmergencyGlobalSettlement />
);

export const Default = Template.bind({});
export const NotConnected = Template.bind({});
NotConnected.parameters = {
    connected: false,
};
