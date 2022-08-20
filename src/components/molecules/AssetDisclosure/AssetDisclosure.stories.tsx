import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol } from 'src/utils';
import { AssetDisclosure } from './AssetDisclosure';

export default {
    title: 'Molecules/AssetDisclosure',
    component: AssetDisclosure,
    args: {
        data: [
            { asset: CurrencySymbol.ETH, quantity: 1.2 },
            { asset: CurrencySymbol.USDC, quantity: 100 },
        ],
        walletSource: 'metamask',
        account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
    },
    decorators: [WithAssetPrice],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof AssetDisclosure>;

const Template: ComponentStory<typeof AssetDisclosure> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <AssetDisclosure {...args} />;
};

export const Default = Template.bind({});
