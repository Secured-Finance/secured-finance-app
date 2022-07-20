import { ComponentMeta, ComponentStory } from '@storybook/react';
import { PercentageTab } from '.';

export default {
    title: 'Atoms/PercentageTab',
    component: PercentageTab,
    args: {
        percentage: 25,
        active: true,
        onClick: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof PercentageTab>;

const Template: ComponentStory<typeof PercentageTab> = args => (
    <PercentageTab {...args} />
);

export const Default = Template.bind({});
export const NotActiveTab = Template.bind({});
NotActiveTab.args = {
    percentage: 75,
    active: false,
    onClick: () => {},
};
