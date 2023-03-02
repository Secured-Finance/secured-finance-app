import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
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
            BigNumber.from('1000000000000000000000'),
            CurrencySymbol.FIL
        ),
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof UnwindDialog>;

const Template: ComponentStory<typeof UnwindDialog> = args => (
    <UnwindDialog {...args} />
);

export const Default = Template.bind({});
