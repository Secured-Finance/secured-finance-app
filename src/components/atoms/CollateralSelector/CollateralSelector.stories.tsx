import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Currency } from 'src/utils';
import { CollateralSelector } from './CollateralSelector';

const assetList = [
    { id: 1, asset: Currency.USDC, available: 1000, assetName: 'USDC' },
    { id: 2, asset: Currency.ETH, available: 120, assetName: 'Ethereum' },
    { id: 3, asset: Currency.FIL, available: 1020, assetName: 'Filecoin' },
];

export default {
    title: 'Atoms/CollateralSelector',
    component: CollateralSelector,
    args: {
        headerText: 'Select Asset',
        optionList: assetList,
        onChange: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CollateralSelector>;

const Template: ComponentStory<typeof CollateralSelector> = args => (
    <div className='h-20 w-[360px]'>
        <CollateralSelector {...args} />
    </div>
);

export const Default = Template.bind({});
