import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { RadioGroupSelector } from '.';

export default {
    title: 'Atoms/RadioGroupSelector',
    component: RadioGroupSelector,
    args: {
        options: ['Lend', 'Borrow'],
        selectedOption: 'Lend',
        variant: 'NavTab',
    },
} as Meta<typeof RadioGroupSelector>;

const Template: StoryFn<typeof RadioGroupSelector> = args => {
    const [option, setOption] = useState(args.selectedOption);
    const handleClick = (newOption: string) => {
        setOption(newOption);
        args.handleClick(newOption);
    };
    return (
        <RadioGroupSelector
            {...args}
            selectedOption={option}
            handleClick={handleClick}
        />
    );
};

export const NavTab = Template.bind({});
export const StyledButton = Template.bind({});
StyledButton.args = {
    options: ['Limit', 'Market', 'Stop'],
    selectedOption: 'Market',
    variant: 'StyledButton',
};
