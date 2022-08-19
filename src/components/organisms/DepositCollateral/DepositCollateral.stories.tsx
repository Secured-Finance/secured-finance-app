import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    WithAssetPrice,
    WithWalletProvider,
} from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
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
                shortName: CurrencySymbol.ETH,
                available: 10,
                name: 'Ethereum',
            },
            USDC: {
                indexCcy: 2,
                shortName: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },
        },
    },
    decorators: [WithAssetPrice, WithWalletProvider],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <DepositCollateral {...args} />;
};

export const Default = Template.bind({});
