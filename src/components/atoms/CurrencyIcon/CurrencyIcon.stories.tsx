import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CurrencyIcon } from './CurrencyIcon';

export default {
    title: 'Atoms/CurrencyIcon',
    component: CurrencyIcon,
    args: { ccy: CurrencySymbol.WFIL },
    argTypes: {
        ccy: {
            control: {
                type: 'select',
                options: Object.values(CurrencySymbol),
            },
        },
    },
} as Meta<typeof CurrencyIcon>;

const Template: StoryFn<typeof CurrencyIcon> = args => (
    <CurrencyIcon {...args} />
);

export const CurrencyDefault = Template.bind({});
export const CurrencyLarge = Template.bind({});
CurrencyLarge.args = { variant: 'large' };
export const CurrencySmall = Template.bind({});
CurrencySmall.args = { variant: 'small' };

export const CurrencyAll = () => (
    <div className='flex flex-row gap-2'>
        {Object.values(CurrencySymbol).map(ccy => (
            <div className='flex' key={ccy}>
                <CurrencyIcon key={ccy} ccy={ccy} />
            </div>
        ))}
    </div>
);

export const ZeroCouponDefault = Template.bind({});
ZeroCouponDefault.args = { asset: 'zero-coupon' };

export const ZeroCouponLarge = Template.bind({});
ZeroCouponLarge.args = { asset: 'zero-coupon', variant: 'large' };

export const ZeroCouponSmall = Template.bind({});
ZeroCouponSmall.args = { asset: 'zero-coupon', variant: 'small' };
