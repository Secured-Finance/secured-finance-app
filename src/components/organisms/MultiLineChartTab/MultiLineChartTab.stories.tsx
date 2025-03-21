import type { Meta, StoryFn } from '@storybook/react';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { yieldCurveRates } from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { MultiLineChartTab } from './MultiLineChartTab';

const maturityList = [
    { label: 'DEC22', maturity: 1669852800, isPreOrderPeriod: true },
    { label: 'MAR23', maturity: 1677628800, isPreOrderPeriod: true },
    { label: 'JUN23', maturity: 1685577600, isPreOrderPeriod: true },
    { label: 'SEP23', maturity: 1693526400, isPreOrderPeriod: true },
    { label: 'DEC23', maturity: 1701388800, isPreOrderPeriod: true },
];

const mockFetchedRates = {
    '1800': [
        new Rate(190000),
        new Rate(0),
        new Rate(170542),
        new Rate(0),
        new Rate(29487),
    ],
    '3600': [
        new Rate(0),
        new Rate(0),
        new Rate(170523),
        new Rate(0),
        new Rate(29485),
    ],
    '14400': [
        new Rate(0),
        new Rate(0),
        new Rate(170506),
        new Rate(0),
        new Rate(29483),
    ],
    '86400': [
        new Rate(0),
        new Rate(0),
        new Rate(170402),
        new Rate(0),
        new Rate(29474),
    ],
    '604800': [
        new Rate(0),
        new Rate(0),
        new Rate(169715),
        new Rate(0),
        new Rate(29410),
    ],
    '2592000': [
        new Rate(0),
        new Rate(0),
        new Rate(164929),
        new Rate(0),
        new Rate(28956),
    ],
};

export default {
    title: 'Organism/MultiLineChartTab',
    component: MultiLineChartTab,
    args: {
        rates: yieldCurveRates,
        maturityList: maturityList,
        itayoseMarketIndexSet: new Set(),
        maximumRate: Number.MAX_VALUE,
        marketCloseToMaturityOriginalRate: 0,
        fetchedRates: mockFetchedRates,
    },
    chromatic: { pauseAnimationAtEnd: true },
    decorators: [withWalletProvider],
} as Meta<typeof MultiLineChartTab>;

const Template: StoryFn<typeof MultiLineChartTab> = args => {
    return (
        <div className='h-[410px] w-[740px] px-6 py-4'>
            <MultiLineChartTab {...args} />
        </div>
    );
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
Loading.args = {
    rates: [],
};

export const WithItayoseMarket = Template.bind({});
WithItayoseMarket.args = {
    itayoseMarketIndexSet: new Set([7]),
};

export const MultipleItayoseMarkets = Template.bind({});
MultipleItayoseMarkets.args = {
    itayoseMarketIndexSet: new Set([5, 6, 7]),
};

export const WithLessThan8Markets = Template.bind({});
WithLessThan8Markets.args = {
    rates: yieldCurveRates.slice(3),
    maturityList: maturityList.slice(3),
    itayoseMarketIndexSet: new Set([1, 2, 3, 4]),
};

export const WithNearestMarket = Template.bind({});
WithNearestMarket.args = {
    maximumRate: 47746,
    rates: [new Rate(59682), ...yieldCurveRates],
    marketCloseToMaturityOriginalRate: 800000,
};

export const WithNearestMarketWithLowYield = Template.bind({});
WithNearestMarketWithLowYield.args = {
    maximumRate: 47746,
    rates: [new Rate(20000), ...yieldCurveRates],
    marketCloseToMaturityOriginalRate: 0,
};
