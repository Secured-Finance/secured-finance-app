import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { Itayose } from './Itayose';

export default {
    title: 'Pages/Itayose',
    component: Itayose,
    args: {},
    parameters: {
        chromatic: { delay: 2000 },
        connected: true,
    },
    decorators: [
        withAppLayout,
        withAssetPrice,
        withWalletProvider,
        withChainErrorDisabled,
    ],
} as Meta<typeof Itayose>;

const Template: StoryFn<typeof Itayose> = () => <Itayose />;

export const Default = Template.bind({});
