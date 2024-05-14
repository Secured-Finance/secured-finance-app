import type { Meta, StoryFn } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { HorizontalAssetSelector } from './HorizontalAssetSelector';

export default {
    title: 'Molecules/HorizontalAssetSelector',
    component: HorizontalAssetSelector,
    args: {
        selectedAsset: currencyList[0],
        assetList: currencyList,
        options: maturityOptions.map(o => ({
            label: o.label,
            value: o.value.toString(),
        })),
        selected: {
            label: maturityOptions[0].label,
            value: maturityOptions[0].value.toString(),
        },
        onAssetChange: () => {},
        onTermChange: () => {},
    },
} as Meta<typeof HorizontalAssetSelector>;

const Template: StoryFn<typeof HorizontalAssetSelector> = args => (
    <div className='max-w-lg'>
        <HorizontalAssetSelector {...args} />
    </div>
);

export const Default = Template.bind({});
