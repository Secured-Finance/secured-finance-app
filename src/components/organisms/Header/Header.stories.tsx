import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withChainErrorDisabled,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    decorators: [withWalletProvider, withChainErrorDisabled],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
};
