import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Page } from './Page';

const Content = () => <div className='bg-red p-10 text-white'>Content</div>;

const TitleComponent = () => (
    <div className='bg-teal p-10 text-white'>Title Component</div>
);

export default {
    title: 'Templates/Page',
    component: Page,
    args: {
        title: 'Title',
        children: <Content />,
    },
} as ComponentMeta<typeof Page>;

const Template: ComponentStory<typeof Page> = args => <Page {...args} />;

export const Default = Template.bind({});
export const WithTitleComponent = Template.bind({});
WithTitleComponent.args = {
    titleComponent: <TitleComponent />,
};
