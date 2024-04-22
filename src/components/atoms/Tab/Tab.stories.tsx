import { FireIcon } from '@heroicons/react/24/solid';
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

export const WithSuffix = Template.bind({});
WithSuffix.args = {
    text: 'With Suffix',
    suffixEle: (
        <span
            className='bg-warning-300/35 flex items-center gap-1 rounded-[5px] border border-warning-300 px-1.5 py-0.5 text-2xs leading-[1.3] text-warning-300'
            data-testid='tab-suffix'
        >
            New <FireIcon className='h-2.5 w-2.5' />
        </span>
    ),
};

export const Inactive = Template.bind({});
Inactive.args = {
    text: 'Inactive',
    active: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
    text: 'Disabled',
    active: true,
    disabled: true,
};
