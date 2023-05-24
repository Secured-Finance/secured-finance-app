import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withMidPrice } from 'src/../.storybook/decorators';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { AdvancedLendingTopBar } from '.';
import { LoanValue, Maturity } from 'src/utils/entities';

const sep24Fixture = new Maturity(1725148800);
const lastTradePrice = 8000;
export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    args: {
        selectedAsset: currencyList[0],
        assetList: currencyList,
        options: maturityOptions.map(o => ({
            label: o.label,
            value: o.value.toString(),
        })),
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value.toString(),
        },
    },
    decorators: [withMidPrice],
} as ComponentMeta<typeof AdvancedLendingTopBar>;

const Template: ComponentStory<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const Values = Template.bind({});
Values.args = {
    values: [26.16, 24.2, 894, 10000000, '23000'],
};

export const LastTradePrice = Template.bind({});
LastTradePrice.args = {
    lastTradeLoan: LoanValue.fromPrice(lastTradePrice, sep24Fixture.toNumber()),
};
