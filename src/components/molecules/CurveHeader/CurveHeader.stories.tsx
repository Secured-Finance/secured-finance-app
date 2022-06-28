import { ComponentMeta, ComponentStory } from '@storybook/react';
import { StorybookProviders } from 'src/setupStorybook';
import {
    updateFilWalletAssetPrice,
    updateFilWalletDailyChange,
} from 'src/store/wallets';
import { CurveHeader } from './CurveHeader';

const PopulateStore = [
    updateFilWalletDailyChange(2.45),
    updateFilWalletAssetPrice(8.02),
];

export default {
    title: 'Organism/CurveHeader',
    component: CurveHeader,
    args: {
        asset: 'Filecoin',
        isBorrow: true,
    },
    argTypes: {},
    decorators: [
        Story => (
            <StorybookProviders dispatchFunctionList={PopulateStore}>
                <Story />
            </StorybookProviders>
        ),
    ],
} as ComponentMeta<typeof CurveHeader>;

const Template: ComponentStory<typeof CurveHeader> = args => (
    <CurveHeader {...args} />
);

export const Default = Template.bind({});
