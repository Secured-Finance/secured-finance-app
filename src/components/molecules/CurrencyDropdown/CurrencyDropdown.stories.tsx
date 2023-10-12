import { Meta, StoryFn } from '@storybook/react';
import { currencyList } from 'src/stories/mocks/fixtures';
import { CurrencyDropdown } from './CurrencyDropdown';

export default {
    title: 'Molecules/CurrencyDropdown',
    component: CurrencyDropdown,
    args: {
        currencyOptionList: currencyList,
        selected: currencyList[0],
        onChange: () => {},
    },
} as Meta<typeof CurrencyDropdown>;

const Template: StoryFn<typeof CurrencyDropdown> = args => (
    <CurrencyDropdown {...args} />
);

export const Default = Template.bind({});
