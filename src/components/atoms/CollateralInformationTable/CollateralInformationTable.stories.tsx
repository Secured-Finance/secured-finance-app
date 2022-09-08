import { ComponentMeta, ComponentStory } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { WithAssetPrice } from 'src/../.storybook/decorators';
import { updateLatestBlock } from 'src/store/blockchain';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformationTable } from './CollateralInformationTable';

export default {
    title: 'Atoms/CollateralInformationTable',
    component: CollateralInformationTable,
    args: {
        data: [
            { asset: CurrencySymbol.ETH, quantity: 1.2 },
            { asset: CurrencySymbol.USDC, quantity: 100 },
        ],
    },
    decorators: [WithAssetPrice],
} as ComponentMeta<typeof CollateralInformationTable>;

const Template: ComponentStory<typeof CollateralInformationTable> = args => {
    const dispatch = useDispatch();
    useEffect(() => {
        setTimeout(() => dispatch(updateLatestBlock(12345)), 100);
    }, [dispatch]);
    return <CollateralInformationTable {...args} />;
};

export const Default = Template.bind({});
