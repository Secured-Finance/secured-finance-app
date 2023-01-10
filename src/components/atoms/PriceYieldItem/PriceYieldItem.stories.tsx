import { ComponentMeta, ComponentStory } from '@storybook/react';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { LoanValue } from 'src/utils/entities';
import { PriceYieldItem } from './PriceYieldItem';

export default {
    title: 'Atoms/PriceYieldItem',
    component: PriceYieldItem,
    args: {
        loanValue: LoanValue.fromPrice(9800, dec22Fixture.toNumber()),
        align: 'left',
    },
    argTypes: {
        align: {
            control: {
                type: 'select',
                options: ['left', 'right', 'center'],
            },
        },
    },
} as ComponentMeta<typeof PriceYieldItem>;

const Template: ComponentStory<typeof PriceYieldItem> = args => (
    <PriceYieldItem {...args} />
);

export const Default = Template.bind({});
