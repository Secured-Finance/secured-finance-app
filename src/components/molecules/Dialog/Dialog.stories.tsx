import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
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
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof Dialog>;

const Template: StoryFn<typeof Dialog> = args => (
    <Dialog {...args}>
        <p className='body1 text-white-70'>
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

export const WithCancelButton = Template.bind({});
WithCancelButton.args = {
    showCancelButton: true,
};
