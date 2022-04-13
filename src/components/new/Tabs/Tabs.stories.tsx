import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Tabs, ITabs } from './';

export default {
    title: 'Components/Tabs',
    argTypes: { onClick: { action: 'clicked' } },
} as Meta;

const Template: Story<ITabs> = args => {
    const [selected, setValue] = React.useState(args.selected ?? '');

    return <Tabs {...args} onChange={setValue} selected={selected} />;
};

export const Default = Template.bind({});
Default.args = {
    options: [
        { value: '1', label: 'Tab 1' },
        {
            value: '2',
            label: 'Tab 2',
        },
        {
            value: '3',
            label: 'Tab 3',
        },
        {
            value: '4',
            label: 'Tab 4',
        },
    ],
    selected: null,
    large: false,
};
