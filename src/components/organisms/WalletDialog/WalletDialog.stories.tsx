import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { WalletDialog } from './WalletDialog';

export default {
    title: 'Organism/WalletDialog',
    component: WalletDialog,
    decorators: [withWalletProvider],
} as ComponentMeta<typeof WalletDialog>;

const Template: ComponentStory<typeof WalletDialog> = () => <WalletDialog />;

export const Primary = Template.bind({});
