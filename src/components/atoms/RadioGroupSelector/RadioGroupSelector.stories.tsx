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

export const NavTabWithOptionsStyles = Template.bind({});

NavTabWithOptionsStyles.args = {
    ...NavTabWithOptionsStyles.args,
    optionsStyles: [
        {
            bgColor: 'bg-nebulaTeal',
            textClass: 'text-secondary3 font-semibold',
            gradient: {
                from: 'from-tabGradient-4',
                to: 'to-tabGradient-3',
            },
        },
        {
            bgColor: 'bg-error5',
            textClass: 'text-galacticOrange font-semibold',
            gradient: {
                from: 'from-tabGradient-6',
                to: 'to-tabGradient-5',
            },
        },
    ],
};

export const StyledButton = Template.bind({});
StyledButton.args = {
    options: ['Limit', 'Market', 'Stop'],
    selectedOption: 'Market',
    variant: 'StyledButton',
};
