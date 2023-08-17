import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { useState } from 'react';
import { InputBase } from '.';

export default {
    title: 'Atoms/InputBase',
    component: InputBase,
    args: {
        className:
            'typography-headline-4 h-14 w-full text-center text-neutral-8',
        onValueChange: () => {},
    },
} as Meta<typeof InputBase>;

const Template: StoryFn<typeof InputBase> = args => {
    const [value, setValue] = useState(args.value);
    const handleChange = (newValue: number | undefined) => {
        setValue(newValue);
        args.onValueChange(newValue);
    };
    return <InputBase {...args} value={value} onValueChange={handleChange} />;
};

export const Default = Template.bind({});
export const WithValue = Template.bind({});
WithValue.args = {
    value: 50,
};

export const DecimalPlacesAllowed = Template.bind({});
DecimalPlacesAllowed.args = {
    decimalPlacesAllowed: 2,
};

export const MaxLimit = Template.bind({});
MaxLimit.args = {
    maxLimit: 1000,
};

export const LongInput = Template.bind({});
LongInput.args = {
    sizeDependentStyles: {
        shortText: { maxChar: 5, styles: 'text-3xl' },
        mediumText: { maxChar: 15, styles: 'text-2xl' },
        longText: { maxChar: Infinity, styles: 'text-xl' },
    },
};
LongInput.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '123456789.123', {
        delay: 100,
    });
};
