import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { useState } from 'react';
import { CurrencySymbol } from 'src/utils';
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
    const [isFullCoverage, setIsFullCoverage] = useState<boolean>(
        args.fullCoverage
    );
    const handleAmountChange = (newValue: string | undefined) => {
        setValue(newValue);
    };
    return (
        <CollateralInput
            {...args}
            amount={value}
            onAmountChange={handleAmountChange}
            fullCoverage={isFullCoverage}
            setFullCoverage={setIsFullCoverage}
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
