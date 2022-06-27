import { Meta, Story } from '@storybook/react';
import React from 'react';
import { filecoin, telegram } from '../icons';
import { Dropdown, IDropdown } from './';

export default {
    title: 'Components/Dropdown',
    component: Dropdown,
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

const Template: Story<IDropdown> = args => {
    const [value, setValue] = React.useState(args.value ?? '');

    return (
        <Dropdown
            {...args}
            onChange={e => {
                setValue(e.currentTarget.value);
            }}
            value={value}
        />
    );
};

const value = 1;
export const Default = Template.bind({});
Default.args = {
    options: [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two', icon: filecoin.toString() },
        { value: 3, label: 'Three looooong' },
        { value: 4, label: 'Long with icon', icon: telegram.toString() },
    ],
    value,
    label: '',
    noBorder: false,
};
