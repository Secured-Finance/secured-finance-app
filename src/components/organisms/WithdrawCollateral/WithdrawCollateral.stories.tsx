import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { WithdrawCollateral } from './WithdrawCollateral';

export default {
    title: 'Organism/WithdrawCollateral',
    component: WithdrawCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralList: {
            [CurrencySymbol.ETH]: {
                symbol: CurrencySymbol.ETH,
                available: 1,
                name: 'Ethereum',
            },
            [CurrencySymbol.WFIL]: {
                symbol: CurrencySymbol.WFIL,
                available: 100,
                name: 'filecoin',
            },
            [CurrencySymbol.USDC]: {
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },

            [CurrencySymbol.WBTC]: {
                symbol: CurrencySymbol.WBTC,
                available: 1.12349999,
                name: 'Bitcoin',
            },
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof WithdrawCollateral>;

const Template: StoryFn<typeof WithdrawCollateral> = args => {
    return <WithdrawCollateral {...args} />;
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = await screen.getByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: 100,
    });
};
