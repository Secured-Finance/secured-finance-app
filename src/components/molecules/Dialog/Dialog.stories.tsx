import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dialog } from './Dialog';

export default {
    title: 'Molecules/Dialog',
    component: Dialog,
    args: {
        isOpen: true,
        onClose: () => {},
        onClick: () => {},
        title: 'Dialog Title',
        description:
            'Description goes here. Try to keep message to not more than three lines.',
        callToAction: 'Ok',
        parameters: {
            chromatic: { disableSnapshot: false },
        },
    },
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = args => (
    <Dialog {...args}>
        <p>
            This is the content but since it is a component, it can be styled as
            we want
        </p>
    </Dialog>
);

export const Default = Template.bind({});
export const NoButton = Template.bind({});
NoButton.args = {
    callToAction: '',
};
