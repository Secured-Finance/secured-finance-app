import { Meta, Story } from '@storybook/react';

export default {
    title: 'Design System/Colors',
    parameters: {
        layout: 'fullscreen',
    },
} as Meta;

export const Colors: Story = () => (
    <div className='inline-grid w-full grid-cols-1 gap-4 bg-[#010316] p-10'>
        <div className='flex-col items-start justify-start'>
            <div className='flex flex-col items-start justify-start space-y-4'>
                <p className='typography-mobile-h-5 text-neutral-50'>Neutral</p>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-32 rounded-lg bg-neutral-50' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-100' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-200' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-300' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-400' />
                </div>
                <div className='inline-flex items-center justify-start space-x-6'>
                    <div className='h-10 w-32 rounded-lg bg-neutral-500' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-600' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-700' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-800' />
                    <div className='h-10 w-32 rounded-lg bg-neutral-900' />
                </div>
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Primary</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-primary-300' />
                <div className='h-10 w-32 rounded-lg bg-primary-500' />
                <div className='h-10 w-32 rounded-lg bg-primary-700' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Secondary</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-secondary-300' />
                <div className='h-10 w-32 rounded-lg bg-secondary-500' />
                <div className='h-10 w-32 rounded-lg bg-secondary-700' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Tertiary</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-tertiary-300' />
                <div className='h-10 w-32 rounded-lg bg-tertiary-500' />
                <div className='h-10 w-32 rounded-lg bg-tertiary-700' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Success</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-success-300' />
                <div className='h-10 w-32 rounded-lg bg-success-500' />
                <div className='h-10 w-32 rounded-lg bg-success-700' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Warning</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-warning-300' />
                <div className='h-10 w-32 rounded-lg bg-warning-500' />
                <div className='h-10 w-32 rounded-lg bg-warning-700' />
            </div>
        </div>
        <div className='inline-flex flex-col items-start justify-start space-y-4'>
            <p className='typography-mobile-h-5 text-neutral-50'>Error</p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-32 rounded-lg bg-error-300' />
                <div className='h-10 w-32 rounded-lg bg-error-500' />
                <div className='h-10 w-32 rounded-lg bg-error-700' />
            </div>
        </div>
    </div>
);
