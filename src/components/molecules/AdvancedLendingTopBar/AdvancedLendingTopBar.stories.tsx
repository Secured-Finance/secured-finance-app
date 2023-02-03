import { ComponentMeta, ComponentStory } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { AdvancedLendingTopBar } from '.';

export default {
    title: 'Molecules/AdvancedLendingTopBar',
    component: AdvancedLendingTopBar,
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
    },
} as ComponentMeta<typeof AdvancedLendingTopBar>;

const Template: ComponentStory<typeof AdvancedLendingTopBar> = args => (
    <AdvancedLendingTopBar {...args} />
);

export const Default = Template.bind({});

export const Values = Template.bind({});
Values.args = {
    values: [26.16, 24.2, 894, 10000000],
};
