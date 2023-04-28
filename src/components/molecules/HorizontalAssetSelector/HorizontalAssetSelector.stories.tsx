import { ComponentMeta, ComponentStory } from '@storybook/react';
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
} as ComponentMeta<typeof HorizontalAssetSelector>;

const Template: ComponentStory<typeof HorizontalAssetSelector> = args => (
    <HorizontalAssetSelector {...args} />
);

export const Default = Template.bind({});
