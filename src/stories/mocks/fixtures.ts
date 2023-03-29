import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { BigNumber, utils } from 'ethers';
import FilecoinIcon from 'src/assets/coins/efil.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import WrappedBitcoinIcon from 'src/assets/coins/wbtc.svg';
import { Option } from 'src/components/atoms';
import { CollateralBook } from 'src/hooks';
import { AssetPrices } from 'src/store/assetPrices';
import { RootState } from 'src/store/types';
import {
    DailyVolumes,
    MaturityOptionList,
    OrderList,
    TradeHistory,
    TradesQuery,
} from 'src/types';
import { CurrencySymbol, Rate, TradeSummary } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const preloadedAssetPrices: { assetPrices: AssetPrices } = {
    assetPrices: {
        EFIL: {
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
        WBTC: {
            price: 50000.0,
            change: 0.0,
        },
        isLoading: false,
    },
};

export const assetPriceMap = {
    EFIL: 6.0,
    ETH: 2000.34,
    USDC: 1.0,
    WBTC: 50000.0,
};

export const preloadedBalances = {
    wallet: {
        balances: {
            EFIL: 1000,
            ETH: 10,
            USDC: 100000,
            WBTC: 50,
        },
    },
};

export const preloadedLendingMarkets: Partial<RootState> = {
    availableContracts: {
        lendingMarkets: {
            [CurrencySymbol.EFIL]: {
                DEC22: {
                    name: 'DEC22',
                    maturity: 1669852800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9801,
                },
                MAR23: {
                    name: 'MAR23',
                    maturity: 1677628800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9701,
                },
                JUN23: {
                    name: 'JUN23',
                    maturity: 1685577600,
                    isActive: false,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9601,
                },
            },
            [CurrencySymbol.WBTC]: {
                DEC22: {
                    name: 'DEC22',
                    maturity: 1669852800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9801,
                },
                MAR23: {
                    name: 'MAR23',
                    maturity: 1677628800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9701,
                },
                JUN23: {
                    name: 'JUN23',
                    maturity: 1685577600,
                    isActive: false,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9601,
                },
            },
            [CurrencySymbol.USDC]: {
                DEC22: {
                    name: 'DEC22',
                    maturity: 1669852800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9801,
                },
                MAR23: {
                    name: 'MAR23',
                    maturity: 1677628800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9701,
                },
                JUN23: {
                    name: 'JUN23',
                    maturity: 1685577600,
                    isActive: false,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9601,
                },
            },
            [CurrencySymbol.ETH]: {
                DEC22: {
                    name: 'DEC22',
                    maturity: 1669852800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9801,
                },
                MAR23: {
                    name: 'MAR23',
                    maturity: 1677628800,
                    isActive: true,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9701,
                },
                JUN23: {
                    name: 'JUN23',
                    maturity: 1685577600,
                    isActive: false,
                    utcOpeningDate: 1677628800,
                    midUnitPrice: 9601,
                },
            },
        },
    },
};
export const dec22Fixture = new Maturity(1669852800);
export const mar23Fixture = new Maturity(1677628800);
export const jun23Fixture = new Maturity(1685577600);
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

export const assetList = [
    {
        label: 'Wrapped Bitcoin',
        iconSVG: WrappedBitcoinIcon,
        value: 'WBTC',
    },
    {
        label: 'Ethereum',
        iconSVG: EthIcon,
        value: 'ETH',
    },
    {
        label: 'EFIL',
        iconSVG: FilecoinIcon,
        value: 'EFIL',
    },
    {
        label: 'USDC',
        iconSVG: UsdcIcon,
        value: 'USDC',
    },
    {
        label: 'USD Tether',
        iconSVG: UsdtIcon,
        value: 'USDT',
    },
] as Array<Option>;

export const currencyList = [
    {
        label: 'Wrapped Bitcoin',
        iconSVG: WrappedBitcoinIcon,
        value: CurrencySymbol.WBTC,
    },
    {
        label: 'Ethereum',
        iconSVG: EthIcon,
        value: CurrencySymbol.ETH,
    },
    {
        label: 'EFIL',
        iconSVG: FilecoinIcon,
        value: CurrencySymbol.EFIL,
    },
    {
        label: 'USDC',
        iconSVG: UsdcIcon,
        value: CurrencySymbol.USDC,
    },
] as Array<Option>;

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

export const efilBytes32 = utils.formatBytes32String('EFIL'); //0x46494c0000000000000000000000000000000000000000000000000000000000
export const ethBytes32 = utils.formatBytes32String('ETH');
export const wbtcBytes32 = utils.formatBytes32String('WBTC');
export const usdcBytes32 = utils.formatBytes32String('USDC'); // '0x5553444300000000000000000000000000000000000000000000000000000000'

export const orderHistoryList: OrderList = [
    {
        id: '1',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        currency: efilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1000000000000000000000'),
        status: 'Filled',
        createdAt: BigNumber.from('1'),
        blockNumber: BigNumber.from('1'),
        txHash: '1',
    },
    {
        id: '2',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        currency: efilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9600'),
        amount: BigNumber.from('5000000000000000000000'),
        status: 'Open',
        createdAt: BigNumber.from('1'),
        blockNumber: BigNumber.from('1'),
        txHash: '1',
    },
    {
        id: '3',
        orderId: BigNumber.from('1'),
        originalOrderId: BigNumber.from('1'),
        currency: wbtcBytes32,
        side: 0,
        maturity: BigNumber.from(dec22Fixture.toString()),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1000000000'),
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
        averagePrice: '8000',
        side: 0,
        orderPrice: '9800',
        createdAt: '1671859344',
        forwardValue: '1020000000000000000000',
        currency: efilBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        id: '0x124',
        amount: '500000000000000000000',
        averagePrice: '8000',
        side: 1,
        orderPrice: '9543',
        createdAt: '1671080520',
        forwardValue: '520000000000000000000',
        currency: efilBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        id: '0x124',
        amount: '500000000000000000000',
        averagePrice: '8000',
        side: 1,
        orderPrice: '9543',
        createdAt: '1671080520',
        forwardValue: '520000000000000000000',
        currency: efilBytes32,
        maturity: mar23Fixture.toString(),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: '9000',
        side: 1,
        orderPrice: '9700',
        createdAt: '1671427140',
        forwardValue: '1040000000',
        currency: wbtcBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        id: '0x123',
        amount: '1000000000',
        averagePrice: '9203',
        side: 1,
        orderPrice: '0',
        createdAt: '1671080556',
        forwardValue: '1040000000',
        currency: ethBytes32,
        maturity: mar23Fixture.toString(),
    },
];

export const aggregatedTrades: TradeSummary[] = [
    {
        amount: BigNumber.from('500000000000000000000'),
        currency: efilBytes32,
        forwardValue: BigNumber.from('500000000000000000000'),
        maturity: jun23Fixture.toString(),
        averagePrice: BigNumber.from(9671),
    },
    {
        amount: BigNumber.from('-500000000000000000000'),
        currency: efilBytes32,
        forwardValue: BigNumber.from('-520000000000000000000'),
        maturity: mar23Fixture.toString(),
        averagePrice: BigNumber.from(9698),
    },
    {
        amount: BigNumber.from('-1000000000'),
        averagePrice: BigNumber.from(9700),
        forwardValue: BigNumber.from('-1040000000'),
        currency: wbtcBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        amount: BigNumber.from('-1000000000'),
        averagePrice: BigNumber.from(0),
        forwardValue: BigNumber.from('-1040000000'),
        currency: ethBytes32,
        maturity: mar23Fixture.toString(),
    },
];

export const collateralBook80: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('1000000000000000000'),
        USDC: BigNumber.from('100000000'),
    },
    nonCollateral: {
        EFIL: BigNumber.from('100000000000000000000'),
        WBTC: BigNumber.from('20000000'),
    },
    usdCollateral: 2100.34,
    usdNonCollateral: 10600,
    coverage: BigNumber.from('8000'), // 80%,
};

