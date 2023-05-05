import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Spinner } from './Spinner';

export default {
    title: 'Atoms/Spinner',
    component: Spinner,
    args: {},
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = () => <Spinner />;

export const Default = Template.bind({});
