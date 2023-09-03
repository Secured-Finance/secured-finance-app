import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { withMaturities } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
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
    decorators: [withMaturities],
} as Meta<typeof MarketLoanWidget>;

const Template: StoryFn<typeof MarketLoanWidget> = () => <MarketLoanWidget />;

export const Default = Template.bind({});
export const ItayoseMarket = Template.bind({});
ItayoseMarket.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Pre-Open').click();
};
