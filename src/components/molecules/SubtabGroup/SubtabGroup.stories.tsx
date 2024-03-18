import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { SubtabGroup } from '.';

const options = ['Limit', 'Market'];
const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=435-5079&mode=dev';

export default {
    title: 'Molecules/SubtabGroup',
    component: SubtabGroup,
    args: {
        options: options,
        selectedOption: options[0],
    },
    parameters: {
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
    },
} as Meta<typeof SubtabGroup>;

const Template: StoryFn<typeof SubtabGroup> = args => {
    const [option, setOption] = useState(args.selectedOption);
    const handleClick = (newOption: string) => {
        setOption(newOption);
        args.handleClick(newOption);
    };
    return (
        <div className='max-w-[318px]'>
            <SubtabGroup
                {...args}
                selectedOption={option}
                handleClick={handleClick}
            />
        </div>
    );
};

export const Default = Template.bind({});

export const GroupOfThree = Template.bind({});
GroupOfThree.args = {
    options: ['Tab label', 'Label', 'Label 2'],
};

export const GroupOfFour = Template.bind({});
GroupOfFour.args = {
    options: ['Label', 'Label 2', 'Label 3', 'Label 4'],
};

// export const StyledButton = Template.bind({});
// StyledButton.args = {
//     options: ['Limit', 'Market', 'Stop'],
//     selectedOption: 'Market',
//     variant: 'StyledButton',
// };
