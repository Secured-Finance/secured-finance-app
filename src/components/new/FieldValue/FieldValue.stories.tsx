import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FieldValue, IFieldValue } from './';
import { VerifiedIcon, telegram } from '../icons';

export default {
    title: 'Components/FieldValue',
    component: FieldValue,
} as Meta;

const Template: Story<IFieldValue> = args => <FieldValue {...args} />;

export const Default = Template.bind({});
Default.args = {
    field: '1Y Yield',
    value: '4.25%',
    large: false,
    bold: false,
};

export const Large = Template.bind({});
Large.args = {
    field: '1Y Yield',
    value: '4.25%',
    large: true,
};

export const Bold = Template.bind({});
Bold.args = {
    field: '1Y Yield',
    value: '4.25%',
    bold: true,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
    field: '1Y Yield',
    value: '4.25%',
    icon: <VerifiedIcon fill={'#666cf3'} />,
};

export const WithStringIcon = Template.bind({});
WithStringIcon.args = {
    field: '1Y Yield',
    value: '4.25%',
    icon: telegram,
    bold: false,
};
