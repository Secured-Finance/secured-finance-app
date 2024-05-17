import { Meta, StoryFn } from '@storybook/react';
import { currencyList, maturityOptions } from 'src/stories/mocks/fixtures';
import { CurrencyMaturityDropdown } from './CurrencyMaturityDropdown';

export default {
    title: 'Molecules/CurrencyMaturityDropdown',
    component: CurrencyMaturityDropdown,
    args: {
        currencyList: currencyList,
        asset: currencyList[0],
        maturityList: maturityOptions,
    },
} as Meta<typeof CurrencyMaturityDropdown>;

const Template: StoryFn<typeof CurrencyMaturityDropdown> = args => (
    <CurrencyMaturityDropdown {...args} />
);

export const Default = Template.bind({});
