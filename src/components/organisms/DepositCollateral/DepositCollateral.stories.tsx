import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { DepositCollateral } from './DepositCollateral';

export default {
    title: 'Organism/DepositCollateral',
    component: DepositCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralList: {
            [CurrencySymbol.ETH]: {
                indexCcy: 0,
                symbol: CurrencySymbol.ETH,
                available: 10,
                name: 'Ethereum',
            },
            [CurrencySymbol.FIL]: {
                indexCcy: 1,
                symbol: CurrencySymbol.FIL,
                available: 50,
                name: 'FIL',
            },
            [CurrencySymbol.USDC]: {
                indexCcy: 2,
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },
            [CurrencySymbol.BTC]: {
                indexCcy: 3,
                symbol: CurrencySymbol.BTC,
                available: 50,
                name: 'BTC',
            },
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => {
    return <DepositCollateral {...args} />;
};

export const Default = Template.bind({});
