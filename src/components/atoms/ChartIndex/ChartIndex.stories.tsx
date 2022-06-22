import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ChartIndex } from './';
import { ReactComponent as FilecoinIcon } from 'src/assets/coins/fil.svg';
import { ReactComponent as BitcoinIcon } from 'src/assets/coins/xbc.svg';

export default {
    title: 'Atoms/ChartIndex',
    component: ChartIndex,
    args: {
        asset: 'Filecoin',
        value: '$8.00',
        fluctuation: '-2.45%',
        IconSVG: FilecoinIcon,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof ChartIndex>;

const Template: ComponentStory<typeof ChartIndex> = args => (
    <ChartIndex {...args} />
);

export const Default = Template.bind({});

export const PositiveFluctuation = Template.bind({});
PositiveFluctuation.args = {
    asset: 'Bitcoin',
    value: '$8.00',
    fluctuation: '+2.45%',
    IconSVG: BitcoinIcon,
};
