import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { DepositCollateral } from './DepositCollateral';

export default {
    title: 'Organism/DepositCollateral',
    component: DepositCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
    },
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => (
    <DepositCollateral {...args} />
);

export const Primary = Template.bind({});
