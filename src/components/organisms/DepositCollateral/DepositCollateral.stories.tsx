import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { DepositCollateral } from './DepositCollateral';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Organism/DepositCollateral',
    component: DepositCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralList: {
            [CurrencySymbol.ETH]: {
                symbol: CurrencySymbol.ETH,
                availableFullValue: BigInt('10000000000000000000'),
                available: 10,
                name: 'Ethereum',
            },
            [CurrencySymbol.USDC]: {
                symbol: CurrencySymbol.USDC,
                availableFullValue: BigInt('50000000'),
                available: 50,
                name: 'USDC',
            },
        },
    },
    decorators: [withWalletProvider],
} as Meta<typeof DepositCollateral>;

const Template: StoryFn<typeof DepositCollateral> = args => {
    return <DepositCollateral {...args} />;
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = await screen.findByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    });
};

export const DefaultCcySymbol = Template.bind({});
DefaultCcySymbol.args = {
    defaultCcySymbol: CurrencySymbol.ETH,
};
