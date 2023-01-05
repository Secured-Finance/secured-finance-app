import { BigNumber, utils } from 'ethers';
import { AssetPrices } from 'src/store/assetPrices';
import { MaturityOptionList, OrderList, TradeHistory } from 'src/types';
import { Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const preloadedAssetPrices: { assetPrices: AssetPrices } = {
    assetPrices: {
        FIL: {
            price: 6.0,
            change: -8.208519783216566,
        },
        ETH: {
            price: 2000.34,
            change: 0.5162466489453748,
        },
        USDC: {
            price: 1.0,
            change: 0.042530768538486696,
        },
        BTC: {
            price: 50000.0,
            change: 0.0,
        },
        isLoading: false,
    },
};

export const dec22Fixture = new Maturity(1669852800);
export const mar23Fixture = new Maturity(1677628800);
const jun23Fixture = new Maturity(1685577600);
export const sep23Fixture = new Maturity(1693526400);
const dec23Fixture = new Maturity(1701388800);
const mar24Fixture = new Maturity(1709251200);
const jun24Fixture = new Maturity(1717200000);
const sep24Fixture = new Maturity(1725148800);

export const maturityOptions: MaturityOptionList = [
    { label: 'DEC22', value: dec22Fixture },
    { label: 'MAR23', value: mar23Fixture },
    { label: 'JUN23', value: jun23Fixture },
    { label: 'SEP23', value: sep23Fixture },
    { label: 'DEC23', value: dec23Fixture },
    { label: 'MAR24', value: mar24Fixture },
    { label: 'JUN24', value: jun24Fixture },
    { label: 'SEP24', value: sep24Fixture },
];

export const yieldCurveRates = [
    new Rate(37326),
    new Rate(37660),
    new Rate(38537),
    new Rate(39259),
    new Rate(42324),
    new Rate(43801),
    new Rate(46219),
    new Rate(47746),
];

export const filBytes32 = utils.formatBytes32String('FIL');
export const ethBytes32 = utils.formatBytes32String('ETH');
const btc = utils.formatBytes32String('BTC');

export const orderHistoryList: OrderList = [
    {
        id: '1',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        maker: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
        currency: filBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1'),
        status: 'Filled',
        createdAt: BigNumber.from('1'),
        blockNumber: BigNumber.from('1'),
        txHash: '1',
    },
    {
        id: '2',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        maker: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
        currency: filBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9600'),
        amount: BigNumber.from('1'),
        status: 'Open',
        createdAt: BigNumber.from('1'),
        blockNumber: BigNumber.from('1'),
        txHash: '1',
    },
    {
        id: '3',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        maker: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
        currency: ethBytes32,
        side: 0,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1'),
        status: 'Filled',
        createdAt: BigNumber.from('1'),
        blockNumber: BigNumber.from('1'),
        txHash: '1',
    },
];

export const transactions: TradeHistory = [
    {
        id: '0x123',
        amount: '1000000000000000000000',
        averagePrice: BigNumber.from(8000),
        side: 0,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: BigNumber.from('1020000000000000000000'),
        txHash: '0x123',
        currency: filBytes32,
        maturity: BigNumber.from(1733011200),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: BigNumber.from(9000),
        side: 1,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: BigNumber.from('1040000000'),
        txHash: '0x123',
        currency: btc,
        maturity: BigNumber.from(1733011200),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: BigNumber.from(9203),
        side: 1,
        orderPrice: 100000,
        createdAt: 123,
        blockNumber: 123,
        taker: '0x123',
        forwardValue: BigNumber.from('1040000000'),
        txHash: '0x123',
        currency: ethBytes32,
        maturity: BigNumber.from(1733011200),
    },
];
