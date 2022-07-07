import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Option } from 'src/components/atoms';
import { TermSelector } from './TermSelector';

const options: Array<Option> = [
    { label: 'Sep 2022', value: 'Sep2022' },
    { label: 'Dec 2022', value: 'Dec2022' },
    { label: 'Mar 2023', value: 'Mar2023' },
    { label: 'Jun 2023', value: 'Jun2023' },
    { label: 'Sep 2023', value: 'Sep2023' },
    { label: 'Dec 2023', value: 'Dec2023' },
    { label: 'Mar 2024', value: 'Mar2024' },
    { label: 'Jun 2024', value: 'Jun2024' },
    { label: 'Sep 2024', value: 'Sep2024' },
    { label: 'Dec 2024', value: 'Dec2024' },
];

export default {
    title: 'Molecules/TermSelector',
    component: TermSelector,
    args: {
        options,
        selected: { label: 'Sep 2022', value: 'Sep2022' },
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
