import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { HorizontalTab } from './HorizontalTab';

export default {
    title: 'Molecules/HorizontalTab',
    component: HorizontalTab,
    args: {
        tabTitles: ['Active Contracts', 'Trade History'],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as ComponentMeta<typeof HorizontalTab>;

const Template: ComponentStory<typeof HorizontalTab> = args => (
    <div className='w-full text-white-80'>
        <HorizontalTab {...args}>
            <div>This is a Great Tab Content</div>
            <div className='py-12'>This is the content of the second tab</div>
        </HorizontalTab>
    </div>
);

export const Default = Template.bind({});

export const MobileViewport = Template.bind({});

MobileViewport.parameters = {
    viewport: {
        defaultViewport: 'mobile',
    },
};
MobileViewport.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button', { hidden: true }).click();
};
