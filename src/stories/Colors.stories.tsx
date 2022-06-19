import { Meta, Story } from '@storybook/react';

export default {
    title: 'Design System/Colors',
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as Meta;

export const Primary: Story = () => (
    <div className='inline-flex flex-col items-center justify-start rounded-3xl bg-white p-10'>
        <div className='flex flex-col items-start justify-start space-y-6'>
            <p className='text-lg font-semibold leading-10 text-gray-900'>
                Primary
            </p>
            <div className='inline-flex items-center justify-start space-x-6'>
                <div className='h-10 w-10 rounded-lg bg-universeBlue' />
                <div className='h-10 w-10 rounded-lg bg-horizonBlue' />
                <div className='h-10 w-10 rounded-lg bg-starBlue' />
                <div className='h-10 w-10 rounded-lg bg-teal' />
                <div className='h-10 w-10 rounded-lg bg-green' />
                <div className='h-10 w-10 rounded-lg bg-orange' />
                <div className='h-10 w-10 rounded-lg bg-red' />
            </div>
            <div className='h-10 w-10 rounded-lg bg-purple' />
        </div>
    </div>
);

export const Secondary: Story = () => (
    <div className='inline-flex flex-col items-start justify-start space-y-6 rounded-3xl bg-white p-10'>
        <p className='text-lg font-semibold leading-10 text-gray-900'>
            Secondary
        </p>
        <div className='inline-flex items-center justify-start space-x-6'>
            <div className='h-10 w-10 rounded-lg bg-galacticOrange' />
            <div className='h-10 w-10 rounded-lg bg-planetaryPurple' />
            <div className='h-10 w-10 rounded-lg bg-nebulaTeal' />
            <div className='h-10 w-10 rounded-lg bg-secondaryPurple ' />
            <div className='h-10 w-10 rounded-lg bg-moonGrey' />
        </div>
    </div>
);
