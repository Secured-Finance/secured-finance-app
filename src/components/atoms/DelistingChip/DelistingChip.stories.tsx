import { Meta, StoryFn } from '@storybook/react';
import { DelistingChip } from './DelistingChip';

export default {
    title: 'Atoms/DelistedChip',
    component: DelistingChip,
    args: {},
} as Meta<typeof DelistingChip>;

const Template: StoryFn<typeof DelistingChip> = () => <DelistingChip />;

export const Default = Template.bind({});
