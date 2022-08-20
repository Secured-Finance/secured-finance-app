import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformation } from './CollateralInformation';

export default {
    title: 'Atoms/CollateralInformation',
    component: CollateralInformation,
    args: {
        asset: CurrencySymbol.ETH,
        quantity: 1.2,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof CollateralInformation>;

const Template: ComponentStory<typeof CollateralInformation> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <CollateralInformation {...args} />;
};

export const Default = Template.bind({});
