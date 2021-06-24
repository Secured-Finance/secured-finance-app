import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Dropdown, IDropdown } from 'src/components/new/Dropdown';
import { filecoin, telegram } from 'src/components/new/icons';

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
                setValue(e.target.value);
            }}
            value={value}
        />
    );
};

let value = 1;
export const Default = Template.bind({});
Default.args = {
    options: [
        { value: 1, label: 'One' },
        { value: 2, label: 'Two', icon: filecoin },
        { value: 3, label: 'Three looooong' },
        { value: 4, label: 'Long with icon', icon: telegram },
    ],
    value,
    label: '',
    noBorders: false,
};
