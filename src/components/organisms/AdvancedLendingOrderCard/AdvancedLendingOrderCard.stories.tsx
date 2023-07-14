import { ComponentMeta, ComponentStory } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { collateralBook37 } from 'src/stories/mocks/fixtures';
import { AdvancedLendingOrderCard } from './AdvancedLendingOrderCard';

export default {
    title: 'Organism/AdvancedLendingOrderCard',
    component: AdvancedLendingOrderCard,
    args: {
        collateralBook: collateralBook37,
        onlyLimitOrder: false,
    },
    parameters: {
        connected: true,
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof AdvancedLendingOrderCard>;

const Template: ComponentStory<typeof AdvancedLendingOrderCard> = args => {
    return <AdvancedLendingOrderCard {...args} />;
};

export const Default = Template.bind({});
export const OnlyLimitOrder = Template.bind({});
OnlyLimitOrder.args = {
    onlyLimitOrder: true,
};

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
    const input = canvas.getByRole('textbox', { name: 'Amount' });
    await userEvent.type(input, '999999999', {
        delay: 100,
    });
};
