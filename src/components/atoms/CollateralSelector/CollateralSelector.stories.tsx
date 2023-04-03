import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralSelector } from './CollateralSelector';

const assetList = [
    {
        symbol: CurrencySymbol.USDC,
        available: 1000,
        name: 'USDC',
    },
    {
        symbol: CurrencySymbol.ETH,
        available: 120,
        name: 'Ethereum',
    },
];

export default {
    title: 'Atoms/CollateralSelector',
    component: CollateralSelector,
    args: {
        headerText: 'Select Asset',
        optionList: assetList,
        onChange: () => {},
    },
} as ComponentMeta<typeof CollateralSelector>;

const Template: ComponentStory<typeof CollateralSelector> = args => (
    <div className='h-20 w-[360px]'>
        <CollateralSelector {...args} />
    </div>
);

export const Default = Template.bind({});
