import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { useState } from 'react';
import { CurrencySymbol } from 'src/utils';
import { CollateralInput } from './CollateralInput';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

const asset = CurrencySymbol.ETH;

export default {
    title: 'Organism/CollateralInput',
    component: CollateralInput,
    args: {
        price: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
        availableAmount: 10,
        asset: asset,
        setFullCoverage: () => {},
    },
} as Meta<typeof CollateralInput>;

const Template: StoryFn<typeof CollateralInput> = args => {
    const [value, setValue] = useState(args.amount);
    const [isFullCoverage, setIsFullCoverage] = useState<boolean>(
        args.fullCoverage
    );
    const handleAmountChange = (newValue: string | undefined) => {
        setValue(newValue);
    };
    const handleCoverage = (value: boolean) => {
        setIsFullCoverage(value);
        args.setFullCoverage(value);
        if (value) {
            setValue(args.availableAmount.toString());
        }
    };

    return (
        <CollateralInput
            {...args}
            amount={value}
            onAmountChange={handleAmountChange}
            fullCoverage={isFullCoverage}
            setFullCoverage={handleCoverage}
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
