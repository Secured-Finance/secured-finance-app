import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { Meta, StoryFn } from '@storybook/react';
import { ThreeColumnsWithTopBar } from './ThreeColumnsWithTopBar';

const column1 = (
    <div className='bg-red p-10 text-white' key='column1'>
        Column 1
    </div>
);
const column2 = (
    <div className='col-span-12 w-full bg-teal p-10 text-white' key='column2'>
        Column 2
    </div>
);
const column3 = (
    <div className='h-36 bg-green p-10 text-white' key='column3'>
        Column 3
    </div>
);

export default {
    title: 'Templates/ThreeColumnsWithTopBar',
    component: ThreeColumnsWithTopBar,
    args: {
        children: [column1, column2, column3],
        topBar: (
            <div className='bg-planetaryPurple p-10 text-white'>Top Bar</div>
        ),
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof ThreeColumnsWithTopBar>;

const Template: StoryFn<typeof ThreeColumnsWithTopBar> = args => (
    <ThreeColumnsWithTopBar {...args} />
);

export const Default = Template.bind({});
