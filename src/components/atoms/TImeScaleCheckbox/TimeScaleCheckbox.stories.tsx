import { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { TimeScaleCheckBoxSizes } from './constant';
import { TimeScaleCheckBox } from './TimeScaleCheckbox';

export default {
    title: 'Atoms/TimeScaleCheckBox',
    component: TimeScaleCheckBox,
    args: {
        isChecked: false,
        disabled: false,
        label: '1H',
        size: TimeScaleCheckBoxSizes.md,
    },
} as Meta<typeof TimeScaleCheckBox>;

const Template: StoryFn<typeof TimeScaleCheckBox> = args => {
    const [isChecked, setIsChecked] = useState(args.isChecked);
    const handleChange = (check: boolean) => {
        setIsChecked(check);
        args.onChange(check);
    };
    return (
        <TimeScaleCheckBox
            {...args}
            isChecked={isChecked}
            onChange={handleChange}
        />
    );
};

export const Default = Template.bind({});

export const Checked = Template.bind({});
Checked.args = {
    isChecked: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
};

export const LargeSize = Template.bind({});
LargeSize.args = {
    size: TimeScaleCheckBoxSizes.lg,
};

export const WithoutLabel = Template.bind({});
WithoutLabel.args = {
    label: '',
};
