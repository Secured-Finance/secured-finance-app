import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CurveHeaderAsset } from './';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import BitcoinIcon from 'src/assets/coins/xbc.svg';

export default {
    title: 'Atoms/CurveHeaderAsset',
    component: CurveHeaderAsset,
    args: {
        asset: 'Filecoin',
        value: '$8.00',
        fluctuation: '-2.45%',
        IconSVG: FilecoinIcon,
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof CurveHeaderAsset>;

const Template: ComponentStory<typeof CurveHeaderAsset> = args => (
    <CurveHeaderAsset {...args} />
);

export const Default = Template.bind({});

export const PositiveFluctuation = Template.bind({});
PositiveFluctuation.args = {
    asset: 'Bitcoin',
    value: '$8.00',
    fluctuation: '+2.45%',
    IconSVG: BitcoinIcon,
};
