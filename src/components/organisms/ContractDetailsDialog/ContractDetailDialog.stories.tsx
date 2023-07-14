import type { Meta, StoryFn } from '@storybook/react';
import { ContractDetailDialog } from './ContractDetailDialog';

export default {
    title: 'Organism/ContractDetailDialog',
    component: ContractDetailDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as Meta<typeof ContractDetailDialog>;

const Template: StoryFn<typeof ContractDetailDialog> = args => (
    <ContractDetailDialog {...args} />
);

export const Default = Template.bind({});
