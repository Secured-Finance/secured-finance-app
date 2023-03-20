import { BigNumber } from 'ethers';
import * as jest from 'jest-mock';
import { getCurrencyMapAsList } from 'src/utils';
import { collateralBook80 } from './fixtures';

export const mockUseSF = () => {
    const mockSecuredFinance = {
        placeLendingOrder: jest.fn(),
        getBorrowUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9687),
                BigNumber.from(9685),
                BigNumber.from(9679),
                BigNumber.from(9674),
                BigNumber.from(9653),
                BigNumber.from(9643),
                BigNumber.from(9627),
                BigNumber.from(9617),
            ])
        ),
        getLendUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9685),
                BigNumber.from(9683),
                BigNumber.from(9677),
                BigNumber.from(9672),
                BigNumber.from(9651),
                BigNumber.from(9641),
                BigNumber.from(9625),
                BigNumber.from(9615),
            ])
        ),
        getMidUnitPrices: jest.fn(() =>
            Promise.resolve([
                BigNumber.from(9686),
                BigNumber.from(9684),
                BigNumber.from(9678),
                BigNumber.from(9673),
                BigNumber.from(9652),
                BigNumber.from(9642),
                BigNumber.from(9626),
                BigNumber.from(9616),
            ])
        ),
        getCollateralBook: jest.fn(() =>
            Promise.resolve({
                collateral: {
                    ...collateralBook80.collateral,
                    ...collateralBook80.nonCollateral,
                },
                collateralCoverage: collateralBook80.coverage,
            })
        ),
        getLendingMarket: jest.fn(() =>
            Promise.resolve({
                contract: {
                    address: '0x0',
                },
            })
        ),

        getMaturities: jest.fn(() =>
            Promise.resolve([
                BigNumber.from('1000'),
                BigNumber.from('2000'),
                BigNumber.from('3000'),
                BigNumber.from('4000'),
                BigNumber.from('5000'),
            ])
        ),

        getLendingMarkets: jest.fn(() =>
            Promise.resolve([
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 1000,
                    name: 'ETH-1000',
                    utcOpeningDate: 1620000000,
                },
                {
                    midRate: 100,
                    lendRate: 200,
                    borrowRate: 300,
                    maturity: 2000,
                    name: 'ETH-2000',
                    utcOpeningDate: 1720000000,
                },
            ])
        ),

        depositCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
                to: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
            })
        ),

        withdrawCollateral: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() =>
                    Promise.resolve({ blockNumber: undefined })
                ),
            })
        ),

        getBorrowOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getLendOrderBook: jest.fn(() =>
            Promise.resolve({
                unitPrices: [
                    BigNumber.from(9690),
                    BigNumber.from(9687),
                    BigNumber.from(9685),
                    BigNumber.from(9679),
                    BigNumber.from(9674),
                ],
                amounts: [
                    BigNumber.from('43000000000000000000000'),
                    BigNumber.from('23000000000000000000000'),
                    BigNumber.from('15000000000000000000000'),
                    BigNumber.from('12000000000000000000000'),
                    BigNumber.from('1800000000000000000000'),
                ],
                quantities: [
                    BigNumber.from('1000'),
                    BigNumber.from('2000'),
                    BigNumber.from('3000'),
                    BigNumber.from('4000'),
                    BigNumber.from('5000'),
                ],
            })
        ),

        getERC20Balance: jest.fn(() => Promise.resolve({ balance: 10000000 })),

        cancelLendingOrder: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        getERC20TokenContractAddress: jest.fn(() =>
            Promise.resolve('0xEd4733fE7BAc4C2934F7e9CE4e0696b2169701D8')
        ),

        mintERC20Token: jest.fn(() =>
            Promise.resolve({
                wait: jest.fn(() => Promise.resolve({ blockNumber: 123 })),
            })
        ),

        getCurrencies: jest.fn(() =>
            Promise.resolve(
                getCurrencyMapAsList().map(currency => currency.symbol)
            )
        ),

        getProtocolDepositAmount: jest.fn(() =>
            Promise.resolve({
                ETH: BigNumber.from('100000000000000000000'), // 100 ETH
                FIL: BigNumber.from('100000000000000000000000'), // 100 000 FIL
                USDC: BigNumber.from('1000000000000'), // 1 000 000 USDC
                WBTC: BigNumber.from('1000000000000'), // 1000 BTC
            })
        ),
    };

    return mockSecuredFinance;
};
