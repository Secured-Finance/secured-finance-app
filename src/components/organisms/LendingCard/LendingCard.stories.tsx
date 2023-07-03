import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    collateralBook37,
    dec22Fixture,
    maturityOptions,
} from 'src/stories/mocks/fixtures';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { LendingCard } from './LendingCard';

export default {
    title: 'Organism/LendingCard',
    component: LendingCard,
    args: {
        collateralBook: collateralBook37,
        marketValue: LoanValue.fromApr(
            new Rate(10000),
            dec22Fixture.toNumber()
        ),
        maturitiesOptionList: maturityOptions,
    },
    decorators: [withAssetPrice, withWalletProvider],
    parameters: {
        connected: true,
    },
} as ComponentMeta<typeof LendingCard>;

const Template: ComponentStory<typeof LendingCard> = args => {
    return <LendingCard {...args} />;
};

export const Default = Template.bind({});

export const Lend = Template.bind({});
Lend.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = canvas.getByText('Lend');
    lendTab.click();
};

export const FailedAmountValidation = Template.bind({});
FailedAmountValidation.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lendTab = canvas.getByText('Lend');
    lendTab.click();
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '999999999', {
        delay: 100,
    });
};
