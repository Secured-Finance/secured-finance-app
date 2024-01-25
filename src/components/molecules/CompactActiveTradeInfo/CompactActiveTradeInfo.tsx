import { OrderSide } from '@secured-finance/sf-client';
import { getUTCMonthYear } from '@secured-finance/sf-core';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CurrencyIcon } from 'src/components/atoms';
import { UnwindDialog, formatMaturity } from 'src/components/organisms';
import { Position, useCurrencyDelistedStatus } from 'src/hooks';
import {
    resetUnitPrice,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import {
    CurrencySymbol,
    ZERO_BI,
    currencyMap,
    formatLoanValue,
    hexToCurrencySymbol,
    isMaturityPastDays,
    isPastDate,
    ordinaryFormat,
} from 'src/utils';
import { Amount, LoanValue, Maturity } from 'src/utils/entities';

type Props = { data?: (Position & { underMinimalCollateral?: boolean })[] };

export default function CompactActiveTradeInfo({ data }: Props) {
    const { data: delistedCurrencySet } = useCurrencyDelistedStatus();
    const [unwindDialogData, setUnwindDialogData] = useState<{
        maturity: Maturity;
        amount: Amount;
        side: OrderSide;
        show: boolean;
        type: 'UNWIND' | 'REDEEM' | 'REPAY';
    }>();

    const dispatch = useDispatch();
    const router = useRouter();

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    const getMaturityDisplayValue = useCallback(
        (
            maturityTimestamp: number,
            side: OrderSide,
            currency: CurrencySymbol | undefined
        ) => {
            const currentTime = Date.now();
            const dayToMaturity = formatMaturity(
                maturityTimestamp,
                'day',
                currentTime
            );

            if (!isPastDate(maturityTimestamp)) {
                const diffHours = formatMaturity(
                    maturityTimestamp,
                    'hours',
                    currentTime
                );
                const diffMinutes =
                    formatMaturity(maturityTimestamp, 'minutes', currentTime) %
                    60;

                if (dayToMaturity > 1) {
                    return <span className='mx-1'>{dayToMaturity} Days</span>;
                } else if (dayToMaturity === 1) {
                    return `${dayToMaturity} Day`;
                } else {
                    return (
                        <>
                            {diffHours !== 0 && (
                                <span className='mx-1'>{diffHours}h</span>
                            )}
                            {diffMinutes !== 0 && <span>{diffMinutes}m</span>}
                        </>
                    );
                }
            } else {
                if (currency && !delistedCurrencySet.has(currency)) return null;

                if (side === OrderSide.BORROW) {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return `Repay`;
                    else return `${7 - Math.abs(dayToMaturity)}d left to repay`;
                } else {
                    if (isMaturityPastDays(maturityTimestamp, 7))
                        return <span className='text-yellow'>Redeemable</span>;
                    else return `${7 - Math.abs(dayToMaturity)}d to redeem`;
                }
            }
        },
        [delistedCurrencySet]
    );

    if (!data || data.length === 0) return null;

    return (
        <>
            {data.map(
                (
                    order: Position & { underMinimalCollateral?: boolean },
                    i: number
                ) => {
                    const ccy = hexToCurrencySymbol(order.currency);

                    const forwardValue = order.forwardValue;

                    const maturity = order.maturity;
                    const maturityTimestamp = Number(maturity);
                    const side =
                        order.forwardValue < 0
                            ? OrderSide.BORROW
                            : OrderSide.LEND;

                    const contract = `${ccy} ${getUTCMonthYear(
                        maturityTimestamp
                    )}`;

                    const amount = currencyMap[
                        ccy as CurrencySymbol
                    ].fromBaseUnit(order.forwardValue as bigint);

                    const minDecimals =
                        currencyMap[ccy as CurrencySymbol].roundingDecimal;
                    const maxDecimals =
                        currencyMap[ccy as CurrencySymbol].roundingDecimal;

                    const forwardValueDisplayValue = ordinaryFormat(
                        amount,
                        minDecimals,
                        maxDecimals
                    );

                    const pv = isPastDate(Number(maturity))
                        ? undefined
                        : order.amount;

                    let pvDisplay = null;

                    if (pv) {
                        pvDisplay = currencyMap[
                            ccy as CurrencySymbol
                        ].fromBaseUnit(pv as bigint);
                    }

                    const amountColumnValue = isPastDate(Number(maturity))
                        ? BigInt(10000)
                        : order.marketPrice;

                    const marketPrice = LoanValue.fromPrice(
                        Number(amountColumnValue.toString()),
                        Number(maturity.toString()),
                        undefined
                    );

                    const formattedLoanApr = formatLoanValue(
                        marketPrice,
                        'rate'
                    );

                    const text = forwardValue < 0 ? 'Borrow' : 'Lend';

                    return (
                        <div className='px-5' key={`active-trade-info-${i}`}>
                            <div
                                className={classNames(
                                    'flex flex-col gap-4 border-neutral-600 py-4 text-[#FBFAFC]',
                                    { 'border-b': i !== data.length - 1 }
                                )}
                            >
                                <div className='flex justify-between'>
                                    <div className='flex gap-2'>
                                        <CurrencyIcon
                                            ccy={ccy as CurrencySymbol}
                                            variant='large'
                                        />
                                        <div className='flex flex-col items-start gap-1'>
                                            <h2 className='text-[0.9375rem] font-semibold'>
                                                {contract}
                                            </h2>
                                            {forwardValue !== ZERO_BI ? (
                                                <span
                                                    className={classNames(
                                                        'flex w-[45px] items-center justify-center rounded-full px-[0.375rem] py-[0.125rem] text-[0.625rem]',
                                                        {
                                                            'bg-[#FFE5E8] text-[#FF324B]':
                                                                forwardValue <
                                                                0,
                                                            'bg-[#E4FFE7] text-[#10991D]':
                                                                forwardValue >=
                                                                1,
                                                        }
                                                    )}
                                                >
                                                    {text}
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                    <div className='flex flex-col items-end'>
                                        <h3 className='font-semibold text-white'>
                                            {formatLoanValue(
                                                marketPrice,
                                                'price'
                                            )}
                                        </h3>
                                        {!!formattedLoanApr && (
                                            <p className='flex items-center gap-1 text-xs text-[#94A3B8]'>
                                                APR:{' '}
                                                <span className='text-sm font-semibold'>
                                                    {formattedLoanApr}
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className='text-xs text-[#E2E8F0]'>
                                    <ul className='flex w-full flex-col gap-[0.375rem]'>
                                        <li className='flex justify-between'>
                                            <span>Maturity</span>
                                            <span>
                                                {getMaturityDisplayValue(
                                                    maturityTimestamp,
                                                    side,
                                                    ccy
                                                )}
                                            </span>
                                        </li>
                                        {!!forwardValueDisplayValue && (
                                            <li className='flex justify-between'>
                                                <span>Borrow FV</span>
                                                <span>
                                                    {forwardValueDisplayValue}{' '}
                                                    {ccy}
                                                </span>
                                            </li>
                                        )}
                                        {!!pvDisplay && (
                                            <li className='flex justify-between'>
                                                <span>Borrow PV</span>
                                                <span>
                                                    {pvDisplay} {ccy}
                                                </span>
                                            </li>
                                        )}
                                        {!!marketPrice && (
                                            <li className='flex justify-between'>
                                                <span>Market Price</span>
                                                <span>
                                                    {formatLoanValue(
                                                        marketPrice,
                                                        'price'
                                                    )}{' '}
                                                    {ccy}
                                                </span>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='flex flex-col gap-[0.625rem]'>
                                    <button
                                        className='rounded-lg bg-[#5162FF] px-4 py-[0.375rem] text-sm font-semibold text-white'
                                        onClick={() => {
                                            setUnwindDialogData({
                                                maturity: new Maturity(
                                                    maturity
                                                ),
                                                amount: new Amount(
                                                    amount,
                                                    ccy as CurrencySymbol
                                                ),
                                                show: true,
                                                side: side,
                                                type: 'UNWIND',
                                            });
                                        }}
                                    >
                                        Unwind
                                    </button>
                                    <button
                                        className='rounded-lg border border-[#C4CAFF] bg-transparent px-4 py-[0.375rem] text-sm font-semibold text-[#C4CAFF]'
                                        onClick={() => {
                                            dispatch(
                                                setMaturity(Number(maturity))
                                            );
                                            handleCurrencyChange(
                                                ccy as CurrencySymbol
                                            );
                                            router.push('/advanced/');
                                        }}
                                    >
                                        Add/reduce position
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }
            )}
            {unwindDialogData && (
                <UnwindDialog
                    isOpen={unwindDialogData.show}
                    onClose={() =>
                        setUnwindDialogData({
                            ...unwindDialogData,
                            show: false,
                        })
                    }
                    maturity={unwindDialogData.maturity}
                    amount={unwindDialogData.amount}
                    side={unwindDialogData.side}
                    type={unwindDialogData.type}
                />
            )}
        </>
    );
}
