import type { Meta, StoryFn } from '@storybook/react';
import { PercentageTab } from '.';

export default {
    title: 'Atoms/PercentageTab',
    component: PercentageTab,
    args: {
        percentage: 25,
        active: true,
        onClick: () => {},
    },
} as Meta<typeof PercentageTab>;

const Template: StoryFn<typeof PercentageTab> = args => (
    <PercentageTab {...args} />
);

export const Default = Template.bind({});
export const NotActiveTab = Template.bind({});
NotActiveTab.args = {
    percentage: 75,
    active: false,
    onClick: () => {},
};
