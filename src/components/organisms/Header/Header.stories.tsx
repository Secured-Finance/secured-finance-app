import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import {
    withChainErrorDisabled,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {},
    decorators: [withWalletProvider, withChainErrorDisabled],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = () => <Header />;

export const Primary = Template.bind({});
export const Connected = Template.bind({});
Connected.parameters = {
    connected: true,
};

export const MenuExpanded = Template.bind({});
MenuExpanded.parameters = {
    chromatic: { viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET] },
    viewport: {
        ...RESPONSIVE_PARAMETERS,
        defaultViewport: 'mobile',
    },
};
MenuExpanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByRole('button', {
        name: 'Hamburger Menu',
    });
    await userEvent.click(button);
};
