import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';

import { RadioButton } from './RadioButton';

export default {
    title: 'Atoms/RadioButton',
    component: RadioButton,
    args: {
        options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' },
        ],
        value: 'option1',
        onChange: () => {},
    },
} as Meta<typeof RadioButton>;

const StatefulTemplate: StoryFn<typeof RadioButton> = args => {
    const [value, setValue] = useState(args.value);

    const handleChange = (newValue: string) => {
        setValue(newValue);
        args.onChange(newValue);
    };

    return <RadioButton {...args} value={value} onChange={handleChange} />;
};

export const Default = StatefulTemplate.bind({});
