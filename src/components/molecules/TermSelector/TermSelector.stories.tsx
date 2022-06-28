import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TermSelector } from './TermSelector';

const options = [
    { name: 'Sep 2022' },
    { name: 'Dec 2022' },
    { name: 'Mar 2023' },
    { name: 'Jun 2023' },
    { name: 'Sep 2023' },
    { name: 'Dec 2023' },
    { name: 'Mar 2024' },
    { name: 'Jun 2024' },
    { name: 'Sep 2024' },
    { name: 'Dec 2024' },
];

export default {
    title: 'Molecules/TermSelector',
    component: TermSelector,
    args: {
        options,
        value: { name: 'Sep 2022' },
    },
    argTypes: {
        options: { control: { disable: true } },
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof TermSelector>;

const Template: ComponentStory<typeof TermSelector> = args => (
    <TermSelector {...args} />
);

export const Default = Template.bind({});
export const WithTransformFunction = Template.bind({});
WithTransformFunction.args = {
    options,
    transform: (v: string) => {
        return v.toUpperCase();
    },
};
