import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { DepositZCToken } from './DepositZCToken';

export default {
    title: 'Organism/DepositZCToken',
    component: DepositZCToken,
    args: {
        isOpen: true,
        onClose: () => {},
        currencyList: [CurrencySymbol.USDC, CurrencySymbol.ETH],
    },
    decorators: [withWalletProvider],
} as Meta<typeof DepositZCToken>;

const Template: StoryFn<typeof DepositZCToken> = args => {
    return <DepositZCToken {...args} />;
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = await screen.findByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: 100,
    });
};
