import { ComponentMeta, ComponentStory } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import {
    withAssetPrice,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
import { DepositCollateral } from './DepositCollateral';

export default {
    title: 'Organism/DepositCollateral',
    component: DepositCollateral,
    args: {
        isOpen: true,
        onClose: () => {},
        collateralList: {
            [CurrencySymbol.ETH]: {
                symbol: CurrencySymbol.ETH,
                available: 10,
                name: 'Ethereum',
            },
            [CurrencySymbol.USDC]: {
                symbol: CurrencySymbol.USDC,
                available: 50,
                name: 'USDC',
            },
        },
    },
    decorators: [withAssetPrice, withWalletProvider],
} as ComponentMeta<typeof DepositCollateral>;

const Template: ComponentStory<typeof DepositCollateral> = args => {
    return <DepositCollateral {...args} />;
};

export const Default = Template.bind({});
export const LongInput = Template.bind({});
LongInput.play = async () => {
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{backspace}');
    await userEvent.type(input, '123456789.123', {
        delay: 100,
    });
};
