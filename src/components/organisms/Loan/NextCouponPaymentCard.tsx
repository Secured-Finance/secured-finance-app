import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'src/components/atoms';
import { resetTransaction } from 'src/store/transaction';
import theme from 'src/theme';
import { formatDate, usdFormat } from 'src/utils';
import { CouponPayment } from 'src/views/Loan/index';

export const NextCouponPaymentCard = ({
    couponPayment,
    filPrice,
    totalAmount,
    onClick,
}: {
    couponPayment: CouponPayment;
    filPrice: number;
    totalAmount: (amount: number) => string;
    onClick: () => void;
}) => {
    const dispatch = useDispatch();
    const couponUsdPayment = useMemo(
        () => (amount: number) => {
            const usdPayment = new BigNumber(amount)
                .multipliedBy(filPrice)
                .toNumber();
            return usdFormat(usdPayment);
        },
        [filPrice]
    );

    useEffect(() => {
        dispatch(resetTransaction());
    }, [dispatch]);

    const Row = ({
        label,
        value,
        highlightLabel,
    }: {
        label: string;
        value: string;
        highlightLabel?: boolean;
    }) => {
        return (
            <div className='mt-3 flex flex-row justify-between text-xs font-normal opacity-90'>
                <p
                    className={classNames(
                        'flex',
                        highlightLabel && 'text-sm font-semibold'
                    )}
                >
                    {label}
                </p>
                <p
                    className={classNames(
                        'flex',
                        highlightLabel && 'text-lightGrey'
                    )}
                >
                    {value}
                </p>
            </div>
        );
    };

    return (
        <div className='flex-grow flex-col text-white'>
            <div className='flex capitalize'>Next Coupon Payment</div>
            <div className='m-2 mb-0 flex flex-grow flex-col border-2 border-tableBorder p-4'>
                <Row
                    label={totalAmount(couponPayment.amount)}
                    value={couponUsdPayment(couponPayment.amount)}
                    highlightLabel
                ></Row>
                <Row
                    label='Payment Notification'
                    value={formatDate(couponPayment.notice)}
                />
                <Row
                    label='Payment Due Date'
                    value={formatDate(couponPayment.payment)}
                />
            </div>
            <div>
                <Button
                    onClick={onClick}
                    text={'Pay Coupon'}
                    style={{
                        marginTop: 15,
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }} // disabled={!(notional > 0)}
                />
            </div>
        </div>
    );
};
