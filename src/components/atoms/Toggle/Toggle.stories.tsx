import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './Toggle';

export default {
    title: 'Atoms/Toggle',
    component: Toggle,
    args: {
        checked: true,
        disabled: false,
    },
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = args => {
    const [checked, setChecked] = useState(args.checked);
    return (
        <Toggle
            checked={checked}
            disabled={args.disabled}
            onChange={setChecked}
        />
    );
};

export const Default = Template.bind({});
export const Checked = Template.bind({});
Checked.args = {
    checked: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};
