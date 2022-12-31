import * as dayjs from 'dayjs';
import { useMemo } from 'react';
import { CurrencyIcon } from 'src/components/atoms';
import { currencyMap, CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { hexToString } from 'web3-utils';

export const TableContractCell = ({
    maturity,
    ccyByte32,
}: {
    maturity: Maturity;
    ccyByte32: string;
}) => {
    const ccy = useMemo(
        () => hexToString(ccyByte32) as CurrencySymbol,
        [ccyByte32]
    );
    const contract = useMemo(
        () =>
            `${ccy}-${dayjs
                .unix(maturity.toNumber())
                .format('MMMYYYY')
                .toUpperCase()}`,
        [ccy, maturity]
    );
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row gap-2'>
                <CurrencyIcon ccy={ccy} />
                <span className='typography-caption-2 text-neutral-6'>
                    {contract}
                </span>
            </div>
            <div className='typography-caption-2 ml-8 text-neutral-4'>
                {currencyMap[ccy].name}
            </div>
        </div>
    );
};
