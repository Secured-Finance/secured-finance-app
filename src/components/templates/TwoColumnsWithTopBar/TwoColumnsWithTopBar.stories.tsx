import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import { TwoColumnsWithTopBar } from './TwoColumnsWithTopBar';

const column1 = (
    <div className='bg-red p-10 text-white' key='column1'>
        Column 1
    </div>
);
const column2 = (
    <div className='bg-teal p-10 text-white' key='column2'>
        Column 2
    </div>
);
export default {
    title: 'Templates/TwoColumnsWithTopBar',
    component: TwoColumnsWithTopBar,
    args: {
        children: [column1, column2],
        topBar: (
            <div className='bg-planetaryPurple p-10 text-white'>
                This is a great top bar
            </div>
        ),
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof TwoColumnsWithTopBar>;

const Template: ComponentStory<typeof TwoColumnsWithTopBar> = args => (
    <TwoColumnsWithTopBar {...args} />
);

export const Default = Template.bind({});
