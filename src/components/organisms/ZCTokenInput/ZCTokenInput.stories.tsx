import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { useState } from 'react';
import { jun23Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { ZCTokenInput } from './ZCTokenInput';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

const asset = CurrencySymbol.ETH;

export default {
    title: 'Organism/ZCTokenInput',
    component: ZCTokenInput,
    args: {
        price: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
        availableTokenAmount: BigInt('10000000000000000000'),
        availableAmount: BigInt('10000000000000000000'),
        symbol: asset,
        amount: BigInt('0'),
        maturity: jun23Fixture,
    },
} as Meta<typeof ZCTokenInput>;

const Template: StoryFn<typeof ZCTokenInput> = args => {
    const [value, setValue] = useState(args.amount);
    const handleAmountChange = (newValue: bigint | undefined) => {
        setValue(newValue);
    };
    return (
        <ZCTokenInput
            {...args}
            amount={value}
            maturity={jun23Fixture}
            onAmountChange={handleAmountChange}
        />
    );
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.args = {
    amount: undefined,
};
LongInput.play = async () => {
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
    });
};
