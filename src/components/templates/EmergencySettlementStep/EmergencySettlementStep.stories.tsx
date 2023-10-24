import { Meta, StoryFn } from '@storybook/react';
import { EmergencySettlementStep } from './EmergencySettlementStep';

const children = <div className='h-24 bg-black-20 px-6'>children</div>;
export default {
    title: 'Templates/EmergencySettlementStep',
    component: EmergencySettlementStep,
    args: {
        step: '1. Do Something first',
        showStep: true,
        children: children,
    },
} as Meta<typeof EmergencySettlementStep>;

const Template: StoryFn<typeof EmergencySettlementStep> = args => (
    <EmergencySettlementStep {...args} />
);

export const Default = Template.bind({});
