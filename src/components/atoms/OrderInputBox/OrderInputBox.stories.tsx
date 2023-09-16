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

export const SmallWidth: StoryFn<typeof OrderInputBox> = args => (
    <div className='w-64 rounded-md border border-horizonBlue bg-gunMetal p-3'>
        <OrderInputBox {...args} />
    </div>
);
SmallWidth.args = {
    field: 'Amount',
    unit: CurrencySymbol.WFIL,
    disabled: false,
    initialValue: `10000000`,
    informationText: 'Input value from 0 to 100',
};
