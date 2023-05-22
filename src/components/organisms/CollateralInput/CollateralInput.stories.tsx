import { ComponentMeta, ComponentStory } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { useState } from 'react';
import { CurrencySymbol } from 'src/utils';
import { CollateralInput } from './CollateralInput';

export default {
    title: 'Organism/CollateralInput',
    component: CollateralInput,
    args: {
        price: 100,
        availableAmount: 10,
        asset: CurrencySymbol.ETH,
        amount: 100,
        setAmount: () => {},
    },
} as ComponentMeta<typeof CollateralInput>;

const Template: ComponentStory<typeof CollateralInput> = args => {
    const [value, setValue] = useState(args.amount);
    const handleChange = (newValue: number | undefined) => {
        setValue(newValue);
        args.setAmount(newValue);
    };
    return (
        <CollateralInput {...args} amount={value} setAmount={handleChange} />
    );
};

export const Default = Template.bind({});

export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{backspace}');
    await userEvent.type(input, '123456789.123', {
        delay: 100,
    });
};
