import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TitlePage } from './TitlePage';

const Content = () => <div className='bg-red p-10 text-white'>Content</div>;

const TitleComponent = () => (
    <div className='bg-teal p-10 text-white'>Title Component</div>
);

export default {
    title: 'Templates/TitlePage',
    component: TitlePage,
    args: {
        title: 'Title',
        children: <Content />,
    },
} as ComponentMeta<typeof TitlePage>;

const Template: ComponentStory<typeof TitlePage> = args => (
    <TitlePage {...args} />
);

export const Default = Template.bind({});
export const WithTitleComponent = Template.bind({});
WithTitleComponent.args = {
    titleComponent: <TitleComponent />,
};
