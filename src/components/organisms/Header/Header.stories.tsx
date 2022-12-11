import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    decorators: [withWalletProvider],
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
