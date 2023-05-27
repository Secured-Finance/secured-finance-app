import { ComponentMeta, ComponentStory } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import { TwoColumns } from './TwoColumns';

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
    title: 'Templates/TwoColumns',
    component: TwoColumns,
    args: {
        children: [column1, column2],
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as ComponentMeta<typeof TwoColumns>;

const Template: ComponentStory<typeof TwoColumns> = args => (
    <TwoColumns {...args} />
);

export const Default = Template.bind({});
export const NarrowFirstColumn = Template.bind({});
NarrowFirstColumn.args = {
    narrowFirstColumn: true,
};
