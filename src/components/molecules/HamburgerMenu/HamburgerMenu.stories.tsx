import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { HamburgerMenu } from './HamburgerMenu';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';

export default {
    title: 'Molecules/HamburgerMenu',
    component: HamburgerMenu,
    args: {
        links: [
            {
                label: 'Market Dashboard',
                link: '/market-dashboard',
            },
            {
                label: 'OTC Lending',
                link: '/otc-lending',
            },
            {
                label: 'Another Link',
                link: '/',
            },
            {
                label: 'So Many Links',
                link: '/new-link',
            },
        ],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
            delay: FINANCIAL_CONSTANTS.POINTS_K_THRESHOLD,
        },
    },
} as Meta<typeof HamburgerMenu>;

const Template: StoryFn<typeof HamburgerMenu> = args => (
    <HamburgerMenu {...args} />
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Hamburger Menu' }).click();
};

export const FullyExpanded = Template.bind({});
FullyExpanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { name: 'Hamburger Menu' }).click();
    const MoreButton = await canvas.findByRole('button', {
        name: 'Show More',
    });
    MoreButton.click();
};
