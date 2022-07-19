import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PercentageSelector } from '.';

export default {
    title: 'Molecules/PercentageSelector',
    component: PercentageSelector,
    args: {
        onClick: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof PercentageSelector>;

const Template: ComponentStory<typeof PercentageSelector> = args => (
    <PercentageSelector {...args} />
);

export const Default = Template.bind({});
