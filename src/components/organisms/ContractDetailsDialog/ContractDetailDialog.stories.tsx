import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ContractDetailDialog } from './ContractDetailDialog';

export default {
    title: 'Organism/ContractDetailDialog',
    component: ContractDetailDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as ComponentMeta<typeof ContractDetailDialog>;

const Template: ComponentStory<typeof ContractDetailDialog> = args => (
    <ContractDetailDialog {...args} />
);

export const Default = Template.bind({});
