import type { Meta, StoryFn } from '@storybook/react';
import { StatsBox } from '.';

export default {
    title: 'Atoms/StatsBox',
    component: StatsBox,
    args: {
        name: 'Net APR',
        value: '$8.02',
        orientation: 'center',
    },
    parameters: {
        chromatic: { delay: 3000 },
    },
} as Meta<typeof StatsBox>;

const Template: StoryFn<typeof StatsBox> = args => <StatsBox {...args} />;

export const Default = Template.bind({});
