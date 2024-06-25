import { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
import { CurrencyMaturityDropdown } from './CurrencyMaturityDropdown';

export default {
    title: 'Molecules/CurrencyMaturityDropdown',
    component: CurrencyMaturityDropdown,
    args: {
        currencyList: currencyList,
        asset: currencyList[0],
        maturityList: maturityOptions,
        maturity: maturityOptions[0],
        onChange: () => {},
        isItayosePage: false,
    },
    parameters: {
        apolloClient: {
            mocks: [...mockDailyVolumes],
        },
    },
} as Meta<typeof CurrencyMaturityDropdown>;

const Template: StoryFn<typeof CurrencyMaturityDropdown> = args => (
    <CurrencyMaturityDropdown {...args} />
);

export const Default = Template.bind({});

export const ItayosePage = Template.bind({});
ItayosePage.args = {
    isItayosePage: true,
};
ItayosePage.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};

export const OpenedDropdown = Template.bind({});
OpenedDropdown.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};
