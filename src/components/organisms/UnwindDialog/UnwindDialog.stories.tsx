import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withAssetPrice, withWalletProvider } from '.storybook/decorators';
import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
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
            BigNumber.from('100000000000000000000'),
            CurrencySymbol.WFIL
        ),
        side: OrderSide.BORROW,
    },
    decorators: [withAssetPrice, withWalletProvider],
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
        connected: true,
    },
} as Meta<typeof UnwindDialog>;

const Template: StoryFn<typeof UnwindDialog> = args => (
    <UnwindDialog {...args} />
);

export const Default = Template.bind({});
export const Repay = Template.bind({});
Repay.args = {
    type: 'REPAY',
};
export const Redeem = Template.bind({});
Redeem.args = {
    type: 'REDEEM',
};
