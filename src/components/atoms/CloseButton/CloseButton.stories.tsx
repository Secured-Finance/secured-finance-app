import type { Meta, StoryFn } from '@storybook/react';
import { CloseButton } from './CloseButton';

export default {
    title: 'Atoms/CloseButton',
    component: CloseButton,
    args: {
        onClick: () => {},
    },
} as Meta<typeof CloseButton>;

const Template: StoryFn<typeof CloseButton> = args => (
    <CloseButton onClick={args.onClick} />
);

export const Default = Template.bind({});
