import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { FIGMA_STORYBOOK_LINK } from './constants';

export default {
    title: 'Atoms/Checkbox',
    component: Checkbox,
    args: {
        isChecked: true,
    },
    parameters: {
        viewport: {
            disable: true,
        },
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
    },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = args => {
    const [isChecked, setIsChecked] = useState(args.isChecked);
    const handleChange = (check: boolean) => {
        setIsChecked(check);
        args.onChange(check);
    };
    return <Checkbox {...args} isChecked={isChecked} onChange={handleChange} />;
};

export const Default = Template.bind({});

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
    isChecked: true,
};

export const Unchecked = Template.bind({});
Unchecked.args = {
    isChecked: false,
};
