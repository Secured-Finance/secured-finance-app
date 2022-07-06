import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TermSelector } from './TermSelector';

const options = [
    { name: 'Sep 2022', value: 'Sep2022' },
    { name: 'Dec 2022', value: 'Dec2022' },
    { name: 'Mar 2023', value: 'Mar2023' },
    { name: 'Jun 2023', value: 'Jun2023' },
    { name: 'Sep 2023', value: 'Sep2023' },
    { name: 'Dec 2023', value: 'Dec2023' },
    { name: 'Mar 2024', value: 'Mar2024' },
    { name: 'Jun 2024', value: 'Jun2024' },
    { name: 'Sep 2024', value: 'Sep2024' },
    { name: 'Dec 2024', value: 'Dec2024' },
];

export default {
    title: 'Molecules/TermSelector',
    component: TermSelector,
    args: {
        options,
        selected: { name: 'Sep 2022', value: 'Sep2022' },
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
