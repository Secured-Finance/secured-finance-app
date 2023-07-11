import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CurveHeaderAsset } from './';

export default {
    title: 'Atoms/CurveHeaderAsset',
    component: CurveHeaderAsset,
    args: {
        ccy: CurrencySymbol.WFIL,
        value: 8.02,
        fluctuation: -2.45,
    },
    argTypes: {
        ccy: {
            control: {
                type: 'select',
                options: Object.values(CurrencySymbol),
            },
        },
    },
} as ComponentMeta<typeof CurveHeaderAsset>;

const Template: ComponentStory<typeof CurveHeaderAsset> = args => (
    <CurveHeaderAsset {...args} />
);

export const Default = Template.bind({});

export const PositiveFluctuation = Template.bind({});
PositiveFluctuation.args = {
    ccy: CurrencySymbol.ETH,
    value: 1511.45,
    fluctuation: 2.45,
};
