import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    withAssetPrice,
    withMaturities,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { collateralBook37, maturityOptions } from 'src/stories/mocks/fixtures';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        collateralBook: collateralBook37,
        maturitiesOptionList: maturityOptions,
        marketPrice: 9917,
    },
    decorators: [withAssetPrice, withMaturities, withWalletProvider],
    parameters: {
        connected: true,
    },
} as Meta<typeof LendingCard>;

const Template: StoryFn<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});

export const Lend = Template.bind({});
Lend.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = await canvas.findByText('Lend');
    await userEvent.click(lendTab);
};

export const FailedAmountValidation = Template.bind({});
FailedAmountValidation.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = await canvas.findByText('Lend');
    await userEvent.click(lendTab);
    const input = await canvas.findByRole('textbox');
    await userEvent.type(input, '999999999', {
        delay: 100,
    });
};
