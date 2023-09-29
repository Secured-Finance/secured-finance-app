import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { dailyVolumes } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { YieldChart } from './';

export default {
    title: 'Organism/YieldChart',
    component: YieldChart,
    chromatic: { pauseAnimationAtEnd: true, diffThreshold: 1 },
    args: {
        asset: CurrencySymbol.WFIL,
        dailyVolumes: dailyVolumes.slice(0, 10),
    },
    argTypes: {},
    decorators: [withAssetPrice, withWalletProvider],
} as Meta<typeof YieldChart>;

const Template: StoryFn<typeof YieldChart> = args => {
    return <YieldChart {...args} />;
};

export const Default = Template.bind({});
export const Loading = Template.bind({});
