import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { WithdrawCollateral } from './WithdrawCollateral';

export default {
    title: 'Organism/WithdrawCollateral',
    component: WithdrawCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralList: {
            ETH: {
                indexCcy: 0,
                symbol: CurrencySymbol.ETH,
                available: 1,
                name: 'Ethereum',
            },
            FIL: {
                indexCcy: 1,
                symbol: CurrencySymbol.FIL,
                available: 100,
                name: 'Filecoin',
            },
            USDC: {
                indexCcy: 2,
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },

            BTC: {
                indexCcy: 3,
                symbol: CurrencySymbol.BTC,
                available: 1,
                name: 'Bitcoin',
            },
        },
    },
    decorators: [withWalletProvider, withAssetPrice],
} as ComponentMeta<typeof WithdrawCollateral>;

const Template: ComponentStory<typeof WithdrawCollateral> = args => {
    return <WithdrawCollateral {...args} />;
};

export const Default = Template.bind({});
