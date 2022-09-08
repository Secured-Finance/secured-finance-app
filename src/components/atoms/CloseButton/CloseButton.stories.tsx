import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CloseButton } from './CloseButton';

export default {
    title: 'Atoms/CloseButton',
    component: CloseButton,
    args: {
        onClick: () => {},
    },
} as ComponentMeta<typeof CloseButton>;

const Template: ComponentStory<typeof CloseButton> = args => (
    <CloseButton onClick={args.onClick} />
);

export const Default = Template.bind({});
