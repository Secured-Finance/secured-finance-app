import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Closable } from './Closable';

export default {
    title: 'Templates/Closable',
    component: Closable,
    args: {
        children: <div className='text-white'>This is a Great Tab Content</div>,
        onClose: () => {},
    },
} as ComponentMeta<typeof Closable>;

const Template: ComponentStory<typeof Closable> = args => (
    <Closable {...args} />
);

export const Default = Template.bind({});
