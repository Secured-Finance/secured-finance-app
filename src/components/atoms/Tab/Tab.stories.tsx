import type { Meta, StoryFn } from '@storybook/react';
import { Tab, TabVariant } from '.';

export default {
    title: 'Atoms/Tab',
    component: Tab,
    args: {
        text: 'Tab',
        active: true,
        variant: TabVariant.Blue,
    },
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof Tab>;

const Template: StoryFn<typeof Tab> = args => (
    <div className='max-w-[175px]'>
        <Tab {...args} />
    </div>
);

export const Default = Template.bind({});
Default.args = {
    text: 'Blue',
};

export const Lend = Template.bind({});
Lend.args = {
    text: 'Lend/Buy',
    variant: TabVariant.Lend,
};

export const Borrow = Template.bind({});
Borrow.args = {
    text: 'Borrow/Sell',
    variant: TabVariant.Borrow,
};

export const Neutral = Template.bind({});
Neutral.args = {
    text: 'Neutral',
    variant: TabVariant.Neutral,
};

export const Inactive = Template.bind({});
Inactive.args = {
    text: 'Inactive',
    active: false,
};
