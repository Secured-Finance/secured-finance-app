import { withWalletProvider } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    currencyList,
    dec22Fixture,
    maturityOptions,
} from 'src/stories/mocks/fixtures';
import {
    mockDailyVolumes,
    mockTransaction24HQuery,
} from 'src/stories/mocks/queries';
import { CurrencyMaturityDropdown } from './CurrencyMaturityDropdown';
import { LoanValue } from 'src/utils/entities';

export default {
    title: 'Molecules/CurrencyMaturityDropdown',
    component: CurrencyMaturityDropdown,
    decorators: [withWalletProvider],
    args: {
        currencyList: currencyList,
        asset: currencyList[0],
        maturityList: maturityOptions,
        maturity: maturityOptions[0],
        onChange: () => {},
        isItayosePage: false,
        marketStats: {
            'WBTC-1669852800': {
                high: LoanValue.fromPrice(9899, dec22Fixture.toNumber()),
                lastPrice: 9900,
                low: LoanValue.fromPrice(9457, dec22Fixture.toNumber()),
                volume: 1,
            },
            'USDC-1669852800': {
                high: LoanValue.fromPrice(9800, dec22Fixture.toNumber()),
                lastPrice: 9420,
                low: LoanValue.fromPrice(9600, dec22Fixture.toNumber()),
                volume: 11,
            },
        },
    },
    parameters: {
        connected: true,
        apolloClient: {
            mocks: [...mockTransaction24HQuery, ...mockDailyVolumes],
        },
    },
} as Meta<typeof CurrencyMaturityDropdown>;

const Template: StoryFn<typeof CurrencyMaturityDropdown> = args => (
    <CurrencyMaturityDropdown {...args} />
);

export const Default = Template.bind({});

export const OpenedDropdown = Template.bind({});
OpenedDropdown.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};
