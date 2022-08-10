import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol } from 'src/utils';
import { AssetInformation } from '.';

export default {
    title: 'Atoms/AssetInformation',
    component: AssetInformation,
    args: {
        header: 'Collateral Assets',
        asset: CurrencySymbol.FIL,
        quantity: 740,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof AssetInformation>;

const Template: ComponentStory<typeof AssetInformation> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <AssetInformation {...args} />;
};

export const Default = Template.bind({});

export const CollateralUtil = Template.bind({});
CollateralUtil.args = {
    header: 'Borrowed Assets',
    asset: CurrencySymbol.USDC,
    quantity: 12000,
};
