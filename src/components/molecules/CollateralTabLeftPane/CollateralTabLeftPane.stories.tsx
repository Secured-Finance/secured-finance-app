import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CollateralTabLeftPane } from './CollateralTabLeftPane';

export default {
    title: 'Molecules/CollateralTabLeftPane',
    component: CollateralTabLeftPane,
    args: {
        balance: 12000,
        account: 'as',
        onClick: () => {},
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CollateralTabLeftPane>;

const Template: ComponentStory<typeof CollateralTabLeftPane> = args => (
    <CollateralTabLeftPane {...args} />
);

export const Default = Template.bind({});

export const NoAccount = Template.bind({});
NoAccount.args = {
    account: null,
    onClick: () => {},
    balance: undefined,
};
