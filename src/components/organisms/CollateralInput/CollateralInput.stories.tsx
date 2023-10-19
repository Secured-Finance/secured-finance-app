import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';

import { useState } from 'react';
import { CurrencySymbol, amountFormatterFromBase } from 'src/utils';
import { CollateralInput } from './CollateralInput';

const asset = CurrencySymbol.ETH;

export default {
    title: 'Organism/CollateralInput',
    component: CollateralInput,
    args: {
        price: 100,
        availableAmount: 10,
        asset: asset,
    },
} as Meta<typeof CollateralInput>;

const Template: StoryFn<typeof CollateralInput> = args => {
    const [value, setValue] = useState(args.amount);
    const handleAmountChange = (newValue: bigint | undefined) => {
        setValue(
            newValue ? amountFormatterFromBase[asset](newValue) : undefined
        );
    };
    return (
        <CollateralInput
            {...args}
            amount={value}
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
        delay: 100,
    });
};
