import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Header } from './';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {
        showNavigation: true,
    },
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = args => <Header {...args} />;

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

export const WithoutNavigation = Template.bind({});
WithoutNavigation.args = {
    showNavigation: false,
};
WithoutNavigation.parameters = {
    chromatic: { viewports: [VIEWPORTS.LAPTOP] },
};
