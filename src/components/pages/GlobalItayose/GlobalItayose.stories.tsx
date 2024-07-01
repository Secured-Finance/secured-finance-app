import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import {
    WithGraphClient,
    withAppLayout,
    withWalletProvider,
} from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { GlobalItayose } from './GlobalItayose';

export default {
    title: 'Pages/GlobalItayose',
    component: GlobalItayose,
    args: {},
    parameters: {
        layout: 'fullscreen',
        ...RESPONSIVE_PARAMETERS,
    },
    decorators: [withAppLayout, withWalletProvider, WithGraphClient],
} as Meta<typeof GlobalItayose>;

const Template: StoryFn<typeof GlobalItayose> = () => <GlobalItayose />;

export const Default = Template.bind({});

export const NoActiveOrderBook = Template.bind({});
NoActiveOrderBook.parameters = {
    date: { value: new Date('2021-11-01T11:00:00.00Z') },
};
