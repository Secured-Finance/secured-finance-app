import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { withWalletProvider } from '.storybook/decorators';
import type { Meta } from '@storybook/react';
import { StoryFn } from '@storybook/react';
import { AdvancedLendingEstimationFields } from '.';

const lastTradePrice = 8000;

export default {
    title: 'Molecules/AdvancedLendingEstimationFields',
    component: AdvancedLendingEstimationFields,
    decorators: [withWalletProvider],
    args: {
        assetPrice: 3.56,
        marketPrice: lastTradePrice,
        calculationDate: undefined,
        hasLendOpenOrders: true,
        hasBorrowOpenOrders: true,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof AdvancedLendingEstimationFields>;

const Template: StoryFn<typeof AdvancedLendingEstimationFields> = args => (
    <AdvancedLendingEstimationFields {...args} />
);

export const Default = Template.bind({});
