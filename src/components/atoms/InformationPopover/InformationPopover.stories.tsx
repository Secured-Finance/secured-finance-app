import { ComponentMeta, ComponentStory } from '@storybook/react';
import { InformationPopover } from './InformationPopover';

export default {
    title: 'Atoms/InformationPopover',
    component: InformationPopover,
    args: {
        text: 'You are currently at 43% to liquidation.',
    },
} as ComponentMeta<typeof InformationPopover>;

const Template: ComponentStory<typeof InformationPopover> = args => (
    <InformationPopover {...args} />
);

export const Default = Template.bind({});
