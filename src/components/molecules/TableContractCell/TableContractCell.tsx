import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import clsx from 'clsx';
import { useMemo } from 'react';
import ErrorCircleIcon from 'src/assets/icons/error-circle.svg';
import WarningCircleIcon from 'src/assets/icons/warning-circle.svg';
import { CurrencyIcon } from 'src/components/atoms';
import { Tooltip } from 'src/components/molecules';
import {
    currencyMap,
    hexToCurrencySymbol,
    isMaturityPastDays,
    isPastDate,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const TableContractCell = ({
    maturity,
    ccyByte32,
    variant = 'default',
    delistedContractSide,
}: {
    maturity: Maturity;
    ccyByte32: string;
    variant?:
        | 'default'
        | 'compact'
        | 'currencyOnly'
        | 'contractOnly'
        | 'compactCurrencyOnly';
    delistedContractSide?: OrderSide;
}) => {
    const ccy = useMemo(() => hexToCurrencySymbol(ccyByte32), [ccyByte32]);
    const contract = useMemo(() => {
        if (variant === 'currencyOnly' || variant === 'compactCurrencyOnly')
            return `${ccy}`;
        if (variant === 'contractOnly')
            return `${getUTCMonthYear(maturity.toNumber())}`;
        return `${ccy}-${getUTCMonthYear(maturity.toNumber())}`;
    }, [ccy, maturity, variant]);

    const iconSize = useMemo(() => {
        if (variant === 'compact') return 'small';
        if (variant === 'currencyOnly') return 'large';
        return 'default';
    }, [variant]);

    if (!ccy) return null;

    const tooltipText =
        delistedContractSide === OrderSide.BORROW
            ? 'Delisting: Repayment period within 7 days of maturity to avoid 7% fee.'
            : 'Delisting: Redemption will be available 7 days post-maturity.';

    const delistedTooltipIcon =
        isPastDate(maturity.toNumber()) &&
        isMaturityPastDays(maturity.toNumber(), 7) &&
        delistedContractSide === OrderSide.LEND ? (
            <WarningCircleIcon />
        ) : (
            <ErrorCircleIcon />
        );

    return (
        <div className='flex flex-col'>
            <div
                className={clsx('flex h-6 flex-row justify-start gap-2', {
                    'tablet:w-32':
                        variant !== 'contractOnly' && variant !== 'compact',
                })}
            >
                {variant !== 'contractOnly' ? (
                    <div
                        className={clsx({
                            'mt-1':
                                variant === 'default' ||
                                variant === 'currencyOnly' ||
                                variant === 'compactCurrencyOnly',
                            'mt-0': variant === 'compact',
                        })}
                    >
                        <CurrencyIcon ccy={ccy} variant={iconSize} />
                    </div>
                ) : null}
                <span className='typography-caption-2 text-neutral-6'>
                    {contract}
                </span>
                {delistedContractSide !== undefined && (
                    <Tooltip
                        placement='bottom-start'
                        iconElement={
                            <div className='mt-1 flex h-3 w-3 items-center justify-center'>
                                {delistedTooltipIcon}
                            </div>
                        }
                    >
                        {tooltipText}
                    </Tooltip>
                )}
            </div>
            {variant !== 'compact' && variant !== 'contractOnly' ? (
                <div
                    className={clsx(
                        'typography-caption-2 text-left text-neutral-4',
                        {
                            'ml-8':
                                variant === 'default' ||
                                variant === 'compactCurrencyOnly',
                            'ml-11': variant === 'currencyOnly',
                        }
                    )}
                >
                    {currencyMap[ccy].name}
                </div>
            ) : null}
        </div>
    );
};
