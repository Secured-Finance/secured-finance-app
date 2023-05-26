import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import {
    withChainErrorDisabled,
    withWalletProvider,
} from '.storybook/decorators';
import { expect } from '@storybook/jest';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
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

export const MenuExpanded = Template.bind({});
MenuExpanded.parameters = {
    chromatic: { viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET] },
};
MenuExpanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Hamburger Menu' }).click();
    await expect(
        canvas.getByRole('link', { name: 'Market Dashboard' })
    ).toBeVisible();
    await expect(
        canvas.getByRole('link', { name: 'OTC Lending' })
    ).toBeVisible();
    await expect(
        canvas.getByRole('link', { name: 'Portfolio Management' })
    ).toBeVisible();
};
MenuExpanded.parameters = {
    chromatic: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
};
