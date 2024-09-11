import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { FIGMA_STORYBOOK_LINK } from './constants';
import { CheckboxSizes } from './types';

export default {
    title: 'Atoms/Checkbox',
    component: Checkbox,
    args: {
        isChecked: true,
        onChange: () => {},
    },
    argTypes: {
        size: { control: 'radio', options: Object.values(CheckboxSizes) },
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

export const WithLabel = Template.bind({});
WithLabel.args = {
    label: 'Label',
};

export const Unchecked = Template.bind({});
Unchecked.args = {
    isChecked: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
    disabled: true,
    isChecked: true,
};

export const Checkboxes = () => {
    return (
        <div className='flex flex-col items-start gap-4'>
            <div className='flex flex-row gap-3'>
                <Checkbox
                    size={CheckboxSizes.sm}
                    isChecked={true}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.sm}
                    isChecked={false}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.sm}
                    isChecked={true}
                    disabled={true}
                    onChange={() => {}}
                />
            </div>
            <div className='flex flex-row gap-3'>
                <Checkbox
                    size={CheckboxSizes.md}
                    isChecked={true}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.md}
                    isChecked={false}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.md}
                    isChecked={true}
                    disabled={true}
                    onChange={() => {}}
                />
            </div>
            <div className='flex flex-row gap-3'>
                <Checkbox
                    size={CheckboxSizes.lg}
                    isChecked={true}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.lg}
                    isChecked={false}
                    onChange={() => {}}
                />
                <Checkbox
                    size={CheckboxSizes.lg}
                    isChecked={true}
                    disabled={true}
                    onChange={() => {}}
                />
            </div>
        </div>
    );
};
