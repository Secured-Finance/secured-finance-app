import { withAppLayout, withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { Itayose } from './Itayose';
import { mockItayoseFilteredUserOrderHistory } from 'src/stories/mocks/queries';

export default {
    title: 'Pages/Itayose',
    component: Itayose,
    args: {},
    parameters: {
        apolloClient: {
            mocks: mockItayoseFilteredUserOrderHistory,
        },
        chromatic: { delay: 2000 },
        connected: true,
    },
    decorators: [withAppLayout, withWalletProvider],
} as Meta<typeof Itayose>;

const Template: StoryFn<typeof Itayose> = () => <Itayose />;

export const Default = Template.bind({});
