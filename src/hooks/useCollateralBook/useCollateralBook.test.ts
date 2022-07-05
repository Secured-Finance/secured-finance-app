import BigNumber from 'bignumber.js';
import { renderHook } from 'src/test-utils';
import { CollateralBook, useCollateralBook } from './';

jest.mock('@secured-finance/sf-client/dist/utils');
jest.mock('@secured-finance/sf-graph-client', () => {
    return {
        useCollateralBookFromVault: jest.fn((_: string, account: string) => {
            if (!account) {
                return {};
            }
            return {
                data: {
                    collateralBooks: [
                        {
                            currency: {
                                shortName: 'ETH',
                            },
                            collateral: '1',
                            locked: '2',
                            borrowed: '3',
                            independentCollateral: '4',
                            vault: {
                                address: '0x123',
                            },
                        },
                    ],
                },
                error: null,
            };
        }),
    };
});

describe('useCollateralBook hook', () => {
    it('should return the collateral book when given an user and a chainId', () => {
        const { result } = renderHook(() => useCollateralBook('0x0', 1, 'ETH'));
        const colBook = result.current as CollateralBook;
        expect(colBook.ccyIndex).toEqual(0);
        expect(colBook.ccyName).toEqual('ETH');
        expect(colBook.collateral).toEqual(new BigNumber('4'));
    });

    it('should return the empty book when given an undefined user', () => {
        const { result } = renderHook(() =>
            useCollateralBook(undefined, 1, 'ETH')
        );
        const colBook = result.current as CollateralBook;
        expect(colBook.ccyIndex).toEqual(0);
        expect(colBook.ccyName).toEqual('ETH');
        expect(colBook.collateral).toEqual(new BigNumber('0'));
    });
});
