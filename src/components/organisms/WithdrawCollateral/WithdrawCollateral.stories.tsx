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
            [CurrencySymbol.ETH]: {
                symbol: CurrencySymbol.ETH,
                available: 1,
                name: 'Ethereum',
            },
            [CurrencySymbol.EFIL]: {
                symbol: CurrencySymbol.EFIL,
                available: 100,
                name: 'filecoin',
            },
            [CurrencySymbol.USDC]: {
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },

            [CurrencySymbol.WBTC]: {
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
