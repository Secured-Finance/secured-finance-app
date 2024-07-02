import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLendingTopBar } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
    decorators: [withWalletProvider],
    args: {
        selectedAsset: currencyList[2],
        assetList: currencyList,
        options: maturityOptions,
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value,
        },
        onAssetChange: () => {},
        onTermChange: () => {},
        currentMarket: {
            value: LoanValue.fromPrice(
                lastTradePrice,
                maturityOptions[0].value.toNumber()
            ),
            time: 1646920200,
            type: 'block',
        },
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
    values: ['26.16', '24.2', '894', '10,000,000'],
    currencyPrice: '23000',
};
