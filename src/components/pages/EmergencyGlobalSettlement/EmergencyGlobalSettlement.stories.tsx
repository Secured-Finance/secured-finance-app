import { Meta, StoryFn } from '@storybook/react';
import { EmergencyGlobalSettlement } from './EmergencyGlobalSettlement';

export default {
    title: 'Pages/EmergencyGlobalSettlement',
    component: EmergencyGlobalSettlement,
    args: {},
} as Meta<typeof EmergencyGlobalSettlement>;

const Template: StoryFn<typeof EmergencyGlobalSettlement> = () => (
    <EmergencyGlobalSettlement />
);

export const Default = Template.bind({});
