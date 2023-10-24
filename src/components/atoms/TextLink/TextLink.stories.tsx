import { Meta, StoryFn } from '@storybook/react';
import { TextLink } from './TextLink';

export default {
    title: 'Atoms/TextLink',
    component: TextLink,
    args: {
        href: 'https://www.google.com',
        text: 'Google',
    },
} as Meta<typeof TextLink>;

const Template: StoryFn<typeof TextLink> = args => <TextLink {...args} />;

export const Default = Template.bind({});
