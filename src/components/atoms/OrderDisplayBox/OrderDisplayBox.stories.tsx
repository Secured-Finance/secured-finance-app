import { ComponentMeta, ComponentStory } from '@storybook/react';
import { OrderDisplayBox } from '.';

export default {
    title: 'Atoms/OrderDisplayBox',
    component: OrderDisplayBox,
    args: {
        field: 'Fixed Rate',
        value: 1000,
    },
} as ComponentMeta<typeof OrderDisplayBox>;

const Template: ComponentStory<typeof OrderDisplayBox> = args => (
    <OrderDisplayBox {...args} />
);

export const Default = Template.bind({});

export const Amount = Template.bind({});
Amount.args = {
    field: 'Amount',
    value: 10,
};

export const Total = Template.bind({});
Total.args = {
    field: 'Total',
    value: '49.2',
};

export const WithInformationText = Template.bind({});
WithInformationText.args = {
    informationText: 'Input value from 0 to 100',
};
