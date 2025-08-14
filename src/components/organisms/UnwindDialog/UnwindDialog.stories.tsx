import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setAmount, setCurrency } from 'src/store/landingOrderForm';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { Amount } from 'src/utils/entities';
import { UnwindDialog } from './UnwindDialog';

export default {
    title: 'Organism/UnwindDialog',
    component: UnwindDialog,
    args: {
        isOpen: true,
        onClose: () => {},
        maturity: dec22Fixture,
        amount: new Amount(
            BigInt('100000000000000000000'),
            CurrencySymbol.WFIL,
        ),
        side: OrderSide.BORROW,
    },
    chromatic: { delay: 1000 },
    decorators: [withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
        connected: true,
    },
} as Meta<typeof UnwindDialog>;

const Template: StoryFn<typeof UnwindDialog> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(setCurrency(CurrencySymbol.WFIL));
            dispatch(setAmount('100000000000000000000'));
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch]);

    return <UnwindDialog {...args} />;
};

export const Default = Template.bind({});
export const Repay = Template.bind({});
Repay.args = {
    type: 'REPAY',
};
export const Redeem = Template.bind({});
Redeem.args = {
    type: 'REDEEM',
};