export const collateralBook37: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('1000000000000000000'),
        USDC: BigNumber.from('10000000'),
    },
    nonCollateral: {
        EFIL: BigNumber.from('100000000000000000000'),
        WBTC: BigNumber.from('20000000'),
    },
    usdCollateral: 2300,
    usdNonCollateral: 10600,
    coverage: BigNumber.from('3700'),
};

export const emptyCollateralBook: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('0'),
        USDC: BigNumber.from('0'),
    },
    nonCollateral: {
        EFIL: BigNumber.from('0'),
        WBTC: BigNumber.from('0'),
    },
    usdCollateral: 0,
    usdNonCollateral: 0,
    coverage: BigNumber.from('0'), // 0%
};

function generateDailyVolumes(days: number) {
    const volumes: DailyVolumes = [];
    for (let i = 0; i < days; i++) {
        for (const currency of [efilBytes32, wbtcBytes32, ethBytes32]) {
            for (const maturity of [
                dec22Fixture,
                mar23Fixture,
                jun23Fixture,
                sep23Fixture,
                dec23Fixture,
            ])
                volumes.push({
                    id: `${fromBytes32(currency)}-1677628800-2023-02-${i}`,
                    currency: efilBytes32,
                    maturity: dec22Fixture,
                    day: `2023-02-${i}`,
                    timestamp: maturity.toString(),
                    volume: '30000000000000000000',
                });
        }
    }
    return volumes;
}

export const dailyVolumes: DailyVolumes = generateDailyVolumes(365 * 4);

export const trades: NonNullable<TradesQuery> = {
    transactions: [],
};
