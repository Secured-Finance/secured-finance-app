import { ComponentMeta, ComponentStory } from '@storybook/react';
import { FilWalletDialog } from './FilWalletDialog';

export default {
    title: 'Organism/FilWalletDialog',
    component: FilWalletDialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as ComponentMeta<typeof FilWalletDialog>;

const Template: ComponentStory<typeof FilWalletDialog> = args => (
    <FilWalletDialog {...args} />
);

export const Default = Template.bind({});
