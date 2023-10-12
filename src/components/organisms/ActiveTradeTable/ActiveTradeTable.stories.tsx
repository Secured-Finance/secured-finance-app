import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { defaultDelistedStatusMap } from 'src/hooks';
import { positions, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { ActiveTradeTable } from './ActiveTradeTable';

export default {
    title: 'Organism/ActiveTradeTable',
    component: ActiveTradeTable,
    args: {
        data: positions,
        currencyDelistedStatusMap: defaultDelistedStatusMap,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET, VIEWPORTS.LAPTOP],
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as Meta<typeof ActiveTradeTable>;

const Template: StoryFn<typeof ActiveTradeTable> = args => {
    args.data = [
        ...args.data,
        {
            amount: BigNumber.from('500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(getPastTimeStamp(166)).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('0'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(getFutureTimeStamp(28)).toString(),
            marketPrice: BigNumber.from(0),
        },
        {
            amount: BigNumber.from('0'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('500000000000000000000'),
            maturity: new Maturity(getPastTimeStamp(240)).toString(),
            marketPrice: BigNumber.from(0),
        },
        {
            amount: BigNumber.from('-500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('-500000000000000000000'),
            maturity: new Maturity(getFutureTimeStamp(22)).toString(),
            marketPrice: BigNumber.from(10000),
        },
        {
            amount: BigNumber.from('-500000000000000000000'),
            currency: wfilBytes32,
            forwardValue: BigNumber.from('-500000000000000000000'),
            maturity: new Maturity(getPastTimeStamp(120)).toString(),
            marketPrice: BigNumber.from(10000),
        },
    ];

    return <ActiveTradeTable {...args} />;
};

export const Default = Template.bind({});

export const Delisted = Template.bind({});
Delisted.args = {
    currencyDelistedStatusMap: {
        ...defaultDelistedStatusMap,
        [CurrencySymbol.WFIL]: true,
    },
};

const getFutureTimeStamp = (hours: number) => {
    const now = new Date();
    const futureTimestamp = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return Math.floor(futureTimestamp.getTime() / 1000);
};

const getPastTimeStamp = (hours: number) => {
    const now = new Date();
    const futureTimestamp = new Date(now.getTime() - hours * 60 * 60 * 1000);
    return Math.floor(futureTimestamp.getTime() / 1000);
};
