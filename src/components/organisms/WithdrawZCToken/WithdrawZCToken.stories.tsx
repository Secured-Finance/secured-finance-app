import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { WithdrawZCToken } from './WithdrawZCToken';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Organism/WithdrawZCToken',
    component: WithdrawZCToken,
    args: {
        isOpen: true,
        onClose: () => {},
        zcBondList: {
            USDC: {
                symbol: CurrencySymbol.USDC,
                key: 'USDC',
                availableAmount: BigInt('1250000000'),
                availableTokenAmount: BigInt('1250000000000000000000000'),
            },
            'USDC-JUN2024': {
                symbol: CurrencySymbol.USDC,
                key: 'USDC-JUN2024',
                availableAmount: BigInt('1000000000'),
                availableTokenAmount: BigInt('1000000000'),
                maturity: new Maturity(1719532800),
            },
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof WithdrawZCToken>;

const Template: StoryFn<typeof WithdrawZCToken> = args => {
    return <WithdrawZCToken {...args} />;
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = await screen.findByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    });
};
