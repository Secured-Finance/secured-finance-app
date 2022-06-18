import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dialog } from './Dialog';

export default {
    title: 'Molecules/Dialog',
    component: Dialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = args => (
    <Dialog
        {...args}
        title='Modal Title'
        description='Description goes here. Try to keep message to not more than three lines.'
        callToAction='Ok'
        onClick={() => {}}
    >
        <p>
            This is the content but since it is a component, it can be styled as
            we want
        </p>
    </Dialog>
);

export const Primary = Template.bind({});
