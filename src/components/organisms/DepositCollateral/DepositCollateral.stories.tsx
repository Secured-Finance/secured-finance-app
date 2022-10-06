import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
    WithAssetPrice,
    WithWalletProvider,
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
            ETH: {
                indexCcy: 0,
                symbol: CurrencySymbol.ETH,
                available: 10,
                name: 'Ethereum',
            },
            USDC: {
                indexCcy: 2,
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },
        },
    },
    decorators: [WithAssetPrice, WithWalletProvider],
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => {
    return <DepositCollateral {...args} />;
};

export const Default = Template.bind({});
