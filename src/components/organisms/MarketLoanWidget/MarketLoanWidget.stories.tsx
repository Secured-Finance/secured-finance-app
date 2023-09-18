import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { expect } from '@storybook/jest';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';
import { MarketLoanWidget } from './MarketLoanWidget';

export default {
    title: 'Organism/MarketLoanWidget',
    component: MarketLoanWidget,
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            viewports: [VIEWPORTS.MOBILE, VIEWPORTS.TABLET],
        },
    },
} as Meta<typeof MarketLoanWidget>;

const Template: StoryFn<typeof MarketLoanWidget> = () => <MarketLoanWidget />;

export const Default = Template.bind({});
export const ItayoseMarket = Template.bind({});
ItayoseMarket.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByTestId('Pre-Open');
    await waitFor(() => expect(button).not.toBeDisabled());
    await userEvent.click(button);
};
