import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { ZCTokenIcon } from './ZCTokenIcon';

export default {
    title: 'Atoms/ZCTokenIcon',
    component: ZCTokenIcon,
    args: { ccy: CurrencySymbol.WFIL },
    argTypes: {
        ccy: {
            control: {
                type: 'select',
                options: Object.values(CurrencySymbol),
            },
        },
        variant: {
            control: {
                type: 'select',
                options: ['default', 'large'],
            },
        },
    },
} as Meta<typeof ZCTokenIcon>;

const Template: StoryFn<typeof ZCTokenIcon> = args => <ZCTokenIcon {...args} />;

export const Default = Template.bind({});
export const Large = Template.bind({});
Large.args = { variant: 'large' };
export const Small = Template.bind({});
Small.args = { variant: 'small' };

export const All = () => (
    <div className='flex flex-row gap-2'>
        {Object.values(CurrencySymbol).map(ccy => (
            <div className='flex' key={ccy}>
                <ZCTokenIcon key={ccy} ccy={ccy} />
            </div>
        ))}
    </div>
);
