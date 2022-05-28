import { Meta, Story } from '@storybook/react';
import { HashRouter as Router } from 'react-router-dom';
import theme from 'src/theme';
import { Currency } from 'src/utils/currencyList';
import { CouponPayment } from 'src/views/Loan';
import { ThemeProvider } from 'styled-components';
import { NextCouponPaymentCard } from './NextCouponPaymentCard';

export default {
    title: 'Components/Organisms/Loan/NextCouponPaymentCard',
    component: NextCouponPaymentCard,
} as Meta;

export const Default: Story = () => {
    const couponPayment: CouponPayment = {
        amount: 100000,
        id: '123',
        isDone: false,
        notice: 2,
        payment: 10,
        txHash: '1xT',
    };

    return (
        <ThemeProvider theme={theme}>
            <Router>
                <NextCouponPaymentCard
                    couponPayment={couponPayment}
                    currency={Currency.FIL}
                    filPrice={8}
                    onClick={() => {
                        return {
                            action: 'clicked',
                        };
                    }}
                    totalAmount={(amount: number) => {
                        return amount.toString();
                    }}
                />
            </Router>
        </ThemeProvider>
    );
};
