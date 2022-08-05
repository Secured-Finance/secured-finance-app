import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Tab } from './Tab';

export default {
    title: 'Molecules/Tab',
    component: Tab,
    args: {
        isOpen: true,
        onClose: () => {},
        onClick: () => {},
        title: 'Tab Title',
        description:
            'Description goes here. Try to keep message to not more than three lines.',
        callToAction: 'Ok',
        parameters: {
            chromatic: { disableSnapshot: false },
        },
    },
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = args => (
    <Tab {...args}>
        <p className='body1 text-white-70'>
            This is the content but since it is a component, it can be styled as
            we want
        </p>
    </Tab>
);

export const Default = Template.bind({});
