import {
    withLendingOrderForm,
    withWalletProvider,
} from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { defaultDelistedStatusSet } from 'src/hooks';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { AdvancedLendingOrderCard } from './AdvancedLendingOrderCard';

export default {
    title: 'Organism/AdvancedLendingOrderCard',
    component: AdvancedLendingOrderCard,
    args: {
        collateralBook: collateralBook37,
        marketPrice: 9917,
        delistedCurrencySet: defaultDelistedStatusSet,
    },
    parameters: {
        connected: true,
    },
    decorators: [withLendingOrderForm, withWalletProvider],
} as Meta<typeof AdvancedLendingOrderCard>;

const Template: StoryFn<typeof AdvancedLendingOrderCard> = args => {
    return <AdvancedLendingOrderCard {...args} />;
};

export const Default = Template.bind({});
export const OnlyLimitOrder = Template.bind({});
OnlyLimitOrder.args = {
    isItayose: true,
    preOrderPosition: 'none',
};

export const Lend = Template.bind({});
Lend.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = canvas.getByRole('radio', { name: 'Lend' });
    lendTab.click();
};

export const FailedAmountValidation = Template.bind({});
FailedAmountValidation.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = canvas.getByRole('radio', { name: 'Lend' });
    lendTab.click();
    const input = canvas.getByRole('textbox', { name: 'Amount' });
    await userEvent.type(input, '999999999', {
        delay: 100,
    });
};

export const BondPriceFailedValidation = Template.bind({});
BondPriceFailedValidation.args = {
    isItayose: true,
    preOrderPosition: 'none',
};
BondPriceFailedValidation.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Bond Price' });
    await userEvent.type(input, '0', {
        delay: 100,
    });
};

export const ItayoseWithPreOrders = Template.bind({});
ItayoseWithPreOrders.args = {
    isItayose: true,
    preOrderPosition: 'lend',
};
