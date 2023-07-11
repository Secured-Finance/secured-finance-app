import { ComponentMeta, ComponentStory } from '@storybook/react';
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
        variant: {
            control: {
                type: 'select',
                options: ['default', 'large'],
            },
        },
    },
} as ComponentMeta<typeof CurrencyIcon>;

const Template: ComponentStory<typeof CurrencyIcon> = args => (
    <CurrencyIcon {...args} />
);

export const Default = Template.bind({});
export const Large = Template.bind({});
Large.args = { variant: 'large' };
export const Small = Template.bind({});
Small.args = { variant: 'small' };

export const All = () => (
    <div className='flex flex-row gap-2'>
        {Object.values(CurrencySymbol).map(ccy => (
            <div className='flex' key={ccy}>
                <CurrencyIcon key={ccy} ccy={ccy} />
            </div>
        ))}
    </div>
);
