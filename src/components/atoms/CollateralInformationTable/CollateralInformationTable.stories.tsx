import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralInformationTable } from './CollateralInformationTable';

export default {
    title: 'Atoms/CollateralInformationTable',
    component: CollateralInformationTable,
    args: {
        data: [
            {
                asset: CurrencySymbol.ETH,
                quantity: BigInt('1200000000000000000'),
            },
            {
                asset: CurrencySymbol.USDC,
                quantity: BigInt('100000000'),
            },
        ],
        assetTitle: 'Asset',
    },
} as Meta<typeof CollateralInformationTable>;

const Template: StoryFn<typeof CollateralInformationTable> = args => {
    return <CollateralInformationTable {...args} />;
};

export const Default = Template.bind({});
