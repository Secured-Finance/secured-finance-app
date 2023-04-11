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
            EFIL: {
                indexCcy: 1,
                symbol: CurrencySymbol.EFIL,
                available: 100,
                name: 'filecoin',
            },
            USDC: {
                indexCcy: 2,
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },

            WBTC: {
                indexCcy: 3,
                symbol: CurrencySymbol.WBTC,
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
