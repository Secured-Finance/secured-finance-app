import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { WithGraphClient } from '.storybook/decorators';
import type { Meta } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { mockDailyVolumes, mockTrades } from 'src/stories/mocks/queries';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLendingTopBar } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
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
        currencyPrice: '$4.05',
    },
    parameters: {
        apolloClient: {
            mocks: [...mockTrades, ...mockDailyVolumes],
        },
        ...RESPONSIVE_PARAMETERS,
        viewport: {
            disable: true,
        },
    },
    decorators: [WithGraphClient],
} as Meta<typeof AdvancedLendingTopBar>;

const Template: StoryFn<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const MarketInfoDialog = Template.bind({});
MarketInfoDialog.parameters = {
    chromatic: { viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET] },
    viewport: {
        defaultViewport: 'mobile',
    },
};
MarketInfoDialog.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = await canvas.findByTestId('market-info-btn');
    await userEvent.click(button);
};
