import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof StatsBox>;

const Template: ComponentStory<typeof StatsBox> = args => (
    <StatsBox {...args} />
);

export const Default = Template.bind({});
