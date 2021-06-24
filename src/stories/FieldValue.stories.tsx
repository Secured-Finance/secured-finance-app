import React from 'react';
import { Story, Meta } from '@storybook/react';
import { FieldValue, IFieldValue } from 'src/components/new/FieldValue';

export default {
    title: 'Components/FieldValue',
    component: FieldValue,
} as Meta;

const Template: Story<IFieldValue> = args => <FieldValue {...args} />;

export const Default = Template.bind({});
Default.args = {
    field: '1Y Yield',
    value: '4.25%',
};

export const Small = Template.bind({});
Small.args = {
    field: '1Y Yield',
    value: '4.25%',
    small: true,
};
