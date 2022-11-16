import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { ColorBar } from './ColorBar';

export default {
    title: 'Atoms/ColorBar',
    component: ColorBar,
    args: {
        value: BigNumber.from(100000),
        total: BigNumber.from(1000000),
        color: 'red',
        align: 'left',
    },
    argTypes: {
        value: { control: 'number', defaultValue: 100000 },
        total: { control: 'number', defaultValue: 1000000 },
        color: { control: { type: 'select', options: ['red', 'green'] } },
        align: { control: { type: 'select', options: ['left', 'right'] } },
    },
} as ComponentMeta<typeof ColorBar>;

const Template: ComponentStory<typeof ColorBar> = args => (
    <div className='relative h-12 w-2/3'>
        <ColorBar {...args} />
    </div>
);

export const Default = Template.bind({});
