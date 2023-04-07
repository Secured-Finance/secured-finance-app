import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { OpenOrderActionCell } from './OpenOrderActionCell';

export default {
    title: 'Molecules/OpenOrderActionCell',
    component: OpenOrderActionCell,
    args: {
        ccy: CurrencySymbol.EFIL,
        maturity: dec22Fixture,
        orderId: BigNumber.from(1),
    },
    argTypes: {
        ccy: {
            control: {
                type: 'select',
                options: [CurrencySymbol.EFIL, CurrencySymbol.ETH],
            },
        },
    },
} as ComponentMeta<typeof OpenOrderActionCell>;

const Template: ComponentStory<typeof OpenOrderActionCell> = args => (
    <OpenOrderActionCell {...args} />
);

export const Default = Template.bind({});
