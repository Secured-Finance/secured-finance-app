import type { Meta, StoryFn } from '@storybook/react';
import { HighlightChip } from './HighlightChip';

export default {
    title: 'Atoms/HighlightChip',
    component: HighlightChip,
    args: {
        text: 'NEW',
    },
} as Meta<typeof HighlightChip>;

const Template: StoryFn<typeof HighlightChip> = args => (
    <HighlightChip {...args} />
);

export const Default = Template.bind({});

export const SmallHighlightChip = Template.bind({});
SmallHighlightChip.args = {
    size: 'small',
};
