import { getUTCMonthYear } from '@secured-finance/sf-core';
import classNames from 'classnames';
import { useMemo } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { currencyMap, hexToCurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const TableContractCell = ({
    maturity,
    ccyByte32,
    variant = 'default',
}: {
    maturity: Maturity;
    ccyByte32: string;
    variant?: 'default' | 'compact' | 'currencyOnly' | 'contractOnly';
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
