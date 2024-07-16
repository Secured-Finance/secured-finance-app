import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLendingTopBar } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    args: {
        selectedAsset: currencyList[2],
        assetList: currencyList,
        options: maturityOptions.map(o => ({
            label: o.label,
            value: o.value.toString(),
        })),
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value.toString(),
        },
        currentMarket: {
            value: LoanValue.fromPrice(
                lastTradePrice,
                maturityOptions[0].value.toNumber()
            ),
            time: 1646920200,
            type: 'block',
        },

        onAssetChange: () => {},
        onTermChange: () => {},
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as Meta<typeof AdvancedLendingTopBar>;

const Template: StoryFn<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const Values = Template.bind({});
Values.args = {
    // values: ['26.16', '24.2', '894', '10,000,000'],
    currencyPrice: '23000',
};
