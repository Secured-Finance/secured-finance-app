import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CloseButton } from './CloseButton';

export default {
    title: 'Atoms/Toggle',
    component: CloseButton,
    args: {
        onClick: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CloseButton>;

const Template: ComponentStory<typeof CloseButton> = args => (
    <CloseButton onClick={args.onClick} />
);

export const Default = Template.bind({});
