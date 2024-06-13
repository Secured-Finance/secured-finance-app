import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Campaign } from './Campaign';

export default {
    title: 'Pages/Campaign',
    component: Campaign,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            delay: 3000,
            viewports: [
                VIEWPORTS.MOBILE,
                VIEWPORTS.TABLET,
                VIEWPORTS.LAPTOP,
                VIEWPORTS.DESKTOP,
            ],
        },
        connected: true,
    },
    decorators: [withAppLayout, withWalletProvider, withBalance],
} as Meta<typeof Campaign>;

const Template: StoryFn<typeof Campaign> = () => {
    return <Campaign />;
};

export const Default = Template.bind({});
