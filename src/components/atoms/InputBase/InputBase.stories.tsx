import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof InputBase>;

const Template: ComponentStory<typeof InputBase> = args => {
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
