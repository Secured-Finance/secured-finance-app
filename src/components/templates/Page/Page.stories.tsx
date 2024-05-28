import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import { Page } from './Page';

const Content = ({
    color,
    content,
}: {
    color: 'red' | 'green';
    content: string;
}) => <div className={`bg-${color} p-10 text-white`}>{content}</div>;

export default {
    title: 'Templates/Page',
    component: Page,
    args: {
        title: 'Title',
        children: <Content color='red' content='Content' />,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Page>;

const Template: StoryFn<typeof Page> = args => <Page {...args} />;

export const Default = Template.bind({});

export const WithMultipleChildren = Template.bind({});
WithMultipleChildren.args = {
    children: (
        <>
            <Content color='red' content='Child 1' />
            <Content color='green' content='Child 2' />
            <Content color='red' content='Child 3' />
        </>
    ),
};
