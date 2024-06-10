import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { SuccessPanel } from './SuccessPanel';

export default {
    title: 'Molecules/SuccessPanel',
    component: SuccessPanel,
    args: {
        itemList: [
            ['From', '123456789987654321'],
            ['To', '987654321123456789'],
            ['Price', '10'],
        ],
    },
    parameters: {
        chromatic: { delay: 3000 },
    },
} as Meta<typeof SuccessPanel>;

const Template: StoryFn<typeof SuccessPanel> = args => (
    <SuccessPanel {...args} />
);

export const Default = Template.bind({});
export const WithTransactionHash = Template.bind({});

WithTransactionHash.args = {
    txHash: '1123456789',
    blockExplorerUrl: 'https://sepolia.etherscan.io',
};

WithTransactionHash.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooltip = canvas.getByText('987654321123456789');
    await waitFor(async () => {
        await userEvent.unhover(tooltip);
        await userEvent.hover(tooltip);
    });
};
