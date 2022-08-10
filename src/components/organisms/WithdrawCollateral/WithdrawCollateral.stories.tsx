import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { WithdrawCollateral } from './WithdrawCollateral';

export default {
    title: 'Organism/WithdrawCollateral',
    component: WithdrawCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
    },
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof WithdrawCollateral>;

const Template: ComponentStory<typeof WithdrawCollateral> = args => (
    <WithdrawCollateral {...args} />
);

export const Primary = Template.bind({});
