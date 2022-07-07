import { WithWalletProvider } from '.storybook/decorators';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
