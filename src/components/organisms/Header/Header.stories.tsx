import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import {
    withChainErrorEnabled,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import Header from './Header';

const FIGMA_STORYBOOK_LINK =
    'https://www.figma.com/file/YIBsk1ihFbPlDb8XldGj1T/SF-Design-System?type=design&node-id=182-2672&mode=dev';

export default {
    title: 'Organism/Header',
    component: Header,
    args: {
        showNavigation: true,
    },
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        viewport: {
            disable: true,
        },
        design: {
            type: 'figma',
            url: FIGMA_STORYBOOK_LINK,
        },
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

export const WithChainError = Template.bind({});
WithChainError.decorators = [withChainErrorEnabled];
