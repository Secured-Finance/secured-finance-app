import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dialog } from './Dialog';

export default {
    title: 'Components/Molecules/Dialog',
    component: Dialog,
    args: {
        isOpen: true,
        onClose: () => {},
    },
} as ComponentMeta<typeof Dialog>;

const Template: ComponentStory<typeof Dialog> = args => (
    <Dialog
        {...args}
        title='This is the title'
        description='This is a great description, ususally this is a longer text'
        callToAction='Do Something'
        onClick={() => {}}
    >
        <p style={{ color: 'white' }}>
            This is the content but since it is a component, it can be styled as
            we want
        </p>
    </Dialog>
);

export const Primary = Template.bind({});
