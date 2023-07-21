import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { OrderInputBox } from '.';

export default {
    title: 'Atoms/OrderInputBox',
    component: OrderInputBox,
    args: {
        field: 'Fixed Rate',
        unit: '%',
        disabled: true,
        initialValue: 1000,
    },
} as Meta<typeof OrderInputBox>;

const Template: StoryFn<typeof OrderInputBox> = args => (
    <OrderInputBox {...args} />
);

export const Default = Template.bind({});

export const Amount = Template.bind({});
Amount.args = {
    field: 'Amount',
    unit: CurrencySymbol.WFIL,
    asset: CurrencySymbol.WFIL,
    disabled: false,
    initialValue: 10,
};

export const Total = Template.bind({});
Total.args = {
    field: 'Total',
    unit: 'USD',
    disabled: true,
    initialValue: '49.2',
};

export const WithInformationText = Template.bind({});
WithInformationText.args = {
    informationText: 'Input value from 0 to 100',
    disabled: false,
};
