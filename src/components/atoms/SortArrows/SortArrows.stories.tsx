import type { Meta, StoryFn } from '@storybook/react';
import { SortArrows } from './SortArrows';

export default {
    title: 'Atoms/SortArrows',
    component: SortArrows,
    args: {
        isSorted: false,
    },
} as Meta<typeof SortArrows>;

const Template: StoryFn<typeof SortArrows> = args => <SortArrows {...args} />;

export const Default = Template.bind({});
export const Ascending = Template.bind({});
Ascending.args = {
    isSorted: 'asc',
};
export const Descending = Template.bind({});
Descending.args = {
    isSorted: 'desc',
};
