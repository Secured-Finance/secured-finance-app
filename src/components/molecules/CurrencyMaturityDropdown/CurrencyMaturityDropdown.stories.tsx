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
        volumePerMarket: {
            [`${currencyList[0].value}-${dec22Fixture}`]: 1,
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
