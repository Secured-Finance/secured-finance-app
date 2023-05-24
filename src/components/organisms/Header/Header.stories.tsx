import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withChainErrorDisabled,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CHROMATIC_VIEWPORTS } from 'src/../.storybook/preview';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    decorators: [withWalletProvider, withChainErrorDisabled],
    parameters: {
        layout: 'fullscreen',
        chromatic: { CHROMATIC_VIEWPORTS },
    },
} as ComponentMeta<typeof Header>;

const Template: ComponentStory<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
