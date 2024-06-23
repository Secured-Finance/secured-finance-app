import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { defaultDelistedStatusSet } from 'src/hooks';
import { collateralBook37, maturityOptions } from 'src/stories/mocks/fixtures';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        collateralBook: collateralBook37,
        maturitiesOptionList: maturityOptions,
        marketPrice: 9917,
        delistedCurrencySet: defaultDelistedStatusSet,
    },
    decorators: [withWalletProvider],
    parameters: {
        connected: true,
    },
} as Meta<typeof LendingCard>;

const Template: StoryFn<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});

export const Borrow = Template.bind({});
Borrow.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const borrowTab = canvas.getByRole('radio', { name: 'Borrow' });
    borrowTab.click();
};

export const FailedAmountValidation = Template.bind({});
FailedAmountValidation.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = canvas.getByRole('radio', { name: 'Lend' });
    lendTab.click();
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '999999999', {
        delay: 100,
    });
};
