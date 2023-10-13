import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import classNames from 'classnames';
import { useMemo } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';
import { currencyMap, hexToCurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import ErrorCircleIcon from 'src/assets/icons/error-circle.svg';

export const TableContractCell = ({
    maturity,
    ccyByte32,
    variant = 'default',
    delistedContractSide,
}: {
    maturity: Maturity;
    ccyByte32: string;
    variant?: 'default' | 'compact' | 'currencyOnly' | 'contractOnly';
    delistedContractSide?: OrderSide;
}) => {
    const ccy = useMemo(() => hexToCurrencySymbol(ccyByte32), [ccyByte32]);
    const contract = useMemo(() => {
        if (variant === 'currencyOnly') return `${ccy}`;
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

    return (
        <div className='flex flex-col'>
            <div
                className={classNames('flex h-6 flex-row justify-start gap-2', {
                    'w-40': variant !== 'contractOnly',
                })}
            >
                {variant !== 'contractOnly' ? (
                    <div
                        className={classNames({
                            'mt-1':
                                variant === 'default' ||
                                variant === 'currencyOnly',
                            'mt-0': variant === 'compact',
                        })}
                    >
                        <CurrencyIcon ccy={ccy} variant={iconSize} />
                    </div>
                ) : null}
                <span className='typography-caption-2 text-neutral-6'>
                    {contract}
                </span>
                {delistedContractSide && (
                    <Tooltip
                        align='right'
                        iconElement={<ErrorCircleIcon className='h-4 w-4' />}
                    >
                        {tooltipText}
                    </Tooltip>
                )}
            </div>
            {variant !== 'compact' && variant !== 'contractOnly' ? (
                <div
                    className={classNames(
                        'typography-caption-2 text-left text-neutral-4',
                        {
                            'ml-8': variant === 'default',
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
