import { WalletSource } from '@secured-finance/sf-client';
import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { BigNumber, utils } from 'ethers';
import EthIcon from 'src/assets/coins/eth2.svg';
import WfilIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import WrappedBitcoinIcon from 'src/assets/coins/wbtc.svg';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import MetamaskIcon from 'src/assets/img/metamask-fox.svg';
import { Option, WalletSourceOption } from 'src/components/atoms';
import { CollateralBook, Order, Position } from 'src/hooks';
import { AssetPrices } from 'src/store/assetPrices';
import { RootState } from 'src/store/types';
import {
    DailyVolumes,
    MaturityOptionList,
    OrderHistoryList,
    TradeHistory,
    TransactionList,
    OrderType,
} from 'src/types';
import { CurrencySymbol, Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const preloadedAssetPrices: { assetPrices: AssetPrices } = {
    assetPrices: {
        WFIL: {
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
    WFIL: 6.0,
    ETH: 2000.34,
    USDC: 1.0,
    WBTC: 50000.0,
};

export const preloadedBalances = {
    wallet: {
        balances: {
            WFIL: 1000,
            ETH: 10,
            USDC: 100000,
            WBTC: 50,
        },
    },
};

const sep22Fixture = new Maturity(1661990400);
export const dec22Fixture = new Maturity(1669852800);
export const mar23Fixture = new Maturity(1677628800);
export const jun23Fixture = new Maturity(1685577600);
export const sep23Fixture = new Maturity(1693526400);
const dec23Fixture = new Maturity(1701388800);
const mar24Fixture = new Maturity(1709251200);
const jun24Fixture = new Maturity(1717200000);
const sep24Fixture = new Maturity(1725148800);
export const dec24Fixture = new Maturity(1733011200);

export const maturities = {
    [dec22Fixture.toNumber()]: {
        name: 'DEC22',
        maturity: dec22Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9801,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9685,
        bestLendUnitPrice: 9687,
        minBorrowUnitPrice: 9672,
        maxLendUnitPrice: 9700,
    },
    [mar23Fixture.toNumber()]: {
        name: 'MAR23',
        maturity: mar23Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9701,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9683,
        bestLendUnitPrice: 9685,
        minBorrowUnitPrice: 9670,
        maxLendUnitPrice: 9698,
    },
    [jun23Fixture.toNumber()]: {
        name: 'JUN23',
        maturity: jun23Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9601,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9677,
        bestLendUnitPrice: 9679,
        minBorrowUnitPrice: 9664,
        maxLendUnitPrice: 9692,
    },
    [sep23Fixture.toNumber()]: {
        name: 'SEP23',
        maturity: sep23Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9501,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9672,
        bestLendUnitPrice: 9674,
        minBorrowUnitPrice: 9659,
        maxLendUnitPrice: 9687,
    },
    [dec23Fixture.toNumber()]: {
        name: 'DEC23',
        maturity: dec23Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9401,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9651,
        bestLendUnitPrice: 9653,
        minBorrowUnitPrice: 9638,
        maxLendUnitPrice: 9666,
    },
    [mar24Fixture.toNumber()]: {
        name: 'MAR24',
        maturity: mar24Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9301,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9641,
        bestLendUnitPrice: 9643,
        minBorrowUnitPrice: 9628,
        maxLendUnitPrice: 9656,
    },
    [jun24Fixture.toNumber()]: {
        name: 'JUN24',
        maturity: jun24Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9201,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9625,
        bestLendUnitPrice: 9627,
        minBorrowUnitPrice: 9612,
        maxLendUnitPrice: 9640,
    },
    [sep24Fixture.toNumber()]: {
        name: 'SEP24',
        maturity: sep24Fixture.toNumber(),
        isActive: true,
        utcOpeningDate: 1677628800,
        midUnitPrice: 9101,
        preOpenDate: 1504828800,
        openingUnitPrice: 9710,
        isReady: true,
        isOpened: true,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9615,
        bestLendUnitPrice: 9617,
        minBorrowUnitPrice: 9602,
        maxLendUnitPrice: 9630,
    },
    [dec24Fixture.toNumber()]: {
        name: 'DEC24',
        maturity: dec24Fixture.toNumber(),
        isActive: false,
        utcOpeningDate: 1685577600,
        midUnitPrice: 9001,
        preOpenDate: 1512777600,
        openingUnitPrice: 9710,
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: true,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 9615,
        bestLendUnitPrice: 9617,
        minBorrowUnitPrice: 9602,
        maxLendUnitPrice: 9630,
    },
};

export const preloadedLendingMarkets: Partial<RootState> = {
    availableContracts: {
        lendingMarkets: {
            [CurrencySymbol.WFIL]: maturities,
            [CurrencySymbol.WBTC]: maturities,
            [CurrencySymbol.USDC]: maturities,
            [CurrencySymbol.ETH]: maturities,
        },
    },
};

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

export const walletSourceList: WalletSourceOption[] = [
    {
        source: WalletSource.METAMASK,
        available: 1000,
        asset: CurrencySymbol.WBTC,
        iconSVG: MetamaskIcon,
    },
    {
        source: WalletSource.SF_VAULT,
        available: 4000,
        asset: CurrencySymbol.WBTC,
        iconSVG: SFLogoSmall,
    },
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
        label: 'WFIL',
        iconSVG: WfilIcon,
        value: 'WFIL',
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
        label: 'WFIL',
        iconSVG: WfilIcon,
        value: CurrencySymbol.WFIL,
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

export const wfilBytes32 = utils.formatBytes32String('WFIL'); //0x5746494c0000000000000000000000000000000000000000000000000000000000
export const ethBytes32 = utils.formatBytes32String('ETH');
export const wbtcBytes32 = utils.formatBytes32String('WBTC'); //0x4546494c00000000000000000000000000000000000000000000000000000000
export const usdcBytes32 = utils.formatBytes32String('USDC'); // '0x5553444300000000000000000000000000000000000000000000000000000000'

export const activeOrders: Order[] = [
    {
        orderId: BigNumber.from('1'),
        currency: wfilBytes32,
        side: 1,
        maturity: dec23Fixture.toString(),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1000000000000000000000'),
        createdAt: BigNumber.from('1609299000'),
    },
    {
        orderId: BigNumber.from('2'),
        currency: wfilBytes32,
        side: 1,
        maturity: mar23Fixture.toString(),
        unitPrice: BigNumber.from('9600'),
        amount: BigNumber.from('5000000000000000000000'),
        createdAt: BigNumber.from('1609298000'),
    },
    {
        orderId: BigNumber.from('3'),
        currency: wfilBytes32,
        side: 0,
        maturity: dec22Fixture.toString(),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1000000000'),
        createdAt: BigNumber.from('1609297000'),
    },
    {
        orderId: BigNumber.from('4'),
        currency: wbtcBytes32,
        side: 1,
        maturity: mar23Fixture.toString(),
        unitPrice: BigNumber.from('9600'),
        amount: BigNumber.from('5000000000000000000000'),
        createdAt: BigNumber.from('1609296000'),
    },
    {
        orderId: BigNumber.from('5'),
        currency: ethBytes32,
        side: 0,
        maturity: dec23Fixture.toString(),
        unitPrice: BigNumber.from('9800'),
        amount: BigNumber.from('1000000000'),
        createdAt: BigNumber.from('1609295000'),
    },
];

export const orderHistoryList: OrderHistoryList = [
    {
        orderId: 1,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('0'),
        inputAmount: BigNumber.from('1000000000000000000000'),
        status: 'Open',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1609299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 2,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9600'),
        filledAmount: BigNumber.from('0'),
        inputAmount: BigNumber.from('5000000000000000000000'),
        status: 'Open',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1605299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 1,
        currency: wbtcBytes32,
        side: 0,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('500000000'),
        inputAmount: BigNumber.from('1000000000'),
        status: 'PartiallyFilled',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1600299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 1,
        currency: ethBytes32,
        side: 1,
        maturity: BigNumber.from(mar23Fixture.toString()),
        inputUnitPrice: BigNumber.from('9600'),
        filledAmount: BigNumber.from('0'),
        inputAmount: BigNumber.from('5000000000000000000000'),
        status: 'Open',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1689299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 1,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(sep22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('1000000000000000000000'),
        inputAmount: BigNumber.from('1000000000000000000000'),
        status: 'Filled',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1679299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: false,
        },
    },
    {
        orderId: 2,
        currency: ethBytes32,
        side: 1,
        maturity: BigNumber.from(mar23Fixture.toString()),
        inputUnitPrice: BigNumber.from('9600'),
        filledAmount: BigNumber.from('0'),
        inputAmount: BigNumber.from('100000000000000000'),
        status: 'Open',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1669299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 1,
        currency: wbtcBytes32,
        side: 0,
        maturity: BigNumber.from(mar23Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('500000000'),
        inputAmount: BigNumber.from('1000000000'),
        status: 'Cancelled',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1659299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 1,
        currency: ethBytes32,
        side: 0,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('50000000000000000'),
        inputAmount: BigNumber.from('500000000000000000'),
        status: 'PartiallyFilled',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1649299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 3,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(sep22Fixture.toString()),
        inputUnitPrice: BigNumber.from('0'),
        filledAmount: BigNumber.from('10000000000000000000'),
        inputAmount: BigNumber.from('100000000000000000000'),
        status: 'PartiallyBlocked',
        type: OrderType.MARKET,
        createdAt: BigNumber.from('1639299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: false,
        },
    },
    {
        orderId: 3,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9600'),
        filledAmount: BigNumber.from('0'),
        inputAmount: BigNumber.from('5000000000000000000000'),
        status: 'Blocked',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1629299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 5,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('9800'),
        filledAmount: BigNumber.from('10000000000000000000'),
        inputAmount: BigNumber.from('100000000000000000000'),
        status: 'PartiallyBlocked',
        type: OrderType.LIMIT,
        createdAt: BigNumber.from('1619299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
    {
        orderId: 6,
        currency: wfilBytes32,
        side: 1,
        maturity: BigNumber.from(dec22Fixture.toString()),
        inputUnitPrice: BigNumber.from('0'),
        filledAmount: BigNumber.from('10000000000000000000'),
        inputAmount: BigNumber.from('100000000000000000000'),
        status: 'Filled',
        type: OrderType.MARKET,
        createdAt: BigNumber.from('1608299000'),
        txHash: utils.formatBytes32String('hash'),
        lendingMarket: {
            id: '1',
            isActive: true,
        },
    },
];

export const transactions: TradeHistory = [
    {
        amount: '1000000000000000000000',
        averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
        side: 0,
        orderPrice: '9800',
        createdAt: '1671859344',
        forwardValue: '1020000000000000000000',
        currency: wfilBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        amount: '500000000000000000000',
        averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
        side: 1,
        orderPrice: '9543',
        createdAt: '1671080520',
        forwardValue: '520000000000000000000',
        currency: wfilBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        amount: '500000000000000000000',
        averagePrice: '0.8000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
        side: 1,
        orderPrice: '9543',
        createdAt: '1671080520',
        forwardValue: '520000000000000000000',
        currency: wfilBytes32,
        maturity: mar23Fixture.toString(),
    },
    {
        amount: '1000000000',
        averagePrice: '0.9000', // TODO: rework the unit in the graph. This is changed only for a dirty fix
        side: 1,
        orderPrice: '9700',
        createdAt: '1671427140',
        forwardValue: '1040000000',
        currency: wbtcBytes32,
        maturity: jun23Fixture.toString(),
    },
    {
        amount: '500000000',
        averagePrice: '0.98', // TODO: rework the unit in the graph. This is changed only for a dirty fix
        side: 0,
        orderPrice: '9800',
        createdAt: '1609296986',
        forwardValue: '505000000',
        currency: wbtcBytes32,
        maturity: dec22Fixture.toString(),
    },
];

export const positions: Position[] = [
    {
        amount: BigNumber.from('400000000000000000000'),
        currency: wfilBytes32,
        forwardValue: BigNumber.from('500000000000000000000'),
        maturity: jun23Fixture.toString(),
        midPrice: BigNumber.from(8000),
    },
    {
        amount: BigNumber.from('-500000000000000000000'),
        currency: wfilBytes32,
        forwardValue: BigNumber.from('-1000000000000000000000'),
        maturity: mar23Fixture.toString(),
        midPrice: BigNumber.from(5000),
    },
    {
        amount: BigNumber.from('0'),
        forwardValue: BigNumber.from('-1040000000'),
        currency: wbtcBytes32,
        maturity: jun23Fixture.toString(),
        midPrice: BigNumber.from(0),
    },
    {
        amount: BigNumber.from('0'),
        forwardValue: BigNumber.from('505000000'),
        currency: wbtcBytes32,
        maturity: dec22Fixture.toString(),
        midPrice: BigNumber.from(0),
    },
];

export const collateralBook80: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('1000000000000000000'),
        USDC: BigNumber.from('100000000'),
        WBTC: BigNumber.from('20000000'),
    },
    nonCollateral: {
        WFIL: BigNumber.from('100000000000000000000'),
    },
    usdCollateral: 12100.34,
    usdNonCollateral: 600,
    coverage: BigNumber.from('8000'), // 80%,
    collateralThreshold: 80,
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: BigNumber.from(100000),
        [CurrencySymbol.ETH]: BigNumber.from(100000),
        [CurrencySymbol.WBTC]: BigNumber.from(100000),
    },
};

export const collateralBook37: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('1000000000000000000'),
        USDC: BigNumber.from('100000000'),
        WBTC: BigNumber.from('20000000'),
    },
    nonCollateral: {
        WFIL: BigNumber.from('100000000000000000000'),
    },
    usdCollateral: 12100.34,
    usdNonCollateral: 600,
    coverage: BigNumber.from('3700'),
    collateralThreshold: 80,
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: BigNumber.from(100000),
        [CurrencySymbol.ETH]: BigNumber.from(100000),
        [CurrencySymbol.WBTC]: BigNumber.from(100000),
    },
};

export const emptyUSDCollateral: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('0'),
        USDC: BigNumber.from('0'),
        WBTC: BigNumber.from('0'),
    },
    nonCollateral: {
        WFIL: BigNumber.from('100000000000000000000'),
    },
    usdCollateral: 0,
    usdNonCollateral: 600,
    coverage: BigNumber.from('0'), // 0%
    collateralThreshold: 80,
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: BigNumber.from(0),
        [CurrencySymbol.ETH]: BigNumber.from(0),
        [CurrencySymbol.WBTC]: BigNumber.from(0),
    },
};

