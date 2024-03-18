import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { TabVariant } from 'src/components/atoms';
import { TabGroup } from '.';

export default {
    title: 'Molecules/TabGroup',
    component: TabGroup,
    args: {
        options: [
            { text: 'Lend', variant: TabVariant.Lend },
            { text: 'Borrow', variant: TabVariant.Borrow },
        ],
        selectedOption: 'Lend',
    },
} as Meta<typeof TabGroup>;

const Template: StoryFn<typeof TabGroup> = args => {
    const [option, setOption] = useState(args.selectedOption);
    const handleClick = (newOption: string) => {
        setOption(newOption);
        args.handleClick(newOption);
    };
    return (
        <div className='max-w-[350px]'>
            <TabGroup
                {...args}
                selectedOption={option}
                handleClick={handleClick}
            />
        </div>
    );
};

export const Default = Template.bind({});
