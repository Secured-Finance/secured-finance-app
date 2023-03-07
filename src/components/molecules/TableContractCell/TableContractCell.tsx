import classNames from 'classnames';
import * as dayjs from 'dayjs';
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
    variant?: 'default' | 'compact';
}) => {
    const ccy = useMemo(() => hexToCurrencySymbol(ccyByte32), [ccyByte32]);
    const contract = useMemo(
        () =>
            `${ccy}-${dayjs
                .unix(maturity.toNumber())
                .format('MMMYYYY')
                .toUpperCase()}`,
        [ccy, maturity]
    );

    if (!ccy) return null;
    return (
        <div className='flex flex-col'>
            <div className='flex h-6 w-40 flex-row justify-start gap-2'>
                <div
                    className={classNames({
                        'mt-1': variant === 'default',
                    })}
                >
                    <CurrencyIcon
                        ccy={ccy}
                        variant={variant === 'default' ? 'default' : 'small'}
                    />
                </div>
                <span className='typography-caption-2 text-neutral-6'>
                    {contract}
                </span>
            </div>
            {variant === 'default' ? (
                <div className='typography-caption-2 ml-8 text-left text-neutral-4'>
                    {currencyMap[ccy].name}
                </div>
            ) : null}
        </div>
    );
};
