import { Meta, StoryFn } from '@storybook/react';
// import { currencyList } from 'src/stories/mocks/fixtures';
import { CurrencyMaturityDropdown } from './CurrencyMaturityDropdown';

export default {
    title: 'Molecules/CurrencyMaturityDropdown',
    component: CurrencyMaturityDropdown,
    // args: {
    //     currencyOptionList: currencyList,
    //     selected: currencyList[0],
    //     onChange: () => {},
    //     variant: 'fixedWidth',
    // },
} as Meta<typeof CurrencyMaturityDropdown>;

const Template: StoryFn<typeof CurrencyMaturityDropdown> = args => (
    <CurrencyMaturityDropdown {...args} />
);

export const Default = Template.bind({});
