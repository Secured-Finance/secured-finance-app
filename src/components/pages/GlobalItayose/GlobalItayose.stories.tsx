import { Meta, StoryFn } from '@storybook/react';
import { GlobalItayose } from './GlobalItayose';

export default {
    title: 'Pages/GlobalItayose',
    component: GlobalItayose,
    args: {},
} as Meta<typeof GlobalItayose>;

const Template: StoryFn<typeof GlobalItayose> = () => <GlobalItayose />;

export const Default = Template.bind({});
