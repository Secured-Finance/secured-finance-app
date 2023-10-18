import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { assetList } from 'src/stories/mocks/fixtures';
import { DropdownSelector } from './DropdownSelector';

export default {
    title: 'Atoms/DropdownSelector',
    component: DropdownSelector,
    args: {
        optionList: assetList,
        selected: assetList[0],
        onChange: (_v: string) => {},
    },
    argTypes: {
        optionList: {
            name: 'The list of options to display the the dropdown selector',
            control: { disable: true },
        },
        onChange: { control: { disable: true }, action: 'onChange' },
    },
} as Meta<typeof DropdownSelector>;

const Template: StoryFn<typeof DropdownSelector> = args => (
    <DropdownSelector {...args} />
);

export const AssetDropdown = Template.bind({});
export const TermDropdown = Template.bind({});
TermDropdown.args = {
    optionList: [
        { label: 'Sep 2022', value: 'Sep2022' },
        { label: 'Dec 2022', value: 'Dec2022' },
        { label: 'Mar 2023', value: 'Mar2023' },
        { label: 'Jun 2023', value: 'Jun2023' },
    ],
    selected: { label: 'Sep 2022', value: 'Sep2022' },
};
export const LongSelectionDropdown = Template.bind({});
LongSelectionDropdown.args = {
    optionList: [
        { label: 'Sep 2022', value: 'Sep2022' },
        { label: 'Dec 2022', value: 'Dec2022' },
        { label: 'Mar 2023', value: 'Mar2023' },
        { label: 'Jun 2023', value: 'Jun2023' },
        { label: 'Sep 2023', value: 'Sep2023' },
        { label: 'Dec 2023', value: 'Dec2023' },
        { label: 'Mar 2024', value: 'Mar2024' },
        { label: 'Jun 2024', value: 'Jun2024' },
        { label: 'Sep 2024', value: 'Sep2024' },
        { label: 'Dec 2024', value: 'Dec2024' },
    ],
    selected: { label: 'Sep 2022', value: 'Sep2022' },
};

export const RoundedExpandButton = Template.bind({});
RoundedExpandButton.args = {
    variant: 'roundedExpandButton',
};
export const NoLabel = Template.bind({});
NoLabel.args = {
    variant: 'noLabel',
};

export const FullSize = Template.bind({});
FullSize.args = {
    variant: 'fullWidth',
    optionList: [
        { label: 'This is a very long option and it is great', value: '1' },
        {
            label: 'This is a another very long option and it is great',
            value: '2',
        },
    ],
    selected: {
        label: 'This is a very long option and it is great',
        value: '1',
    },
};

export const ExpandedDropdown = Template.bind({});
ExpandedDropdown.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};

const Chip = (
    <div className='rounded-xl bg-black-40 px-4 py-1 text-orange'>Chip</div>
);
export const ExpandedDropdownWithFixedWidth = Template.bind({});
ExpandedDropdownWithFixedWidth.args = {
    variant: 'fixedWidth',
    optionList: assetList.map(a => {
        return { ...a, chip: Chip };
    }),
};
ExpandedDropdownWithFixedWidth.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('button').click();
};
