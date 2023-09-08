import { renderHook } from '@testing-library/react-hooks';
import { BigNumber } from 'ethers';
import { LoanValue } from 'src/utils/entities';
import { usePrepareOrderbookData } from './usePrepareOrderbookData';

const maturity = 1675252800;
const data = {
    borrowOrderbook: [
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9850, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9851, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9852, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9853, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9854, maturity),
        },
        {
            amount: BigNumber.from('0'),
            value: LoanValue.fromPrice(9855, maturity),
        },
    ],
    lendOrderbook: [
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(9200, maturity),
        },
        {
            amount: BigNumber.from('2'),
            value: LoanValue.fromPrice(9110, maturity),
        },
        {
            amount: BigNumber.from('3'),
            value: LoanValue.fromPrice(9050, maturity),
        },
        {
            amount: BigNumber.from('4'),
            value: LoanValue.fromPrice(9010, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(8980, maturity),
        },
        {
            amount: BigNumber.from('1'),
            value: LoanValue.fromPrice(8960, maturity),
        },
    ],
};

describe('usePrepareOrderbookData', () => {
    it('should return an empty array when no data is provided', () => {
        const { result } = renderHook(() =>
            usePrepareOrderbookData(undefined, 'borrowOrderbook', 1)
        );
        expect(result.current).toEqual([]);
    });

    it('should return the correct data when provided with valid data', () => {
        const { result } = renderHook(() =>
            usePrepareOrderbookData(data, 'borrowOrderbook', 10)
        );
        expect(result.current).toEqual([
            {
                value: LoanValue.fromPrice(9850, maturity),
                amount: BigNumber.from(5),
            },
        ]);
    });

    it('should not aggregate the data when provided with an aggregation factor of 1 but still sort it and remove the zeros', () => {
        const { result } = renderHook(() =>
            usePrepareOrderbookData(data, 'borrowOrderbook', 1)
        );
        expect(result.current).toEqual([
            {
                amount: BigNumber.from('1'),
                value: LoanValue.fromPrice(9854, maturity),
            },
            {
                amount: BigNumber.from('1'),
                value: LoanValue.fromPrice(9853, maturity),
            },
            {
                amount: BigNumber.from('1'),
                value: LoanValue.fromPrice(9852, maturity),
            },
            {
                amount: BigNumber.from('1'),
                value: LoanValue.fromPrice(9851, maturity),
            },
            {
                amount: BigNumber.from('1'),
                value: LoanValue.fromPrice(9850, maturity),
            },
        ]);
    });

    it('should aggregate the data by 1000 when provided with an aggregation factor of 1000', () => {
        const { result } = renderHook(() =>
            usePrepareOrderbookData(data, 'lendOrderbook', 1000)
        );
        expect(result.current).toEqual([
            {
                amount: BigNumber.from('10'),
                value: LoanValue.fromPrice(9000, maturity),
            },
            {
                amount: BigNumber.from('2'),
                value: LoanValue.fromPrice(8000, maturity),
            },
        ]);
    });
});
