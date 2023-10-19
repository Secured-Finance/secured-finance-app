import type { Meta, StoryFn } from '@storybook/react';

import { ColorBar } from './ColorBar';

export default {
    title: 'Atoms/ColorBar',
    component: ColorBar,
    args: {
        value: BigInt(100000),
        total: BigInt(1000000),
        color: 'negative',
        align: 'left',
    },
    argTypes: {
        value: { control: 'number', defaultValue: 100000 },
        total: { control: 'number', defaultValue: 1000000 },
        color: {
            control: {
                type: 'select',
                options: ['positive', 'negative', 'neutral'],
            },
        },
        align: { control: { type: 'select', options: ['left', 'right'] } },
    },
} as Meta<typeof ColorBar>;

const Template: StoryFn<typeof ColorBar> = args => (
    <div className='relative h-12 w-2/3'>
        <ColorBar {...args} />
    </div>
);

export const Default = Template.bind({});
