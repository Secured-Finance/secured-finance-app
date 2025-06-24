import { OrderSide } from '@secured-finance/sf-client';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { OrderDisplayBox } from 'src/components/atoms';
import { useBreakpoint, useOrderEstimation } from 'src/hooks';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { OrderType } from 'src/types';
import {
    amountFormatterFromBase,
    currencyMap,
    divide,
    formatLoanValue,
    multiply,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { Amount, LoanValue } from 'src/utils/entities';
import { useAccount } from 'wagmi';

interface AdvancedLendingEstimationFieldsProps {
    assetPrice: number;
    marketPrice?: number;
    calculationDate?: number;
    hasLendOpenOrders?: boolean;
    hasBorrowOpenOrders?: boolean;
}

export const AdvancedLendingEstimationFields = ({
    assetPrice,
    marketPrice,
    calculationDate,
    hasLendOpenOrders,
    hasBorrowOpenOrders,
}: AdvancedLendingEstimationFieldsProps) => {
    const { address, isConnected } = useAccount();

    const {
        currency,
        amount,
        orderType,
        unitPrice,
        maturity,
        unitPriceExists,
        side,
    } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const isMobile = useBreakpoint('tablet');

    const { data: orderEstimationInfo, isLoading } = useOrderEstimation(
        address,
        orderType === OrderType.LIMIT
    );

    const orderEstimationAmount = useMemo(() => {
        if (!orderEstimationInfo || !orderEstimationInfo.filledAmount) return 0;
        return amountFormatterFromBase[currency](
            orderEstimationInfo.filledAmount
        );
    }, [currency, orderEstimationInfo]);

    const orderEstimationAmountInFV = useMemo(() => {
        if (!orderEstimationInfo || !orderEstimationInfo.filledAmountInFV)
            return 0;
        return amountFormatterFromBase[currency](
            orderEstimationInfo.filledAmountInFV
        );
    }, [currency, orderEstimationInfo]);

    const showEstimationLoader = isLoading && orderType === OrderType.MARKET;

    const showDashes =
        orderType === OrderType.MARKET &&
        (side === OrderSide.BORROW ? !hasLendOpenOrders : !hasBorrowOpenOrders);

    const orderAmount = amount > 0 ? new Amount(amount, currency) : undefined;

    const calculateFutureValue = useCallback(
        (amount: bigint, unitPrice: number) => {
            if (unitPrice === 0) {
                return 0;
            }
            return divide(
                multiply(
                    amountFormatterFromBase[currency](amount),
                    100,
                    currencyMap[currency].roundingDecimal
                ),
                unitPrice,
                currencyMap[currency].roundingDecimal
            );
        },
        [currency]
    );

    const loanValue = useMemo(() => {
        if (!maturity) return LoanValue.ZERO;
        if (unitPrice !== undefined && unitPriceExists) {
            return LoanValue.fromPrice(
                unitPrice * 100.0,
                maturity,
                calculationDate
            );
        }
        if (!marketPrice) return LoanValue.ZERO;
        return LoanValue.fromPrice(marketPrice, maturity, calculationDate);
    }, [maturity, unitPrice, unitPriceExists, marketPrice, calculationDate]);

    const estimatedLoanValue = useMemo(() => {
        if (
            !orderEstimationInfo ||
            !maturity ||
            !orderEstimationInfo.filledAmount ||
            !orderEstimationInfo.filledAmountInFV
        )
            return LoanValue.ZERO;
        return LoanValue.fromPrice(
            divide(
                multiply(
                    orderEstimationInfo.filledAmount,
                    10000.0,
                    currencyMap[currency].roundingDecimal
                ),
                orderEstimationInfo.filledAmountInFV,
                currencyMap[currency].roundingDecimal
            ),
            maturity,
            calculationDate
        );
    }, [orderEstimationInfo, currency, maturity, calculationDate]);

    const unitPriceValue = useMemo(() => {
        if (!maturity) return undefined;
        if (!unitPriceExists) {
            return undefined;
        } else if (unitPrice !== undefined) {
            return unitPrice.toString();
        }
        if (!marketPrice) return undefined;
        if (!isConnected) return undefined;
        return (marketPrice / 100.0).toString();
    }, [maturity, marketPrice, unitPrice, isConnected, unitPriceExists]);

    const orderPrice = useMemo(() => {
        if (showDashes) return '--';

        return formatLoanValue(
            orderType === OrderType.LIMIT ? loanValue : estimatedLoanValue,
            'price'
        );
    }, [showDashes, orderType, loanValue, estimatedLoanValue]);

    const orderApr = useMemo(() => {
        if (showDashes) return '--';

        return formatLoanValue(
            orderType === OrderType.LIMIT ? loanValue : estimatedLoanValue,
            'rate'
        );
    }, [showDashes, orderType, loanValue, estimatedLoanValue]);

    const orderPV = useMemo(() => {
        if (showDashes) return '--';

        const amount =
            orderType === OrderType.LIMIT
                ? orderAmount?.value ?? 0
                : orderEstimationAmount;

        if (isMobile) {
            return `${ordinaryFormat(
                amount,
                0,
                currencyMap[currency].roundingDecimal
            )} ${currency}`;
        } else {
            return `${ordinaryFormat(
                amount,
                0,
                currencyMap[currency].roundingDecimal
            )} ${currency} (${usdFormat(amount * assetPrice ?? 0, 2)})`;
        }
    }, [
        showDashes,
        orderType,
        orderAmount?.value,
        orderEstimationAmount,
        isMobile,
        currency,
        assetPrice,
    ]);

    const orderFV = useMemo(() => {
        if (showDashes) return '--';

        if (
            orderType === OrderType.LIMIT &&
            (!unitPriceValue || unitPriceValue === '' || unitPriceValue === '0')
        ) {
            return isMobile ? `0 ${currency}` : `0 ${currency} ($0.00)`;
        }

        const fv =
            orderType === OrderType.LIMIT
                ? calculateFutureValue(amount, Number(unitPriceValue))
                : orderEstimationAmountInFV;

        const totalValue = assetPrice ? fv * assetPrice : 0;

        if (isMobile) {
            return `${ordinaryFormat(
                fv,
                0,
                currencyMap[currency].roundingDecimal
            )} ${currency}`;
        } else {
            return `${ordinaryFormat(
                fv,
                0,
                currencyMap[currency].roundingDecimal
            )} ${currency} (${usdFormat(totalValue, 2)})`;
        }
    }, [
        showDashes,
        orderType,
        amount,
        unitPriceValue,
        orderEstimationAmountInFV,
        isMobile,
        currency,
        assetPrice,
        calculateFutureValue,
    ]);

    return (
        <>
            <OrderDisplayBox
                field='Est. Price'
                value={orderPrice}
                isLoading={showEstimationLoader}
            />
            <OrderDisplayBox
                field='Est. APR'
                value={orderApr}
                isLoading={showEstimationLoader}
            />
            <OrderDisplayBox
                field={isMobile ? 'PV' : 'Present Value'}
                value={orderPV}
                isLoading={showEstimationLoader}
            />
            <OrderDisplayBox
                field={isMobile ? 'FV' : 'Future Value'}
                value={orderFV}
                isLoading={showEstimationLoader}
            />
        </>
    );
};
