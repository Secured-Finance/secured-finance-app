import { ComponentMeta, ComponentStory } from '@storybook/react';
import { InformationPopover } from './InformationPopover';

export default {
    title: 'Atoms/InformationPopover',
    component: InformationPopover,
} as ComponentMeta<typeof InformationPopover>;

const Template: ComponentStory<typeof InformationPopover> = () => (
    <InformationPopover>
        You are currently at 43% to liquidation.
    </InformationPopover>
);

export const Default = Template.bind({});
