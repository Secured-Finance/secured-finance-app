import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { TableHeader } from './TableHeader';

export default {
    title: 'Molecules/TableHeader',
    component: TableHeader,
    args: {
        title: 'Title',
    },
    parameters: {
        chromatic: { delay: 3000 },
    },
} as Meta<typeof TableHeader>;

const Template: StoryFn<typeof TableHeader> = args => (
    <div className='typography-caption-2 h-14 w-1/3 border-b border-white-10 px-6 py-4 text-slateGray'>
        <TableHeader {...args} />
    </div>
);

export const Default = Template.bind({});
export const Sorting = Template.bind({});
Sorting.args = {
    ...Default.args,
    sortingHandler: () => {},
    isSorted: true,
};

export const Aligned = Template.bind({});
Aligned.args = {
    ...Default.args,
    align: 'right',
};

export const TitleHint = Template.bind({});
TitleHint.args = {
    ...Default.args,
    titleHint: 'This is a title hint.',
};
TitleHint.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.unhover(button);
    await userEvent.hover(button);
};
