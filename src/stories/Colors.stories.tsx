import { Meta, Story } from '@storybook/react';

export default {
    title: 'Design System/Colors',
} as Meta;

export const Colors: Story = () => (
    <div className='inline-grid grid-cols-1 gap-4'>
        <div className='flex-col items-start justify-start rounded-3xl bg-white p-10'>
            <div className='flex flex-col items-start justify-start space-y-6'>
                <p className='text-lg font-semibold leading-10 text-black-80'>
                    Primary
                </p>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-10 rounded-lg bg-neutral-900' />
                    <div className='h-10 w-10 rounded-lg bg-starBlue-10' />
                    <div className='h-10 w-10 rounded-lg bg-teal' />
                    <div className='h-10 w-10 rounded-lg bg-green' />
                    <div className='h-10 w-10 rounded-lg bg-orange' />
                    <div className='h-10 w-10 rounded-lg bg-red' />
                </div>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-10 rounded-lg bg-purple' />
                    <div className='h-10 w-10 rounded-lg bg-gunMetal' />
                </div>
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-6 rounded-3xl bg-white p-10'>
            <p className='text-lg font-semibold leading-10 text-black-80'>
                Secondary
            </p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-10 rounded-lg bg-galacticOrange' />
                <div className='h-10 w-10 rounded-lg bg-planetaryPurple' />
                <div className='h-10 w-10 rounded-lg bg-nebulaTeal' />
                <div className='bg-secondaryPurple h-10 w-10 rounded-lg ' />
                <div className='h-10 w-10 rounded-lg bg-moonGrey' />
                <div className='h-10 w-10 rounded-lg bg-slateGray' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start rounded-3xl bg-white p-10'>
            <div className='flex flex-col items-start justify-start space-y-6'>
                <p className='text-lg font-semibold leading-10 text-black-80'>
                    Shades
                </p>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-10 rounded-lg bg-starBlue-80' />
                    <div className='h-10 w-10 rounded-lg bg-starBlue-60' />
                    <div className='h-10 w-10 rounded-lg bg-starBlue-40' />
                    <div className='h-10 w-10 rounded-lg bg-starBlue-20' />
                    <div className='h-10 w-10 rounded-lg bg-starBlue-10' />
                </div>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-10 rounded-lg bg-black-90' />
                    <div className='h-10 w-10 rounded-lg bg-black-80' />
                    <div className='h-10 w-10 rounded-lg bg-black-70' />
                    <div className='h-10 w-10 rounded-lg bg-black-60' />
                    <div className='h-10 w-10 rounded-lg bg-black-50' />
                    <div className='h-10 w-10 rounded-lg bg-black-40' />
                    <div className='h-10 w-10 rounded-lg bg-black-30' />
                    <div className='h-10 w-10 rounded-lg bg-black-20' />
                    <div className='h-10 w-10 rounded-lg bg-black-10' />
                </div>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-90' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-80' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-70' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-60' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-50' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-40' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-30' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-20' />
                    <div className='h-10 w-10 rounded-lg border-2 bg-white-10' />
                </div>
            </div>
        </div>
    </div>
);
