import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithAppLayout } from 'src/../.storybook/decorators';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    args: {},
    decorators: [WithAppLayout],
} as ComponentMeta<typeof Landing>;

const Template: ComponentStory<typeof Landing> = args => <Landing />;

export const Default = Template.bind({});
