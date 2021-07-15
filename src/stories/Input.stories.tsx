import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Input, IInput } from 'src/components/new/Input';

export default {
    title: 'Components/Input',
    component: Input,
} as Meta;

const Template: Story<IInput> = args => {
    const [value, setValue] = React.useState(args.value ?? '');

    return (
        <Input
            {...args}
            onChange={e => {
                setValue(e.target.value);
            }}
            value={value}
        />
    );
};

export const Default = Template.bind({});
Default.args = {
    label: 'Test input',
    value: 'Test',
    placeholder: '',
    type: 'string',
    noBorder: false,
    alignRight: false,
    readOnly: false,
    disabled: false,
};