function generateDailyVolumes(days: number) {
    const volumes: DailyVolumes = [];
    for (let i = 0; i < days; i++) {
        for (const currency of [wfilBytes32, wbtcBytes32, ethBytes32]) {
            for (const maturity of [
                dec22Fixture,
                mar23Fixture,
                jun23Fixture,
                sep23Fixture,
                dec23Fixture,
            ])
                volumes.push({
                    id: `${fromBytes32(currency)}-1677628800-2023-02-${i}`,
                    currency: wfilBytes32,
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

export const tradesWFIL: TransactionList = [
    {
        amount: 100000000000,
        maturity: dec22Fixture,
        side: 0,
        createdAt: 1638356100,
        currency: wfilBytes32,
        averagePrice: 0.8,
    },
    {
        amount: 1000000000000,
        maturity: dec22Fixture,
        side: 1,
        createdAt: 1638355100,
        currency: wfilBytes32,
        averagePrice: 0.9,
    },
];

export const tradesETH: TransactionList = [
    {
        amount: 100000000000,
        maturity: dec22Fixture,
        side: 0,
        createdAt: 1638356100,
        currency: ethBytes32,
        averagePrice: 0.8,
    },
    {
        amount: 1000000000000,
        maturity: dec22Fixture,
        side: 1,
        createdAt: 1638355100,
        currency: ethBytes32,
        averagePrice: 0.9,
    },
];

export const tradesUSDC: TransactionList = [
    {
        amount: 100000000000,
        maturity: dec22Fixture,
        side: 0,
        createdAt: 1638356100,
        currency: usdcBytes32,
        averagePrice: 0.8,
    },
    {
        amount: 1000000000000,
        maturity: dec22Fixture,
        side: 1,
        createdAt: 1638355100,
        currency: usdcBytes32,
        averagePrice: 0.9,
    },
];

export const tradesWBTC: TransactionList = [
    {
        amount: 100000000000,
        maturity: dec22Fixture,
        side: 0,
        createdAt: 1638356100,
        currency: wbtcBytes32,
        averagePrice: 0.8,
    },
    {
        amount: 1000000000000,
        maturity: dec22Fixture,
        side: 1,
        createdAt: 1638355100,
        currency: wbtcBytes32,
        averagePrice: 0.9,
    },
];
